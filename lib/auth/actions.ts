import { createClient } from "@/lib/supabase/client";

export interface AuthResult {
  ok: boolean;
  error?: string;
  username?: string;
}

/** Strips an optional leading "@" and surrounding whitespace for validation/requests. */
export function normalizeUsernameInput(raw: string): string {
  return raw.trim().replace(/^@/, "");
}

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/i;

export function usernameFormatError(raw: string): string | null {
  const clean = normalizeUsernameInput(raw);
  if (!clean) return "Choose a username.";
  if (!USERNAME_PATTERN.test(clean)) {
    return "3-20 characters: letters, numbers, and underscores only.";
  }
  return null;
}

export async function checkUsernameAvailable(raw: string): Promise<boolean | null> {
  const clean = normalizeUsernameInput(raw);
  if (!USERNAME_PATTERN.test(clean)) return null;
  const supabase = createClient();
  const { data, error } = await supabase.rpc("flowstate_username_available", {
    check_username: `@${clean}`,
  });
  if (error) return null;
  return data as boolean;
}

export async function signUp(rawUsername: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("flowstate-signup", {
    body: { username: normalizeUsernameInput(rawUsername), password },
  });

  if (error || !data?.session) {
    return { ok: false, error: await extractError(error, data) };
  }

  const { error: sessionErr } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionErr) return { ok: false, error: "Account created, but sign-in failed. Try logging in." };

  return { ok: true, username: data.username };
}

export async function logIn(rawUsername: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("flowstate-login", {
    body: { username: normalizeUsernameInput(rawUsername), password },
  });

  if (error || !data?.session) {
    return { ok: false, error: await extractError(error, data) };
  }

  const { error: sessionErr } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionErr) return { ok: false, error: "Sign-in failed. Try again." };

  return { ok: true };
}

export async function logOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function changeUsername(rawUsername: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("flowstate-change-username", {
    body: { username: normalizeUsernameInput(rawUsername) },
  });

  if (error || !data?.username) {
    return { ok: false, error: await extractError(error, data) };
  }

  return { ok: true, username: data.username };
}

export async function getCurrentUsername(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("flowstate_profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  return data?.username ?? null;
}

/** supabase-js surfaces edge function 4xx/5xx bodies via the FunctionsHttpError context, not `data`. */
async function extractError(error: unknown, data: unknown): Promise<string> {
  if (data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string") {
    return (data as { error: string }).error;
  }
  const context = (error as { context?: Response })?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body?.error) return body.error as string;
    } catch {
      // fall through to generic message
    }
  }
  return "Something went wrong. Try again.";
}
