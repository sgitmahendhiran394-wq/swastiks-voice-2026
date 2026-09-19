import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type FeedbackRow = {
  id: string;
  employee_id: string | null;
  employee_name: string;
  employee_email: string;
  department: string | null;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: string;
  q10: string;
  submitted_at: string;
};

export const getAdminFeedback = createServerFn({ method: "POST" })
  .validator((d: { token?: string }) => d)
  .handler(async ({ data }) => {
    const { token } = data;
    if (!token) throw new Error("No token provided");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claims, error: claimsError } = await supabaseAdmin.auth.getClaims(token);
    if (claimsError || !claims?.claims) throw new Error("Invalid token");

    // Use a fresh client scoped to this user
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: { persistSession: false },
      },
    );

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError) throw new Error(adminError.message);
    if (isAdmin !== true)
      return { isAdmin: false as const, rows: [] as FeedbackRow[], event: null };

    const { data: event } = await supabaseAdmin
      .from("events")
      .select("id, event_name, event_year")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: feedbackData, error } = await supabaseAdmin
      .from("feedback")
      .select(
        "id, employee_id, employee_name, employee_email, department, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, submitted_at",
      )
      .order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);

    return { isAdmin: true as const, rows: (feedbackData ?? []) as FeedbackRow[], event };
  });

export const deleteFeedback = createServerFn({ method: "POST" })
  .validator((d: { token?: string; feedbackId: string }) => d)
  .handler(async ({ data }) => {
    const { token, feedbackId } = data;
    if (!token) throw new Error("No token provided");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claims, error: claimsError } = await supabaseAdmin.auth.getClaims(token);
    if (claimsError || !claims?.claims) throw new Error("Invalid token");

    // Use a fresh client scoped to this user
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: { persistSession: false },
      },
    );

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || isAdmin !== true) throw new Error("Unauthorized");

    const { error } = await supabaseAdmin.from("feedback").delete().eq("id", feedbackId);

    if (error) throw new Error(error.message);

    return { success: true };
  });
