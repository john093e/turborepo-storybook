import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. /static (inside /public)
     * 6. /favicon (inside /public)
     * 7. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|examples|static|favicon|[\\w-]+\\.\\w+).*)',
  ],
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get('host') || 't-wol.com'

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.t-wol.com`, '').replace(`.t-wol.vercel.app`, '')
      : hostname.replace(`.localhost:3000`, '')
  // Rewrites for app pages
  // Site Administration
  if (currentHost == 'app') {
    if (
      url.pathname === '/auth/login' &&
      (req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token'))
    ) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    // run Docs mono repo if in /docs/:path
    if (url.pathname.startsWith('/docs')) {
      return NextResponse.rewrite(url)
    } else {
      url.pathname = `/app${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Rewrite root application to `/home` folder
  // Site Vitrine
  if (
    hostname === 'localhost:3000' ||
    hostname === 't-wol.com' ||
    hostname === 't-wol.vercel.app'
  ) {
    url.pathname = `/home${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Site des organismes caritatif
  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/_sites/${currentHost}${url.pathname}`
  return NextResponse.rewrite(url)
}
