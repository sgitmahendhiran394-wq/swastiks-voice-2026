import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Mascot } from "@/components/brand/Mascot";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: (i % 8) * 0.18,
  size: 4 + (i % 4) * 2,
}));

export function SuccessScreen({
  firstName,
  alreadySubmitted = false,
}: {
  firstName: string;
  alreadySubmitted?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden text-center">
      {!reduce && !alreadySubmitted && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold shadow-[0_0_12px] shadow-gold/70"
              style={{ left: `${p.x}%`, top: "100%", width: p.size, height: p.size }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-20, -320] }}
              transition={{ duration: 4, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/50"
      >
        <CheckCircle2 className="h-10 w-10 text-success" />
      </motion.div>

      <h1 className="relative mt-6 font-display text-3xl font-bold text-foreground sm:text-4xl">
        {alreadySubmitted ? "Feedback Already Submitted" : "Thank You! 🎉"}
      </h1>
      <p className="relative mt-3 text-lg font-semibold text-gold">Hi, {firstName}</p>
      <p className="relative mt-2 text-sm text-muted-foreground">
        {alreadySubmitted
          ? "Thank you! Your Engineers' Day feedback has already been recorded."
          : "Your feedback has been recorded successfully."}
      </p>
      <p className="relative mt-1 text-sm text-muted-foreground">
        Every idea helps us engineer a better experience.
      </p>

      <div className="relative mt-8 flex items-end justify-center gap-6">
        <Mascot kind="lion" className="h-28 w-28 sm:h-36 sm:w-36" />
        <Mascot kind="parrot" className="h-24 w-24 sm:h-32 sm:w-32" delay={0.3} flip />
      </div>

      {alreadySubmitted && (
        <div className="relative mt-12 border-t border-glass-border pt-6">
          <p className="text-sm text-muted-foreground">
            Made a mistake?{" "}
            <a
              href="mailto:sgitmahendhiran394@gmail.com?subject=Request%20Feedback%20Reset"
              className="text-gold hover:underline font-medium transition-colors"
            >
              Request a reset from the Admin
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
