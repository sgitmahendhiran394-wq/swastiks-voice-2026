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
  const email = "sgitmahendhiran394@gmail.com";
  const password = "AdminPassword123!";

  console.log("Checking for existing admin user...");
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();

  let userId = users.find((u) => u.email === email)?.id;

  if (!userId) {
    console.log("Creating admin user...");
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error("Create error:", createError);
      return;
    }
    userId = newUser.user?.id;
  } else {
    console.log("User already exists! Forcing password reset to AdminPassword123!...");
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: password,
      email_confirm: true,
    });
    if (updateError) {
      console.error("Password reset error:", updateError);
    }
  }

  console.log("Admin User ID:", userId);
  console.log("Adding to admin_allowlist...");

  const { error: insertError } = await supabase
    .from("admin_allowlist")
    .upsert({ email }, { onConflict: "email" });

  if (insertError) {
    console.error("Insert error:", insertError);
  } else {
    console.log("✅ Admin user created/updated and whitelisted successfully!");
    console.log(`\n👉 You can now log in at /admin-login with:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}\n`);
  }
}
run();
