
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define protected and public routes
    const isSuperAdminRoute = pathname.startsWith('/superadmin');
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isLoginRoute = pathname === '/login' || pathname === '/admin/login';
    const isHomeRoute = pathname === '/';

    // 2. Get session token
    const token = request.cookies.get('ch_app_session')?.value;
    let payload = null;

    if (token) {
        payload = await verifyToken(token);
    }

    // 3. Handle Login Routes (Redirect if already logged in)
    if (isLoginRoute && payload) {
        if (payload.role === 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/superadmin', request.url));
        } else if (payload.role === 'CHURCH_ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url));
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // 4. Handle Protected Routes (Redirect to login if not logged in)
    if ((isSuperAdminRoute || isAdminRoute || isDashboardRoute) && !payload) {
        if (isSuperAdminRoute || isAdminRoute) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 5. Role-based Access Control
    if (payload) {
        // Super Admin only
        if (isSuperAdminRoute && payload.role !== 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Admin only (Super Admin also allowed? Usually yes, or separate)
        // Let's restrict /admin to CHURCH_ADMIN and SUPERADMIN
        if (isAdminRoute && payload.role !== 'CHURCH_ADMIN' && payload.role !== 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Dashboard (User) - Admins can probably access too, or maybe not?
        // User asked for "dashboard to update user details".
        // Let's allow everyone to access /dashboard for now (profile etc), 
        // OR restrict to USER.
        // If an admin goes to /dashboard, they might see their user profile. That's fine.
    }

    // 6. Home Route Redirection (Optional: Redirect logged-in users to dashboard)
    // "if an user logins to the app then he should have his own dedicated home page"
    if (isHomeRoute && payload) {
        if (payload.role === 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/superadmin', request.url));
        } else if (payload.role === 'CHURCH_ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url));
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
