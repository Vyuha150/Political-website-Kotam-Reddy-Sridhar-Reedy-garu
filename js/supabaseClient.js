import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://wduqrkpokfhqpumfkwrm.supabase.co/"; // Shared Supabase project used by the admin panel
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdXFya3Bva2ZocXB1bWZrd3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Nzk3MzYsImV4cCI6MjA5MDM1NTczNn0.pF0lqgs5VxFUKfJtqXUzHBd7tiqlsY-6ws8m9Xu4dI8"; // Shared Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
