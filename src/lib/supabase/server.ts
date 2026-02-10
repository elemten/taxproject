import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/server/env";

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) {
    return serviceClient;
  }

  const env = getEnv();
  serviceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "trustedge-taxproject-backend",
      },
    },
  });

  return serviceClient;
}
