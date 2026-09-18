import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ratingSchema = z.number().int().min(1).max(5);
const textSchema = z.string().trim().min(1).max(500);

const submitSchema = z.object({
  eventId: z.string().uuid(),
  employeeName: z.string().trim().min(1).max(200),
  employeeId: z.string().trim().max(100).nullable().optional(),
  department: z.string().trim().max(200).nullable().optional(),
  q1: ratingSchema,
  q2: ratingSchema,
  q3: ratingSchema,
  q4: ratingSchema,
  q5: ratingSchema,
  q6: ratingSchema,
  q7: ratingSchema,
  q8: ratingSchema,
  q9: textSchema,
  q10: textSchema,
});

export type SubmitFeedbackInput = z.infer<typeof submitSchema>;

/** Returns the active event and whether the signed-in employee already submitted. */
export const getFeedbackStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, event_name, event_year")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (eventError) throw new Error(eventError.message);
    if (!event) return { event: null, alreadySubmitted: false, submittedAt: null };

    const { data: existing, error: fbError } = await supabase
      .from("feedback")
      .select("id, submitted_at")
      .eq("event_id", event.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (fbError) throw new Error(fbError.message);

    return {
      event,
      alreadySubmitted: !!existing,
      submittedAt: existing?.submitted_at ?? null,
    };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const email = String(claims["email"] ?? "").toLowerCase();
    if (!email) throw new Error("Unable to verify your company account.");

    const { data: existing } = await supabase
      .from("feedback")
      .select("id")
      .eq("event_id", data.eventId)
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return { status: "duplicate" as const };

    const { error } = await supabase.from("feedback").insert({
      event_id: data.eventId,
      user_id: userId,
      employee_email: email,
      employee_name: data.employeeName,
      employee_id: data.employeeId ?? null,
      department: data.department ?? null,
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
      q6: data.q6,
      q7: data.q7,
      q8: data.q8,
      q9: data.q9,
      q10: data.q10,
    });

    if (error) {
      // Unique violation = already submitted (race)
      if (error.code === "23505") return { status: "duplicate" as const };
      throw new Error(error.message);
    }
    return { status: "ok" as const };
  });

/** Admin check via the security-definer function (never trusts the client). */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("is_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: data === true };
  });
