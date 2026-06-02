import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://nvmtmmqvdqrxllaisjdn.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bXRtbXF2ZHFyeGxsYWlzamRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTM4NTYsImV4cCI6MjA2NDc2OTg1Nn0.Rb5LmGho0iNn2ExWt6ReX7WVHbe-aOhhWWRKfmgEP-I"; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
