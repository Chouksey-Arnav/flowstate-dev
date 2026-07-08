import type { StateStorage } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

const TABLE = "flowstate_kv";
const DEBOUNCE_MS = 400;

const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Zustand `persist` storage backed by Supabase instead of localStorage, so
 * every store (tasks, habits, focus sessions, settings, xp, reflections,
 * blocker prefs) syncs across devices under the logged-in account. Reads
 * and writes are scoped to the current user purely by RLS — there is no
 * user_id filtering here because an unauthenticated or wrong-user request
 * simply can't see other rows.
 *
 * Writes are debounced per key so rapid-fire updates (e.g. typing in a
 * settings field) collapse into one round trip instead of one per keystroke.
 */
export const supabaseKvStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
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
