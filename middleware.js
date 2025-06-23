// import { updateSession } from '@/app/_lib/auth-middleware'

import { updateSession } from "./app/_utils/supabase/auth-middleware"

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/account/:path*',
    '/dashboard/:path*',
    // '/admin/:path*',     // Optional: add more secure routes
    //  '/((?!_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
