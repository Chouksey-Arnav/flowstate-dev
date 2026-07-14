import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { randomUUID } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  username: string;
  password: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, password } = (await req.json()) as RequestBody;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing username or password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Generate synthetic email based on username
    const uuid = randomUUID();
    const email = `${uuid}@flowstate.internal`;

    // Create user in auth.users
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: authError?.message || "Failed to create user" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert profile with username
    const { error: profileError } = await admin
      .from("flowstate_profiles")
      .insert({
        id: authData.user.id,
        username,
      });

    if (profileError) {
      // Cleanup: delete the user if profile creation fails
      await admin.auth.admin.deleteUser(authData.user.id);
      return new Response(JSON.stringify({ error: profileError.message || "Failed to create profile" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sign in the user to get session
    const { data: sessionData, error: sessionError } = await admin.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError || !sessionData.session) {
      return new Response(JSON.stringify({ error: sessionError?.message || "Failed to create session" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        },
        username,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
