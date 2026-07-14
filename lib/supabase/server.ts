import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const client = createServerClient(
    url || "https://placeholder-project.supabase.co",
    key || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without a response to write to;
            // middleware refreshes the session on the next request instead.
          }
        },
      },
    }
  );

  if (!url || !key) {
    // Override methods on the server client
    client.auth.getUser = async () => {
      const cookie = cookieStore.get("flowstate-mock-session")?.value;
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

    client.from = (table: string) => {
      return {
        select: () => {
          return {
            eq: (column: string, value: any) => {
              return {
                maybeSingle: async () => {
                  if (table === "flowstate_profiles") {
                    const cookie = cookieStore.get("flowstate-mock-session")?.value;
                    if (cookie) {
                      try {
                        const session = JSON.parse(cookie);
                        return { data: { username: session.username }, error: null };
                      } catch {}
                    }
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      } as any;
    };
  }

  return client;
}
