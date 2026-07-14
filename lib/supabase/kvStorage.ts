import type { StateStorage } from "zustand/middleware";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const TABLE = "flowstate_kv";
const DEBOUNCE_MS = 400;

const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Zustand `persist` storage backed by Supabase when configured, or standard browser
 * `localStorage` as a robust fallback.
 */
export const supabaseKvStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(`flowstate-local-store-${name}`);
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select("value")
      .eq("key", name)
      .maybeSingle();

    if (error || !data) return null;
    return JSON.stringify(data.value);
  },

  setItem(name: string, value: string): void {
    if (!isSupabaseConfigured()) {
      if (typeof window === "undefined") return;
      localStorage.setItem(`flowstate-local-store-${name}`, value);
      return;
    }

    const existingTimer = pendingWrites.get(name);
    if (existingTimer) clearTimeout(existingTimer);

    pendingWrites.set(
      name,
      setTimeout(async () => {
        pendingWrites.delete(name);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from(TABLE)
          .upsert({ user_id: user.id, key: name, value: JSON.parse(value) }, { onConflict: "user_id,key" });
      }, DEBOUNCE_MS)
    );
  },

  async removeItem(name: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (typeof window === "undefined") return;
      localStorage.removeItem(`flowstate-local-store-${name}`);
      return;
    }

    const existingTimer = pendingWrites.get(name);
    if (existingTimer) clearTimeout(existingTimer);
    pendingWrites.delete(name);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from(TABLE).delete().eq("key", name);
  },
};
