import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const PATH_ACCESSIBLE = ["/sign"]

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    if (token && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url))
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: async ({ req, token }) => {
        if (PATH_ACCESSIBLE.includes(req.nextUrl.pathname)) return true
        if (!token) return false
        if (Date.now() > token.expiresAt * 1000) return false

        return true
      }
    },
    pages: {
      signIn: "/sign"
    }
  }
)

// Configure middleware matching paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, sitemap.xml (static files)
     * 6. /login (login page)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|login).*)"
  ]
}
