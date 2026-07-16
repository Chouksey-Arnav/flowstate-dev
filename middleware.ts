import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|8bc2e64af52e4ad88b9ef591a6a83731.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
