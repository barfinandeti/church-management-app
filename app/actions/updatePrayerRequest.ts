'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePrayerRequest(id: string, formData: FormData) {
    try {
        const session = await require('@/lib/auth').getSession();

        if (!session) {
            return { success: false, error: 'Authentication required' };
        }

        const request = await prisma.prayerRequest.findUnique({ where: { id } });
        if (!request) {
            return { success: false, error: 'Prayer request not found' };
        }

        // Only allow users to edit their own requests
        if (request.userId !== session.user.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const requestText = formData.get('request') as string;
        const isUrgent = formData.get('isUrgent') === 'true';

        await prisma.prayerRequest.update({
            where: { id },
            data: {
                name,
                email: email || null,
                phone: phone || null,
                request: requestText,
                isUrgent,
            },
        });

        revalidatePath('/prayer-request');
        return { success: true };
    } catch (error) {
        console.error('Failed to update prayer request:', error);
        return { success: false, error: 'Failed to update prayer request' };
    }
}
