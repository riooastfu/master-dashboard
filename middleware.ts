import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route permissions as a constant
const ROUTE_PERMISSIONS = {
    "/admin": ["admin"],
    "/gis": ["admin", "user", "viewer"],
    "/pastiplant": ["admin", "user"]
} as const;

export async function middleware(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        const pathname = req.nextUrl.pathname;

        // Check if route starts with admin
        const isAdminRoute = pathname.startsWith('/admin');
        const isPublicRoute = pathname === "/";
        const isProtectedRoute = ["/gis", "/pastiplant"].includes(pathname);

        // Authenticated users shouldn't access login page
        if (token && isPublicRoute) {
            return NextResponse.redirect(new URL("/gis", req.url));
        }

        // Redirect unauthenticated users to login
        if (!token && (isProtectedRoute || isAdminRoute)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Check admin access
        if (token && isAdminRoute && token.user?.role !== 'admin') {
            return NextResponse.redirect(new URL("/gis", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|auth|_next/static|_next/image|favicon.ico).*)',
    ],
};