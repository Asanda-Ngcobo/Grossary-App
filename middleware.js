

import { NextResponse } from "next/server";
import { updateSession } from "./app/_utils/supabase/auth-middleware";

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const verified = request.cookies.get("verified")?.value || searchParams.get("verified");

  // 🧩 1. Protect /signup route with Turnstile check
  if (pathname.startsWith("/auth/signup") && !verified) {
    const verifyUrl = request.nextUrl.clone();
    verifyUrl.pathname = "/auth/verify";
    return NextResponse.redirect(verifyUrl);
  }

  // 🧩 2. Apply Supabase session logic for other protected routes
  const response = await updateSession(request);

  return response;
}

export const config = {
  matcher: [
    "/auth/signup",
    "/account/:path*",
    "/dashboard/:path*",
    // Add more protected routes here if needed
  ],
};
