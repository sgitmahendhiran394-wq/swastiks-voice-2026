import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { WelcomeScreen } from "@/components/feedback/WelcomeScreen";
import { ProgressHeader } from "@/components/feedback/ProgressHeader";
import { QuestionCard } from "@/components/feedback/QuestionCard";
import { NavigationButtons } from "@/components/feedback/NavigationButtons";
import { ReviewScreen } from "@/components/feedback/ReviewScreen";
import { SuccessScreen } from "@/components/feedback/SuccessScreen";
import { useAuth } from "@/hooks/useAuth";
import { QUESTIONS, isAnswered, allAnswered, type Answers } from "@/lib/questions";
import { clearDraft, loadDraft, saveDraft } from "@/lib/feedback-storage";
import { getFeedbackStatus, submitFeedback } from "@/lib/feedback.functions";

const TITLE = "Share Your Feedback — Swastiks Engineers' Day 2026";
const DESC =
  "Your Experience. Your Voice. Your Ideas. Answer ten quick questions about Engineers' Day 2026.";

export const Route = createFileRoute("/_authenticated/feedback")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: FeedbackPage,
});

type Stage = "welcome" | "questions" | "review" | "done";

function FeedbackPage() {
  const { employee, loading: authLoading } = useAuth();
  const fetchStatus = useServerFn(getFeedbackStatus);
  const submit = useServerFn(submitFeedback);

  const statusQuery = useQuery({
    queryKey: ["feedback-status", employee?.email],
    queryFn: () => fetchStatus({ data: { email: employee?.email } }),
  });

  const [stage, setStage] = useState<Stage>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  // Restore an unfinished draft for this employee.
  useEffect(() => {
    if (!employee || restored) return;
    const draft = loadDraft(employee.email);
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setStep(Math.min(draft.step, QUESTIONS.length - 1));
      setStage("questions");
    }
    setRestored(true);
  }, [employee, restored]);

  useEffect(() => {
    if (!employee || !restored || stage === "done") return;
    saveDraft(employee.email, { answers, step });
  }, [employee, answers, step, restored, stage]);

  const question = QUESTIONS[step]!;
  const alreadySubmitted = statusQuery.data?.alreadySubmitted === true;

  function setAnswer(id: string, value: number | string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function next() {
    if (step === QUESTIONS.length - 1) setStage("review");
    else setStep((s) => s + 1);
  }

  function back() {
    if (step === 0) setStage("welcome");
    else setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!employee || !statusQuery.data?.event) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await submit({
        data: {
          eventId: statusQuery.data.event.id,
          employeeEmail: employee.email,
          employeeName: employee.name,
          employeeId: employee.employeeId,
          department: employee.department,
          q1: Number(answers.q1),
          q2: Number(answers.q2),
          q3: Number(answers.q3),
          q4: Number(answers.q4),
          q5: Number(answers.q5),
          q6: Number(answers.q6),
          q7: Number(answers.q7),
          q8: Number(answers.q8),
          q9: String(answers.q9 ?? "").trim(),
          q10: String(answers.q10 ?? "").trim(),
        },
      });

      if ("configError" in result && result.configError) {
        setError(result.configError);
        setSubmitting(false);
        return;
      }

      clearDraft(employee.email);
      await statusQuery.refetch();
      setStage("done");
    } catch {
      setError("Something went wrong while submitting your feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  const loading = authLoading || statusQuery.isLoading;

  if (!authLoading && !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div>
          <p className="text-foreground">Please enter your details first.</p>
          <Button variant="hero" className="mt-4" onClick={() => (window.location.href = "/")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const showVideo = stage === "done" || alreadySubmitted;

  return (
    <main className="relative min-h-screen px-4 py-10">
      <Backdrop hideVideo={!showVideo} />
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex justify-center">
          <BrandLockup size="sm" />
        </div>

        <div className="glass mt-8 rounded-3xl p-6 sm:p-10">
          {loading ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading your feedback experience...
              </p>
            </div>
          ) : statusQuery.data?.configError ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-red-bright">
                {statusQuery.data.configError}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Please configure this in your .env file and restart the server.
              </p>
              <Button variant="gold" className="mt-5" onClick={() => statusQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : statusQuery.isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-bright">
                {statusQuery.error?.message || "Unable to verify your company account."}
              </p>
              <Button variant="gold" className="mt-5" onClick={() => statusQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : alreadySubmitted && stage !== "done" ? (
            <SuccessScreen firstName={employee?.firstName ?? "there"} alreadySubmitted />
          ) : (
            <AnimatePresence mode="wait">
              {stage === "welcome" && (
                <motion.div key="welcome" exit={{ opacity: 0 }}>
                  <WelcomeScreen
                    firstName={employee?.firstName ?? "there"}
                    onStart={() => setStage("questions")}
                  />
                </motion.div>
              )}

              {stage === "questions" && (
                <motion.div key="questions" exit={{ opacity: 0 }}>
                  <ProgressHeader step={step} answers={answers} />
                  <div className="mt-8">
                    <AnimatePresence mode="wait">
                      <QuestionCard
                        key={question.id}
                        question={question}
                        answers={answers}
                        onAnswer={setAnswer}
                      />
                    </AnimatePresence>
                  </div>
                  <NavigationButtons
                    onBack={back}
                    onNext={next}
                    nextDisabled={!isAnswered(question, answers)}
                    nextLabel={step === QUESTIONS.length - 1 ? "Review" : "Next"}
                  />
                </motion.div>
              )}

              {stage === "review" && (
                <motion.div key="review" exit={{ opacity: 0 }}>
                  <ReviewScreen
                    answers={answers}
                    submitting={submitting}
                    error={error}
                    onEdit={() => {
                      setStage("questions");
                      setStep(0);
                    }}
                    onSubmit={() => {
                      if (allAnswered(answers)) void handleSubmit();
                      else {
                        setStage("questions");
                        setStep(0);
                      }
                    }}
                  />
                </motion.div>
              )}

              {stage === "done" && (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SuccessScreen firstName={employee?.firstName ?? "there"} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}
