import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('access_token');

    // Protect all dashboard routes
    if (request.nextUrl.pathname.startsWith('/invoices') ||
        request.nextUrl.pathname.startsWith('/services') ||
        request.nextUrl.pathname.startsWith('/portfolio') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname === '/dashboard') {

        // Redirect to login if no token wrapper
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
