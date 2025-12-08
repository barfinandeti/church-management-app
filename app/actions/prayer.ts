'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createPrayerRequest(formData: FormData) {
    try {
        const session = await require('@/lib/auth').getSession();

        if (!session || !session.user.churchId) {
            return { success: false, error: 'Please log in to submit a prayer request' };
        }

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const request = formData.get('request') as string;
        const isUrgent = formData.get('isUrgent') === 'true';

        await prisma.prayerRequest.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                request,
                isUrgent,
                userId: session.user.id,
                churchId: session.user.churchId,
            },
        });

        revalidatePath('/prayer-request');
        revalidatePath('/admin/prayer-requests');

        return { success: true };
    } catch (error) {
        console.error('Failed to create prayer request:', error);
        return { success: false, error: 'Failed to submit prayer request' };
    }
}

export async function updatePrayerRequestStatus(id: string, status: string) {
    try {
        const session = await requireAdmin();

        const request = await prisma.prayerRequest.findUnique({ where: { id } });
        if (!request) return { success: false, error: 'Prayer request not found' };

        if (session.user.role !== 'SUPERADMIN' && request.churchId !== session.user.churchId) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.prayerRequest.update({
            where: { id },
            data: { status },
        });

        revalidatePath('/admin/prayer-requests');
        return { success: true };
    } catch (error) {
        console.error('Failed to update prayer request:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function deletePrayerRequest(id: string) {
    const session = await require('@/lib/auth').getSession();

    if (!session) {
        throw new Error('Authentication required');
    }

    const request = await prisma.prayerRequest.findUnique({ where: { id } });
    if (!request) return;

    // Allow users to delete their own requests, or admins to delete any request
    const isAdmin = session.user.role === 'SUPERADMIN' || session.user.role === 'CHURCH_ADMIN';
    const isOwner = request.userId === session.user.id;

    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized');
    }

    // Additional check for church admins - they can only delete requests from their church
    if (session.user.role === 'CHURCH_ADMIN' && request.churchId !== session.user.churchId) {
        throw new Error('Unauthorized');
    }

    await prisma.prayerRequest.delete({ where: { id } });
    revalidatePath('/prayer-request');
    revalidatePath('/admin/prayer-requests');
}
