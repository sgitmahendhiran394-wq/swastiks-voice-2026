import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ebrcsxediwebssueadtv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const { data, error } = await supabase.from("feedback").select("*");
  if (error) {
    console.error("Error fetching feedback:", error);
  } else {
    console.log(`Found ${data.length} feedback entries using service role key.`);
  }
}
run();
