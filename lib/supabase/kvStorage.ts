import type { StateStorage } from "zustand/middleware";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const TABLE = "flowstate_kv";
const DEBOUNCE_MS = 400;

const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Zustand `persist` storage backed by Supabase when configured, or falling
 * back to browser localStorage when Supabase environment variables are missing.
 */
export const supabaseKvStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    if (!isSupabaseConfigured) {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(name);
      }
      return null;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Fallback to local storage if user not logged into Supabase
        if (typeof window !== "undefined") {
          return window.localStorage.getItem(name);
        }
        return null;
      }

      const { data, error } = await supabase
        .from(TABLE)
        .select("value")
        .eq("key", name)
        .maybeSingle();

      if (error || !data) {
        if (typeof window !== "undefined") {
          return window.localStorage.getItem(name);
        }
        return null;
      }
      return JSON.stringify(data.value);
    } catch {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(name);
      }
      return null;
    }
  },

  setItem(name: string, value: string): void {
    if (!isSupabaseConfigured) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(name, value);
      }
      return;
    }

    const existingTimer = pendingWrites.get(name);
    if (existingTimer) clearTimeout(existingTimer);

    pendingWrites.set(
      name,
      setTimeout(async () => {
        pendingWrites.delete(name);
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(name, value);
            }
            return;
          }

          const { error } = await supabase
            .from(TABLE)
            .upsert({ user_id: user.id, key: name, value: JSON.parse(value) }, { onConflict: "user_id,key" });

          if (error && typeof window !== "undefined") {
            window.localStorage.setItem(name, value);
          }
        } catch {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, value);
          }
        }
      }, DEBOUNCE_MS)
    );
  },

  async removeItem(name: string): Promise<void> {
    if (!isSupabaseConfigured) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(name);
      }
      return;
    }

    const existingTimer = pendingWrites.get(name);
    if (existingTimer) clearTimeout(existingTimer);
    pendingWrites.delete(name);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(name);
        }
        return;
      }

      await supabase.from(TABLE).delete().eq("key", name);
    } catch {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(name);
      }
    }
  },
};
