import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://venfrxrsqutlyxhsblbx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmZyeHJzcXV0bHl4aHNibGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzY5ODUsImV4cCI6MjEwMzg1Mjk4NX0.6tmXf2Y1-AZdq4o_9QlFmSjEVddY3n7iNmyJ5uAWUeE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});
