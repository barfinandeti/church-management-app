'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin, getChurchFilter } from '@/lib/auth';

// Helper: convert Editor.js-style JSON → HTML string
function normalizeBody(rawBody: string): string {
    if (!rawBody) return '';

    try {
        const parsed = JSON.parse(rawBody) as {
            blocks?: { id: string; type: string; data?: { text?: string } }[];
        };

        if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
            // Not Editor.js format, just return original
            return rawBody;
        }

        // Join all paragraph-like blocks
        const html = parsed.blocks
            .map((block) => {
                if (block.type === 'paragraph' && block.data?.text) {
                    // data.text already contains HTML such as <b>, <span>, etc.
                    return block.data.text;
                }
                return '';
            })
            .filter(Boolean)
            .join('<br/><br/>');

        // Fallback if nothing was produced
        return html || rawBody;
    } catch {
        // Not JSON, just treat as plain text
        return rawBody;
    }
}

// --- BookSection ---

export async function createBookSection(formData: FormData) {
    try {
        const session = await requireAdmin();

        const title = (formData.get('title') as string) ?? '';
        const rawBody = (formData.get('body') as string) ?? '';
        const language = (formData.get('language') as string) ?? 'en';

        // Determine churchId
        let churchId = session.user.churchId;
        if (session.user.role === 'SUPERADMIN') {
            const formChurchId = formData.get('churchId') as string;
            if (formChurchId) {
                churchId = formChurchId;
            } else {
                return { success: false, error: 'Please select a church' };
            }
        }

        if (!churchId) {
            return { success: false, error: 'No church context found' };
        }

        const body = normalizeBody(rawBody);

        // Auto-assign order based on existing sections count for this language AND church
        const existingCount = await prisma.bookSection.count({
            where: {
                language,
                churchId
            },
        });
        const order = existingCount;

        await prisma.bookSection.create({
            data: { title, body, language, order, churchId },
        });

        revalidatePath('/reader');
        revalidatePath('/admin/content');

        return { success: true };
    } catch (error: any) {
        console.error('Failed to create book section:', error);

        // Check for unique constraint violation on title
        if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
            const titleValue = formData.get('title') as string;
            return { success: false, error: `A section with the title "${titleValue}" already exists for this language. Please use a different title.` };
        }

        return { success: false, error: 'Failed to create content' };
    }
}

export async function deleteBookSection(id: string) {
    const session = await requireAdmin();

    // Verify ownership
    const section = await prisma.bookSection.findUnique({ where: { id } });
    if (!section) return;

    if (session.user.role !== 'SUPERADMIN' && section.churchId !== session.user.churchId) {
        throw new Error('Unauthorized');
    }

    await prisma.bookSection.delete({ where: { id } });
    revalidatePath('/reader');
    revalidatePath('/admin/content');
}

export async function updateBookSection(id: string, formData: FormData) {
    try {
        const session = await requireAdmin();

        // Verify ownership
        const section = await prisma.bookSection.findUnique({ where: { id } });
        if (!section) return { success: false, error: 'Section not found' };

        if (session.user.role !== 'SUPERADMIN' && section.churchId !== session.user.churchId) {
            return { success: false, error: 'Unauthorized' };
        }

        const title = (formData.get('title') as string) ?? '';
        const rawBody = (formData.get('body') as string) ?? '';
        // Don't allow language changes during update to maintain order integrity

        const body = normalizeBody(rawBody);

        await prisma.bookSection.update({
            where: { id },
            data: { title, body },
        });

        revalidatePath('/reader');
        revalidatePath('/admin/content');

        return { success: true };
    } catch (error: any) {
        console.error('Failed to update book section:', error);

        // Check for unique constraint violation on title
        if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
            const titleValue = formData.get('title') as string;
            return { success: false, error: `A section with the title "${titleValue}" already exists for this language. Please use a different title.` };
        }

        return { success: false, error: 'Failed to update content' };
    }
}

// --- Notification ---

export async function createNotification(formData: FormData) {
    try {
        const session = await requireAdmin();

        let churchId = session.user.churchId;
        if (session.user.role === 'SUPERADMIN') {
            const formChurchId = formData.get('churchId') as string;
            if (formChurchId) {
                churchId = formChurchId;
            } else {
                return { success: false, error: 'Please select a church' };
            }
        }

        if (!churchId) {
            return { success: false, error: 'No church context found' };
        }

        const title = (formData.get('title') as string) ?? '';
        const message = (formData.get('message') as string) ?? '';
        const type = (formData.get('type') as string) ?? '';

        await prisma.notification.create({
            data: { title, message, type, churchId },
        });

        revalidatePath('/notifications');
        revalidatePath('/admin/notifications');

        return { success: true };
    } catch (error) {
        console.error('Failed to create notification:', error);
        return { success: false, error: 'Failed to create notification' };
    }
}

export async function deleteNotification(id: string) {
    const session = await requireAdmin();

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return;

    if (session.user.role !== 'SUPERADMIN' && notification.churchId !== session.user.churchId) {
        throw new Error('Unauthorized');
    }

    await prisma.notification.delete({ where: { id } });
    revalidatePath('/notifications');
    revalidatePath('/admin/notifications');
}

export async function updateNotification(id: string, formData: FormData) {
    try {
        const session = await requireAdmin();

        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification) return { success: false, error: 'Notification not found' };

        if (session.user.role !== 'SUPERADMIN' && notification.churchId !== session.user.churchId) {
            return { success: false, error: 'Unauthorized' };
        }

        const title = (formData.get('title') as string) ?? '';
        const message = (formData.get('message') as string) ?? '';
        const type = (formData.get('type') as string) ?? '';

        await prisma.notification.update({
            where: { id },
            data: { title, message, type },
        });

        revalidatePath('/notifications');
        revalidatePath('/admin/notifications');

        return { success: true };
    } catch (error) {
        console.error('Failed to update notification:', error);
        return { success: false, error: 'Failed to update notification' };
    }
}

// --- Live Stream ---

export async function updateLiveStreamConfig(formData: FormData) {
    try {
        const session = await requireAdmin();

        let churchId = session.user.churchId;
        if (session.user.role === 'SUPERADMIN') {
            const formChurchId = formData.get('churchId') as string;
            if (formChurchId) {
                churchId = formChurchId;
            } else {
                return { success: false, error: 'Please select a church' };
            }
        }

        if (!churchId) {
            return { success: false, error: 'No church context found' };
        }

        const youtubeVideoId = (formData.get('youtubeVideoId') as string) ?? '';
        const isLive = formData.get('isLive') === 'on';
        const title = (formData.get('title') as string) ?? '';

        // Find config for THIS church
        const existing = await prisma.liveStreamConfig.findFirst({
            where: { churchId }
        });

        if (existing) {
            await prisma.liveStreamConfig.update({
                where: { id: existing.id },
                data: { youtubeVideoId, isLive, title },
            });
        } else {
            await prisma.liveStreamConfig.create({
                data: { youtubeVideoId, isLive, title, churchId },
            });
        }

        // Create history record
        await prisma.liveStreamHistory.create({
            data: { youtubeVideoId, isLive, title, churchId },
        });

        revalidatePath('/');
        revalidatePath('/admin/live');

        return { success: true };
    } catch (error) {
        console.error('Failed to update live stream config:', error);
        return { success: false, error: 'Failed to save configuration' };
    }
}

// --- Church Settings ---

export async function updateChurch(formData: FormData) {
    try {
        const session = await requireAdmin();
        const churchId = session.user.churchId;

        if (!churchId) {
            return { success: false, error: 'No church context found' };
        }

        const name = formData.get('name') as string;
        const address = formData.get('address') as string;

        if (!name) {
            return { success: false, error: 'Church name is required' };
        }

        await prisma.church.update({
            where: { id: churchId },
            data: { name, address },
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Failed to update church settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
