'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: string) {
    try {
        const session = await requireAdmin();

        // Get the user to be deleted
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!targetUser) {
            throw new Error('User not found');
        }

        // Permission checks
        if (session.user.role === 'CHURCH_ADMIN') {
            // Can only delete users from own church
            if (targetUser.churchId !== session.user.churchId) {
                throw new Error('Unauthorized');
            }
            // Cannot delete superadmins (though they shouldn't be in this church anyway)
            if (targetUser.role === 'SUPERADMIN') {
                throw new Error('Unauthorized');
            }
        }

        // Cannot delete yourself
        if (targetUser.id === session.user.id) {
            throw new Error('Cannot delete your own account');
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const session = await requireAdmin();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as string;
        const churchId = formData.get('churchId') as string;
        const password = formData.get('password') as string;

        // Validation
        if (!name || !email || !role) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if email exists (excluding current user)
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== id) {
            return { success: false, error: 'Email already exists' };
        }

        // Permission checks
        if (session.user.role !== 'SUPERADMIN') {
            // Church Admins can only update users in their church
            // And cannot change role to SUPERADMIN or change churchId
            const targetUser = await prisma.user.findUnique({ where: { id } });
            if (!targetUser || targetUser.churchId !== session.user.churchId) {
                return { success: false, error: 'Unauthorized' };
            }
            if (role === 'SUPERADMIN') {
                return { success: false, error: 'Cannot promote to Super Admin' };
            }
            if (churchId && churchId !== session.user.churchId) {
                return { success: false, error: 'Cannot change church' };
            }
            // Church admins cannot change passwords
            if (password) {
                return { success: false, error: 'Unauthorized to change passwords' };
            }
        }

        // Prepare update data
        const updateData: any = {
            name,
            email,
            role: role as any,
            churchId: churchId || null,
        };

        // Only superadmin can update password, and only if provided
        if (session.user.role === 'SUPERADMIN' && password && password.trim() !== '') {
            const { hashPassword } = await import('@/lib/auth');
            updateData.password = await hashPassword(password);
        }

        await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Update user error:', error);
        return { success: false, error: 'Failed to update user' };
    }
}
