// 'use server';

// import { prisma } from '@/lib/prisma';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';


// // --- BookSection ---

// export async function createBookSection(formData: FormData) {
//     const title = formData.get('title') as string;
//     const body = formData.get('body') as string;
//     const language = formData.get('language') as string;
//     const order = parseInt(formData.get('order') as string || '0');

//     await prisma.bookSection.create({
//         data: { title, body, language, order },
//     });

//     revalidatePath('/reader');
//     revalidatePath('/admin/content');
// }

// export async function deleteBookSection(id: string) {
//     await prisma.bookSection.delete({ where: { id } });
//     revalidatePath('/reader');
//     revalidatePath('/admin/content');
// }

// // --- Notification ---

// export async function createNotification(formData: FormData) {
//     const title = formData.get('title') as string;
//     const message = formData.get('message') as string;
//     const type = formData.get('type') as string;

//     await prisma.notification.create({
//         data: { title, message, type },
//     });

//     revalidatePath('/notifications');
//     revalidatePath('/admin/notifications');
// }

// export async function deleteNotification(id: string) {
//     await prisma.notification.delete({ where: { id } });
//     revalidatePath('/notifications');
//     revalidatePath('/admin/notifications');
// }

// // --- Live Stream ---

// export async function updateLiveStreamConfig(formData: FormData) {
//     const youtubeVideoId = formData.get('youtubeVideoId') as string;
//     const isLive = formData.get('isLive') === 'on';
//     const title = formData.get('title') as string;

//     // Upsert (create if not exists, update if exists)
//     // Since we don't have a unique constraint other than ID, we'll findFirst or create.
//     const existing = await prisma.liveStreamConfig.findFirst();

//     if (existing) {
//         await prisma.liveStreamConfig.update({
//             where: { id: existing.id },
//             data: { youtubeVideoId, isLive, title },
//         });
//     } else {
//         await prisma.liveStreamConfig.create({
//             data: { youtubeVideoId, isLive, title },
//         });
//     }

//     revalidatePath('/');
//     revalidatePath('/admin/live');
// }


'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
    const title = (formData.get('title') as string) ?? '';
    const rawBody = (formData.get('body') as string) ?? '';
    const language = (formData.get('language') as string) ?? 'en';
    const order = parseInt((formData.get('order') as string) || '0', 10);

    const body = normalizeBody(rawBody);

    await prisma.bookSection.create({
        data: { title, body, language, order },
    });

    revalidatePath('/reader');
    revalidatePath('/admin/content');
}

export async function deleteBookSection(id: string) {
    await prisma.bookSection.delete({ where: { id } });
    revalidatePath('/reader');
    revalidatePath('/admin/content');
}

export async function updateBookSection(id: string, formData: FormData) {
    const title = (formData.get('title') as string) ?? '';
    const rawBody = (formData.get('body') as string) ?? '';
    const language = (formData.get('language') as string) ?? 'en';
    const order = parseInt((formData.get('order') as string) || '0', 10);

    const body = normalizeBody(rawBody);

    await prisma.bookSection.update({
        where: { id },
        data: { title, body, language, order },
    });

    revalidatePath('/reader');
    revalidatePath('/admin/content');
    // redirect('/admin/content'); // We will handle redirect in the client component or let the user navigate back
}

// --- Notification ---

export async function createNotification(formData: FormData) {
    const title = (formData.get('title') as string) ?? '';
    const message = (formData.get('message') as string) ?? '';
    const type = (formData.get('type') as string) ?? '';

    await prisma.notification.create({
        data: { title, message, type },
    });

    revalidatePath('/notifications');
    revalidatePath('/admin/notifications');
}

export async function deleteNotification(id: string) {
    await prisma.notification.delete({ where: { id } });
    revalidatePath('/notifications');
    revalidatePath('/admin/notifications');
}

export async function updateNotification(id: string, formData: FormData) {
    const title = (formData.get('title') as string) ?? '';
    const message = (formData.get('message') as string) ?? '';
    const type = (formData.get('type') as string) ?? '';

    await prisma.notification.update({
        where: { id },
        data: { title, message, type },
    });

    revalidatePath('/notifications');
    revalidatePath('/admin/notifications');
}

// --- Live Stream ---

export async function updateLiveStreamConfig(formData: FormData) {
    const youtubeVideoId = (formData.get('youtubeVideoId') as string) ?? '';
    const isLive = formData.get('isLive') === 'on';
    const title = (formData.get('title') as string) ?? '';

    const existing = await prisma.liveStreamConfig.findFirst();

    if (existing) {
        await prisma.liveStreamConfig.update({
            where: { id: existing.id },
            data: { youtubeVideoId, isLive, title },
        });
    } else {
        await prisma.liveStreamConfig.create({
            data: { youtubeVideoId, isLive, title },
        });
    }

    revalidatePath('/');
    revalidatePath('/admin/live');
}
