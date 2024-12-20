// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yqkrrstiozpdlcuaiibv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxa3Jyc3Rpb3pwZGxjdWFpaWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTA0NDMsImV4cCI6MjA0OTE4NjQ0M30.ZXEM3nN8cVZi2tJOQEEbvYT2UCh6gV4RrFWIu_j7j0U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    redirectTo: "https://fructifyme.github.io/sketchy-colorspace/#/dashboard"
  },
  functions: {
    baseUrl: SUPABASE_URL
  }
});