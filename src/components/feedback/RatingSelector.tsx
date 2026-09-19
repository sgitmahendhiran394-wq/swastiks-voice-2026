import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import type { RatingLabel } from "@/lib/questions";
import { cn } from "@/lib/utils";

type Props = {
  labels: RatingLabel[];
  value: number | undefined;
  onChange: (value: number) => void;
};

export function RatingSelector({ labels, value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="grid grid-cols-1 gap-3 sm:grid-cols-5"
    >
      {labels.map((l) => {
        const selected = value === l.value;
        return (
          <motion.button
            key={l.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(l.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-4 text-center transition-colors",
              selected
                ? "border-gold bg-navy text-white shadow-[0_0_28px_-4px_var(--color-gold)]"
                : "border-glass-border bg-glass text-foreground hover:border-gold/60 hover:shadow-[0_0_22px_-8px_var(--color-gold)]",
            )}
          >
            <span
              className={cn(
                "font-display text-2xl font-bold",
                selected ? "text-gold" : "text-foreground/80",
              )}
            >
              {l.value}
            </span>
            <span className="text-xs font-medium leading-tight text-muted-foreground">
              {l.label}
            </span>

            <AnimatePresence>
              {selected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
