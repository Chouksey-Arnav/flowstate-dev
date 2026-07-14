import { createBrowserClient } from "@supabase/ssr";

export const DUMMY_URL = "https://dummy-flowstate.supabase.co";
export const DUMMY_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15IiwiYm9keSI6eyJhbm9uIjp0cnVlfSwiaWF0IjoxNjA3ODY1NjAwLCJleHAiOjI5OTkxMzkyMDB9.dummy_signature";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    url !== "..." &&
    key !== "..." &&
    !url.includes("placeholder")
  );
}

export function createClient() {
  const url = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : DUMMY_URL;
  const key = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : DUMMY_KEY;

  return createBrowserClient(url, key);
}
