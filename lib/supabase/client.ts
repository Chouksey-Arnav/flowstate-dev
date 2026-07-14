import { createBrowserClient } from "@supabase/ssr";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const client = createBrowserClient(
    url || "https://placeholder-project.supabase.co",
    key || "placeholder-anon-key"
  );

  if (!url || !key) {
    // Override methods on the client to simulate a logged in user with mock session
    client.auth.getUser = async () => {
      const cookie = getCookie("flowstate-mock-session");
      if (cookie) {
        try {
          const session = JSON.parse(cookie);
          return {
            data: {
              user: {
                id: session.id,
                email: `${session.id}@flowstate.internal`,
                user_metadata: { username: session.username },
              } as any,
            },
            error: null,
          };
        } catch {}
      }
      return { data: { user: null }, error: null };
    };

    // Override table operations for flowstate_kv to store user state locally in localStorage when supabase is offline/unconfigured
    client.from = (table: string) => {
      return {
        select: () => {
          return {
            eq: (column: string, value: any) => {
              return {
                maybeSingle: async () => {
                  if (table === "flowstate_kv") {
                    const storeKey = `_flowstate_mock_kv_${value}`;
                    const localData = typeof window !== "undefined" ? localStorage.getItem(storeKey) : null;
                    if (localData) {
                      return { data: { value: JSON.parse(localData) }, error: null };
                    }
                  } else if (table === "flowstate_profiles") {
                    const cookie = getCookie("flowstate-mock-session");
                    if (cookie) {
                      try {
                        const session = JSON.parse(cookie);
                        return { data: { username: session.username }, error: null };
                      } catch {}
                    }
                  }
                  return { data: null, error: null };
                },
                single: async () => {
                  return { data: null, error: null };
                }
              };
            }
          };
        },
        upsert: async (values: any) => {
          if (table === "flowstate_kv" && values) {
            const storeKey = `_flowstate_mock_kv_${values.key}`;
            if (typeof window !== "undefined") {
              localStorage.setItem(storeKey, JSON.stringify(values.value));
            }
          }
          return { data: null, error: null };
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              if (table === "flowstate_kv") {
                const storeKey = `_flowstate_mock_kv_${value}`;
                if (typeof window !== "undefined") {
                  localStorage.removeItem(storeKey);
                }
              }
              return { data: null, error: null };
            }
          };
        }
      } as any;
    };
  }

  return client;
}
