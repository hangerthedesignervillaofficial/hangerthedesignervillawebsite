import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This route is called by Supabase after Google OAuth completes
// Supabase redirects to: /auth/callback?code=<auth_code>
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to home or intended page after successful sign in
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If something went wrong, redirect to sign-in with error message
  return NextResponse.redirect(
    new URL("/signin?message=Could+not+authenticate+with+Google", request.url)
  );
}
