import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTIONS, ratingLabel, type Answers } from "@/lib/questions";

type Props = {
  answers: Answers;
  submitting: boolean;
  error: string | null;
  onEdit: () => void;
  onSubmit: () => void;
};

export function ReviewScreen({ answers, submitting, error, onEdit, onSubmit }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <p className="eyebrow">Almost done</p>
      <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
        Review your feedback
      </h2>

      <ul className="mt-6 space-y-3">
        {QUESTIONS.map((q) => {
          const value = answers[q.id];
          return (
            <li key={q.id} className="rounded-2xl border border-glass-border bg-glass p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                Q{q.index} · {q.short}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{q.title}</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {q.type === "rating"
                  ? `${value ?? "—"} / 5 — ${ratingLabel(q, Number(value))}`
                  : String(value ?? "—")}
              </p>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="mt-5 rounded-xl border border-red/40 bg-red/10 p-3 text-sm text-red-bright">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="glass" size="lg" onClick={onEdit} disabled={submitting}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Edit answers
        </Button>
        <Button variant="hero" size="xl" onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting your feedback...
            </>
          ) : (
            <>
              Submit Feedback <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
