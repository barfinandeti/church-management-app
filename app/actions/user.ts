'use server';

import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        const name = formData.get('name') as string;
        // Email update might require verification, skipping for now or just allow if simple
        // Let's just update name for now to be safe and simple

        if (!name) {
            return { success: false, error: 'Name is required' };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { name },
        });

        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
