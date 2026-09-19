import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ratingSchema = z.number().int().min(1).max(5);
const textSchema = z.string().trim().min(1).max(500);

const submitSchema = z.object({
  eventId: z.string().uuid(),
  employeeEmail: z.string().email(),
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

const statusInputSchema = z.object({
  email: z.string().email().optional(),
});

/** Returns the active event and whether the signed-in employee already submitted. */
export const getFeedbackStatus = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => statusInputSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: event, error: eventError } = await supabaseAdmin
        .from("events")
        .select("id, event_name, event_year")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (eventError) throw new Error(eventError.message);
      if (!event) return { event: null, alreadySubmitted: false, submittedAt: null };

      if (!data.email) {
        return { event, alreadySubmitted: false, submittedAt: null };
      }

      const { data: existing, error: fbError } = await supabaseAdmin
        .from("feedback")
        .select("id, submitted_at")
        .eq("event_id", event.id)
        .eq("employee_email", data.email.toLowerCase())
        .maybeSingle();
      if (fbError) throw new Error(fbError.message);

      return {
        event,
        alreadySubmitted: !!existing,
        submittedAt: existing?.submitted_at ?? null,
      };
    } catch (e: unknown) {
      if (e instanceof Error && e.message?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        return {
          event: null,
          alreadySubmitted: false,
          submittedAt: null,
          configError:
            "SERVER CONFIG ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in local environment variables (.env).",
        };
      }
      throw e;
    }
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .validator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const email = data.employeeEmail.toLowerCase();
      let userId = "00000000-0000-0000-0000-000000000000"; // Fallback

      // Ensure a valid user_id exists in auth.users to satisfy the foreign key constraint
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = usersData?.users.find((u) => u.email === "anonymous@feedback.local");

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
          email: "anonymous@feedback.local",
          password: crypto.randomUUID(),
          email_confirm: true,
        });
        if (newUser.user?.id) userId = newUser.user.id;
      }
      const { data: existing } = await supabaseAdmin
        .from("feedback")
        .select("id")
        .eq("event_id", data.eventId)
        .eq("employee_email", email)
        .maybeSingle();
      if (existing) return { status: "duplicate" as const };

      const { error } = await supabaseAdmin.from("feedback").insert({
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
        console.error("Supabase insert error:", error);
        // Unique violation = already submitted (race)
        if (error.code === "23505") return { status: "duplicate" as const };
        throw new Error(error.message);
      }

      // Push to Google Sheets Webhook
      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbxnLHxjupmwywrTXn52YkObhxC4JU72ZG4SqK6jqwuaE2iwWv4GtFlZZujMecZb3vIuUg/exec",
          {
            method: "POST",
            headers: { "Content-Type": "text/plain" }, // App script prefers text/plain for CORS
            body: JSON.stringify({
              submitted_at: new Date().toISOString(),
              employee_name: data.employeeName,
              employee_email: email,
              department: data.department ?? "N/A",
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
            }),
          },
        );
      } catch (webhookError) {
        console.error("Google Sheets webhook error:", webhookError);
        // We do not throw here to prevent failing the user submission if Sheets is down
      }

      return { status: "ok" as const };
    } catch (e: unknown) {
      if (e instanceof Error && e.message?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        return {
          status: "error" as const,
          configError:
            "SERVER CONFIG ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in local environment variables (.env). Please add it to bypass auth.",
        };
      }
      throw e;
    }
  });

/** Admin check via the security-definer function (never trusts the client). */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("is_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: data === true };
  });
