import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, DUMMY_URL, DUMMY_KEY } from "./client";

const PUBLIC_PATHS = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : DUMMY_URL;
  const key = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : DUMMY_KEY;

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let hasUser = false;

  if (isSupabaseConfigured()) {
    // Required: this actually validates the session and refreshes it if
    // needed, refreshing the token cookies via setAll above.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasUser = !!user;
  } else {
    // If Supabase is not configured, we look at our local authentication cookie.
    const localSession = request.cookies.get("flowstate-local-session");
    hasUser = !!localSession;
  }

  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || PUBLIC_PATHS.some((p) => path.startsWith(p));

  if (!hasUser && !isPublicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (hasUser && isPublicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
