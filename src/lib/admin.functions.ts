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

/** Admin-only listing. RLS (is_admin) already restricts the rows returned. */
export const getAdminFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError) throw new Error(adminError.message);
    if (isAdmin !== true) return { isAdmin: false as const, rows: [] as FeedbackRow[], event: null };

    const { data: event } = await supabase
      .from("events")
      .select("id, event_name, event_year")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from("feedback")
      .select(
        "id, employee_id, employee_name, employee_email, department, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, submitted_at",
      )
      .order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);

    return { isAdmin: true as const, rows: (data ?? []) as FeedbackRow[], event };
  });
