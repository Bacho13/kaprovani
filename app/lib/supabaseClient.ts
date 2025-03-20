import { createClient } from "@supabase/supabase-js";

// Your Supabase URL and anon key (can be found in the Supabase dashboard under Project Settings > API)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
