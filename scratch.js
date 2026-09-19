import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ebrcsxediwebssueadtv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function run() {
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("List error:", listError);
    return;
  }
  let userId = users.find((u) => u.email === "anonymous@feedback.local")?.id;

  if (!userId) {
    console.log("Creating dummy user...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: "anonymous@feedback.local",
      password: "SuperSecretPassword123!",
      email_confirm: true,
    });
    if (createError) {
      console.error("Create error:", createError);
      return;
    }
    userId = newUser.user?.id;
  }

  console.log("Dummy user ID:", userId);
}
run();
