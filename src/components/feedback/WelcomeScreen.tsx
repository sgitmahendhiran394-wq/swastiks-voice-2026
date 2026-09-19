import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/Mascot";

export function WelcomeScreen({ firstName, onStart }: { firstName: string; onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="eyebrow">Swastiks</p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-gold-gradient sm:text-5xl">
        Engineers' Day 2026
      </h1>
      <p className="mt-3 text-sm font-medium tracking-wide text-muted-foreground">
        Your Experience. Your Voice. Your Ideas.
      </p>

      <div className="mt-8 flex items-end justify-center gap-6">
        <Mascot kind="lion" className="h-28 w-28 sm:h-36 sm:w-36" />
        <Mascot kind="parrot" className="h-24 w-24 sm:h-32 sm:w-32" delay={0.4} flip />
      </div>

      <p className="mt-8 text-xl font-semibold text-foreground">Hi, {firstName} 👋</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Help us make our next celebration even better.
      </p>

      <Button variant="hero" size="xl" className="mt-8" onClick={onStart}>
        <Sparkles className="mr-2 h-4 w-4" /> Start Feedback
      </Button>
    </motion.div>
  );
}
