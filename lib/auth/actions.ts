import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { generateId } from "@/lib/id";

export interface AuthResult {
  ok: boolean;
  error?: string;
  username?: string;
}

/** Helper to set a cookie on the client side. */
function setLocalCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

/** Helper to get a cookie on the client side. */
function getLocalCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

/** Helper to delete a cookie on the client side. */
function deleteLocalCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
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

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("flowstate_username_available", {
      check_username: `@${clean}`,
    });
    if (error) return null;
    return data as boolean;
  } else {
    if (typeof window === "undefined") return true;
    const usersStr = localStorage.getItem("flowstate_local_users") || "{}";
    try {
      const users = JSON.parse(usersStr);
      return !users[clean.toLowerCase()];
    } catch {
      return true;
    }
  }
}

export async function signUp(rawUsername: string, password: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);
  if (!USERNAME_PATTERN.test(clean)) {
    return { ok: false, error: "Invalid username format." };
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("flowstate-signup", {
      body: { username: clean, password },
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
  } else {
    if (typeof window === "undefined") {
      return { ok: false, error: "Browser environment required for local fallback signup." };
    }

    const usersStr = localStorage.getItem("flowstate_local_users") || "{}";
    let users: Record<string, any> = {};
    try {
      users = JSON.parse(usersStr);
    } catch {
      users = {};
    }

    const key = clean.toLowerCase();
    if (users[key]) {
      return { ok: false, error: "That username is already taken." };
    }

    const id = generateId();
    const newUser = { username: clean, password, id };
    users[key] = newUser;
    localStorage.setItem("flowstate_local_users", JSON.stringify(users));

    // Save local session
    const session = { username: clean, id };
    setLocalCookie("flowstate-local-session", JSON.stringify(session));

    return { ok: true, username: `@${clean}` };
  }
}

export async function logIn(rawUsername: string, password: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("flowstate-login", {
      body: { username: clean, password },
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
  } else {
    if (typeof window === "undefined") {
      return { ok: false, error: "Browser environment required for local fallback login." };
    }

    const usersStr = localStorage.getItem("flowstate_local_users") || "{}";
    let users: Record<string, any> = {};
    try {
      users = JSON.parse(usersStr);
    } catch {
      users = {};
    }

    const key = clean.toLowerCase();
    const user = users[key];
    if (!user || user.password !== password) {
      return { ok: false, error: "Invalid username or password." };
    }

    // Save local session
    const session = { username: user.username, id: user.id };
    setLocalCookie("flowstate-local-session", JSON.stringify(session));

    return { ok: true };
  }
}

export async function logOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  } else {
    deleteLocalCookie("flowstate-local-session");
  }
}

export async function changeUsername(rawUsername: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);
  if (!USERNAME_PATTERN.test(clean)) {
    return { ok: false, error: "Invalid username format." };
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("flowstate-change-username", {
      body: { username: clean },
    });

    if (error || !data?.username) {
      return { ok: false, error: await extractError(error, data) };
    }

    return { ok: true, username: data.username };
  } else {
    if (typeof window === "undefined") {
      return { ok: false, error: "Browser environment required for local fallback username change." };
    }

    const sessionStr = getLocalCookie("flowstate-local-session");
    if (!sessionStr) return { ok: false, error: "Not logged in." };

    let session: any;
    try {
      session = JSON.parse(sessionStr);
    } catch {
      return { ok: false, error: "Invalid session." };
    }

    const usersStr = localStorage.getItem("flowstate_local_users") || "{}";
    let users: Record<string, any> = {};
    try {
      users = JSON.parse(usersStr);
    } catch {
      users = {};
    }

    const oldKey = session.username.toLowerCase();
    const newKey = clean.toLowerCase();

    if (oldKey !== newKey && users[newKey]) {
      return { ok: false, error: "That username is already taken." };
    }

    const user = users[oldKey];
    if (!user) return { ok: false, error: "User not found." };

    // Update user record
    delete users[oldKey];
    user.username = clean;
    users[newKey] = user;
    localStorage.setItem("flowstate_local_users", JSON.stringify(users));

    // Update current session
    session.username = clean;
    setLocalCookie("flowstate-local-session", JSON.stringify(session));

    return { ok: true, username: `@${clean}` };
  }
}

export async function getCurrentUsername(): Promise<string | null> {
  if (isSupabaseConfigured()) {
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
  } else {
    if (typeof window === "undefined") return null;
    const sessionStr = getLocalCookie("flowstate-local-session");
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      return `@${session.username}`;
    } catch {
      return null;
    }
  }
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
