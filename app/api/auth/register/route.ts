import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, churchId } = body;

        if (!name || !email || !password || !churchId) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 400 }
            );
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                churchId,
                role: 'USER',
                verificationToken,
                isVerified: false,
            },
        });

        // In a real app, send email here
        // For dev, we'll log the verification link
        const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`;
        console.log('================================================');
        console.log('📧 EMAIL VERIFICATION (DEV MODE)');
        console.log(`To: ${email}`);
        console.log(`Link: ${verificationLink}`);
        console.log('================================================');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
