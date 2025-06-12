import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is logged in and they try to access login or register pages, redirect them to the dashboard
    if (req.nextauth.token && (
      req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/register')
    )) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If accessing protected routes, require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/accounts') ||
            req.nextUrl.pathname.startsWith('/transactions') ||
            req.nextUrl.pathname.startsWith('/categories')) {
          return !!token
        }
        // Public routes (login, register, home) are always accessible
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|verify-request).*)',
  ],
}
