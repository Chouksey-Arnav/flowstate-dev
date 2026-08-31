import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Paths logged-in users get bounced away from (back to /dashboard) — the marketing/auth entry points. */
const AUTH_ENTRY_PATHS = ["/login", "/signup"];
/** Paths anyone can view regardless of auth state, with no redirect either way. */
const ALWAYS_PUBLIC_PREFIXES = ["/docs"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const isAuthEntryPath = path === "/" || AUTH_ENTRY_PATHS.some((p) => path.startsWith(p));
  const isAlwaysPublic = ALWAYS_PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (!isSupabaseConfigured) {
    // If Supabase is not configured, fall back to cookie-based mock session
    const mockUserCookie = request.cookies.get("flowstate_mock_user")?.value;
    const user = mockUserCookie ? { id: mockUserCookie, user_metadata: { username: mockUserCookie } } : null;

    if (!user && !isAuthEntryPath && !isAlwaysPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user && isAuthEntryPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Required: this actually validates the session and refreshes it if
  // needed, refreshing the token cookies via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isAuthEntryPath && !isAlwaysPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthEntryPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
