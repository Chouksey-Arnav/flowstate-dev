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

// Client-side cookie helpers
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

interface MockAccount {
  id: string;
  username: string; // Stored with leading "@"
  password?: string;
}

export async function checkUsernameAvailable(raw: string): Promise<boolean | null> {
  const clean = normalizeUsernameInput(raw);
  if (!USERNAME_PATTERN.test(clean)) return null;

  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured) {
    if (typeof window === "undefined") return true;
    const accountsRaw = localStorage.getItem("flowstate_mock_accounts") || "[]";
    const accounts: MockAccount[] = JSON.parse(accountsRaw);
    const target = `@${clean.toLowerCase()}`;
    return !accounts.some((acc) => acc.username.toLowerCase() === target);
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc("flowstate_username_available", {
    check_username: `@${clean}`,
  });
  if (error) return null;
  return data as boolean;
}

export async function signUp(rawUsername: string, password: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    if (typeof window === "undefined") {
      return { ok: false, error: "Authentication requires a browser environment or Supabase configuration." };
    }
    const accountsRaw = localStorage.getItem("flowstate_mock_accounts") || "[]";
    const accounts: MockAccount[] = JSON.parse(accountsRaw);

    const formattedUsername = `@${clean}`;
    if (accounts.some((acc) => acc.username.toLowerCase() === formattedUsername.toLowerCase())) {
      return { ok: false, error: "That username is already taken." };
    }

    const newAccount: MockAccount = {
      id: "usr_" + Math.random().toString(36).substring(2, 15),
      username: formattedUsername,
      password,
    };

    accounts.push(newAccount);
    localStorage.setItem("flowstate_mock_accounts", JSON.stringify(accounts));

    // Sign the user in
    setCookie("flowstate-mock-session", JSON.stringify({ id: newAccount.id, username: newAccount.username }));

    return { ok: true, username: newAccount.username };
  }

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
}

export async function logIn(rawUsername: string, password: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    if (typeof window === "undefined") {
      return { ok: false, error: "Authentication requires a browser environment or Supabase configuration." };
    }
    const accountsRaw = localStorage.getItem("flowstate_mock_accounts") || "[]";
    const accounts: MockAccount[] = JSON.parse(accountsRaw);

    const formattedUsername = `@${clean}`;
    const account = accounts.find(
      (acc) => acc.username.toLowerCase() === formattedUsername.toLowerCase() && acc.password === password
    );

    if (!account) {
      return { ok: false, error: "Invalid username or password." };
    }

    setCookie("flowstate-mock-session", JSON.stringify({ id: account.id, username: account.username }));
    return { ok: true, username: account.username };
  }

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
}

export async function logOut(): Promise<void> {
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured) {
    deleteCookie("flowstate-mock-session");
    return;
  }
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function changeUsername(rawUsername: string): Promise<AuthResult> {
  const clean = normalizeUsernameInput(rawUsername);
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    if (typeof window === "undefined") {
      return { ok: false, error: "Authentication requires a browser environment or Supabase configuration." };
    }
    const cookie = getCookie("flowstate-mock-session");
    if (!cookie) return { ok: false, error: "Not logged in." };

    try {
      const session = JSON.parse(cookie);
      const accountsRaw = localStorage.getItem("flowstate_mock_accounts") || "[]";
      const accounts: MockAccount[] = JSON.parse(accountsRaw);

      const formattedUsername = `@${clean}`;
      if (
        accounts.some(
          (acc) =>
            acc.username.toLowerCase() === formattedUsername.toLowerCase() &&
            acc.id !== session.id
        )
      ) {
        return { ok: false, error: "That username is already taken." };
      }

      const updatedAccounts = accounts.map((acc) =>
        acc.id === session.id ? { ...acc, username: formattedUsername } : acc
      );
      localStorage.setItem("flowstate_mock_accounts", JSON.stringify(updatedAccounts));

      // Update current session
      setCookie("flowstate-mock-session", JSON.stringify({ id: session.id, username: formattedUsername }));

      return { ok: true, username: formattedUsername };
    } catch {
      return { ok: false, error: "Something went wrong." };
    }
  }

  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("flowstate-change-username", {
    body: { username: clean },
  });

  if (error || !data?.username) {
    return { ok: false, error: await extractError(error, data) };
  }

  return { ok: true, username: data.username };
}

export async function getCurrentUsername(): Promise<string | null> {
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured) {
    const cookie = getCookie("flowstate-mock-session");
    if (!cookie) return null;
    try {
      const session = JSON.parse(cookie);
      return session.username || null;
    } catch {
      return null;
    }
  }

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
