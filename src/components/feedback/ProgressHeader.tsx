import { motion } from "motion/react";
import { QUESTIONS, isAnswered, type Answers } from "@/lib/questions";
import { cn } from "@/lib/utils";

export function ProgressHeader({ step, answers }: { step: number; answers: Answers }) {
  const total = QUESTIONS.length;
  const current = Math.min(step + 1, total);
  const pct = Math.round((Object.keys(answers).filter((k) =>
    QUESTIONS.some((q) => q.id === k && isAnswered(q, answers)),
  ).length / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="eyebrow">
          Question {current} of {total}
        </span>
        <span className="font-semibold text-gold">{pct}% complete</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-glass">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-electric via-gold to-gold-light"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {QUESTIONS.map((q, i) => {
          const done = isAnswered(q, answers);
          return (
            <span
              key={q.id}
              aria-hidden
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                done ? "bg-success" : i === step ? "bg-gold" : "bg-white/20",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
