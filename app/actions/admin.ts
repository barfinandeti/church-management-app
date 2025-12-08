'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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
    const session = await requireAdmin();

    // Verify ownership
    const section = await prisma.bookSection.findUnique({ where: { id } });
    if (!section) return { success: false, error: 'Section not found' };

    if (session.user.role !== 'SUPERADMIN' && section.churchId !== session.user.churchId) {
        return { success: false, error: 'Unauthorized' };
    }

    const title = (formData.get('title') as string) ?? '';
    const rawBody = (formData.get('body') as string) ?? '';
    const language = (formData.get('language') as string) ?? section.language;

    // Allow superadmin to change churchId
    let churchId = section.churchId;
    if (session.user.role === 'SUPERADMIN') {
        const formChurchId = formData.get('churchId') as string;
        if (formChurchId) {
            churchId = formChurchId;
        }
    }

    const body = normalizeBody(rawBody);

    try {
        await prisma.bookSection.update({
            where: { id },
            data: { title, body, language, churchId },
        });
    } catch (error: any) {
        console.error('Failed to update book section:', error);

        // Check for unique constraint violation on title
        if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
            const titleValue = formData.get('title') as string;
            return { success: false, error: `A section with the title "${titleValue}" already exists for this language. Please use a different title.` };
        }

        return { success: false, error: 'Failed to update content' };
    }

    revalidatePath('/reader');
    revalidatePath('/admin/content');

    redirect('/admin/content?success=true');
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
        const scheduledFor = formData.get('scheduledFor') as string | null;

        await prisma.notification.create({
            data: {
                title,
                message,
                type,
                churchId,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                isPublished: !scheduledFor,  // Publish immediately if not scheduled
                publishedAt: !scheduledFor ? new Date() : null
            },
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
    const session = await requireAdmin();

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return { success: false, error: 'Notification not found' };

    if (session.user.role !== 'SUPERADMIN' && notification.churchId !== session.user.churchId) {
        return { success: false, error: 'Unauthorized' };
    }

    const title = (formData.get('title') as string) ?? '';
    const message = (formData.get('message') as string) ?? '';
    const type = (formData.get('type') as string) ?? '';

    try {
        await prisma.notification.update({
            where: { id },
            data: { title, message, type },
        });
    } catch (error) {
        console.error('Failed to update notification:', error);
        return { success: false, error: 'Failed to update notification' };
    }

    revalidatePath('/notifications');
    revalidatePath('/admin/notifications');

    redirect('/admin/notifications?success=true');
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
        const scheduledForStr = formData.get('scheduledFor') as string | null;
        const scheduledFor = scheduledForStr ? new Date(scheduledForStr) : null;

        if (!youtubeVideoId) {
            return { success: false, error: 'YouTube Video ID is required' };
        }

        // Find config for THIS church
        const existingConfig = await prisma.liveStreamConfig.findFirst({
            where: { churchId }
        });

        // Check if this Video ID is already in history
        const existingHistory = await prisma.liveStreamHistory.findFirst({
            where: {
                churchId,
                youtubeVideoId
            }
        });

        // LOGIC:
        // 1. If we are updating the CURRENT stream (same ID as config), update history instead of creating new.
        // 2. If we are setting a NEW stream (different ID), check if it exists in history. If so, BLOCK.

        const isUpdatingCurrent = existingConfig && existingConfig.youtubeVideoId === youtubeVideoId;

        if (!isUpdatingCurrent && existingHistory) {
            return { success: false, error: 'A stream with this Video ID already exists in history.' };
        }

        // Update or Create Config
        if (existingConfig) {
            await prisma.liveStreamConfig.update({
                where: { id: existingConfig.id },
                data: { youtubeVideoId, isLive, title, scheduledFor },
            });
        } else {
            await prisma.liveStreamConfig.create({
                data: { youtubeVideoId, isLive, title, churchId, scheduledFor },
            });
        }

        // Handle History
        if (isUpdatingCurrent && existingHistory) {
            // Update existing history record
            await prisma.liveStreamHistory.update({
                where: { id: existingHistory.id },
                data: { isLive, title, scheduledFor }
            });
        } else {
            // Create new history record (only if it didn't exist, which is enforced by the check above)
            await prisma.liveStreamHistory.create({
                data: { youtubeVideoId, isLive, title, churchId, scheduledFor },
            });
        }

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

export async function deleteLiveStreamAndHistory(id: string) {
    try {
        const session = await requireAdmin();
        const churchId = session.user.churchId;

        // Find the history record
        const history = await prisma.liveStreamHistory.findUnique({
            where: { id }
        });

        if (!history) return { success: false, error: 'History record not found' };

        // Verify ownership
        if (session.user.role !== 'SUPERADMIN' && history.churchId !== churchId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete history
        await prisma.liveStreamHistory.delete({ where: { id } });

        // If the current config matches this history item (same video ID) and is currently live, turn it off
        const config = await prisma.liveStreamConfig.findFirst({
            where: { churchId: history.churchId }
        });

        if (config && config.isLive && config.youtubeVideoId === history.youtubeVideoId) {
            await prisma.liveStreamConfig.update({
                where: { id: config.id },
                data: { isLive: false }
            });
        }

        revalidatePath('/admin/live');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete live stream history:', error);
        return { success: false, error: 'Failed to delete history' };
    }
}
