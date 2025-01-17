import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const pathname = req.nextUrl.pathname;

    const publicPaths = ["/"];
    const protectedPaths = ["/gis", "/pastiplant"];

    const isAdminRoute = pathname.startsWith('/admin');
    const isPublicRoute = publicPaths.includes(pathname);
    const isProtectedRoute = protectedPaths.includes(pathname);

    // 1. If the user is authenticated and tries to access the login page, redirect them to the dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/gis", req.url));
    }

    // 2. If the user is NOT authenticated and tries to access a protected route, redirect them to the login page
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. If the user is authenticated but not an admin and tries to access admin routes
    if (token && isAdminRoute && token.user.role !== 'admin') {
        // Redirect to a default protected route or show an error page
        return NextResponse.redirect(new URL("/gis", req.url));
        // Alternative: Return a 403 Forbidden response
        // return new NextResponse(null, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico).*)'],
};
