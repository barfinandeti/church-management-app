import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// ============================================
// TYPES
// ============================================

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'SUPERADMIN' | 'CHURCH_ADMIN' | 'USER';
    churchId: string | null;
    [key: string]: any; // Allow other claims
}

export interface Session {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: 'SUPERADMIN' | 'CHURCH_ADMIN' | 'USER';
        churchId: string | null;
        church?: {
            id: string;
            name: string;
            slug: string;
        } | null;
    };
}

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const COOKIE_NAME = 'ch_app_session';
const TOKEN_EXPIRY = '7d';

// ============================================
// PASSWORD UTILITIES
// ============================================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============================================
// JWT UTILITIES
// ============================================

export async function createToken(payload: TokenPayload): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as TokenPayload;
    } catch {
        return null;
    }
}

// ============================================
// COOKIE UTILITIES
// ============================================

export async function createSessionCookie(user: {
    id: string;
    email: string;
    role: 'SUPERADMIN' | 'CHURCH_ADMIN' | 'USER';
    churchId: string | null;
}): Promise<string> {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        churchId: user.churchId,
    };

    return createToken(payload);
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

// ============================================
// SESSION RETRIEVAL
// ============================================

export async function getSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return null;
        }

        // Fetch full user data from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
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
            return null;
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                churchId: user.churchId,
                church: user.church,
            },
        };
    } catch (error) {
        console.error('Session retrieval error:', error);
        return null;
    }
}

export async function requireSession(): Promise<Session> {
    const session = await getSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return session;
}

export async function requireAdmin(): Promise<Session> {
    const session = await requireSession();
    if (session.user.role !== 'SUPERADMIN' && session.user.role !== 'CHURCH_ADMIN') {
        throw new Error('Admin access required');
    }
    return session;
}

export async function requireSuperAdmin(): Promise<Session> {
    const session = await requireSession();
    if (session.user.role !== 'SUPERADMIN') {
        throw new Error('Superadmin access required');
    }
    return session;
}

// ============================================
// TENANT FILTERING HELPER
// ============================================

export function getChurchFilter(session: Session): { churchId: string } | {} {
    // SUPERADMIN can access all churches
    if (session.user.role === 'SUPERADMIN') {
        return {};
    }

    // Others are filtered to their church
    if (!session.user.churchId) {
        throw new Error('User has no church assignment');
    }

    return { churchId: session.user.churchId };
}
