import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const hasSupabaseConfig = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey
);

export const supabaseAdmin = hasSupabaseConfig
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
  : null;
