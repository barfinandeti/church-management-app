'use server';

import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createChurch(formData: FormData) {
    try {
        await requireSuperAdmin();

        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const address = formData.get('address') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;

        const adminName = formData.get('adminName') as string;
        const adminEmail = formData.get('adminEmail') as string;
        const adminPassword = formData.get('adminPassword') as string;

        if (!name || !slug || !adminEmail || !adminPassword) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if slug exists
        const existingChurch = await prisma.church.findUnique({
            where: { slug },
        });

        if (existingChurch) {
            return { success: false, error: 'Church slug already exists' };
        }

        // Check if admin email exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existingUser) {
            return { success: false, error: 'Admin email already exists' };
        }

        const hashedPassword = await hashPassword(adminPassword);

        // Transaction to create church and admin user
        await prisma.$transaction(async (tx) => {
            const church = await tx.church.create({
                data: {
                    name,
                    slug,
                    address,
                    email,
                    phoneNumber,
                },
            });

            await tx.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    passwordHash: hashedPassword,
                    role: 'CHURCH_ADMIN',
                    churchId: church.id,
                    isVerified: true, // Auto-verify admin created by Super Admin
                },
            });
        });

        revalidatePath('/superadmin');
        return { success: true };
    } catch (error) {
        console.error('Failed to create church:', error);
        return { success: false, error: 'Failed to create church' };
    }
}

export async function updateChurchDetails(id: string, formData: FormData) {
    try {
        await requireSuperAdmin();

        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const address = formData.get('address') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;

        if (!name || !slug) {
            return { success: false, error: 'Name and Slug are required' };
        }

        // Check if slug exists (excluding current church)
        const existingChurch = await prisma.church.findUnique({
            where: { slug },
        });

        if (existingChurch && existingChurch.id !== id) {
            return { success: false, error: 'Church slug already exists' };
        }

        await prisma.church.update({
            where: { id },
            data: {
                name,
                slug,
                address,
                email,
                phoneNumber,
            },
        });

        revalidatePath('/superadmin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update church:', error);
        return { success: false, error: 'Failed to update church' };
    }
}

export async function getUsers() {
    await requireSuperAdmin();
    return await prisma.user.findMany({
        include: {
            church: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getChurches() {
    await requireSuperAdmin();
    return await prisma.church.findMany({
        include: {
            _count: {
                select: { users: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateUserRole(userId: string, role: string, churchId?: string) {
    try {
        await requireSuperAdmin();

        if (role === 'CHURCH_ADMIN' && !churchId) {
            return { success: false, error: 'Church selection is required for Church Admin role' };
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                role: role as any,
                churchId: churchId || null,
            },
        });

        revalidatePath('/superadmin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to update user role:', error);
        return { success: false, error: 'Failed to update user role' };
    }
}
