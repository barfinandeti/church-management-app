import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionCookie, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, churchId } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
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

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Validate church assignment
        if (user.role !== 'SUPERADMIN') {
            // Non-superadmins must have a church
            if (!user.churchId) {
                return NextResponse.json(
                    { success: false, error: 'User has no church assignment' },
                    { status: 403 }
                );
            }

            // If churchId provided, verify it matches
            if (churchId && user.churchId !== churchId) {
                return NextResponse.json(
                    { success: false, error: 'Invalid church selection' },
                    { status: 403 }
                );
            }
        }

        // Create and set session cookie
        const token = await createSessionCookie(user);
        await setSessionCookie(token);

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
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
