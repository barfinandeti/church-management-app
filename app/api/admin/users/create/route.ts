import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verify admin session
        const session = await requireAdmin();

        const body = await request.json();
        const { email, password, name, role, churchId } = body;

        // Validate required fields
        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, error: 'Email, password, and role are required' },
                { status: 400 }
            );
        }

        // Validate role
        if (!['SUPERADMIN', 'CHURCH_ADMIN', 'USER'].includes(role)) {
            return NextResponse.json(
                { success: false, error: 'Invalid role' },
                { status: 400 }
            );
        }

        // Permission checks
        if (session.user.role === 'CHURCH_ADMIN') {
            // Church admins can only create users for their church
            if (!session.user.churchId) {
                return NextResponse.json(
                    { success: false, error: 'Church admin has no church assignment' },
                    { status: 403 }
                );
            }

            // Must use their own churchId
            if (churchId && churchId !== session.user.churchId) {
                return NextResponse.json(
                    { success: false, error: 'Cannot create users for other churches' },
                    { status: 403 }
                );
            }

            // Cannot create superadmins
            if (role === 'SUPERADMIN') {
                return NextResponse.json(
                    { success: false, error: 'Cannot create superadmin users' },
                    { status: 403 }
                );
            }
        }

        // Determine final churchId
        let finalChurchId: string | null = null;

        if (role === 'SUPERADMIN') {
            // Superadmins have no church
            finalChurchId = null;
        } else if (session.user.role === 'CHURCH_ADMIN') {
            // Church admins assign their own church
            finalChurchId = session.user.churchId!;
        } else {
            // Superadmins must specify a church for non-superadmin users
            if (!churchId) {
                return NextResponse.json(
                    { success: false, error: 'Church ID is required for this role' },
                    { status: 400 }
                );
            }
            finalChurchId = churchId;
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role,
                churchId: finalChurchId,
            },
            include: {
                church: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                churchId: user.churchId,
                church: user.church,
            },
        });
    } catch (error: any) {
        console.error('Create user error:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, error: 'A user with this email already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
