import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";
import { Mascot } from "@/components/brand/Mascot";

/**
 * Company identity screen: "Continue with Company Account".
 * No manual forms — identity comes from Google Workspace.
 */
export function SignInScreen() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/feedback", replace: true });
  }, [loading, isAuthenticated, navigate]);

  async function signIn() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setError("Unable to verify your company account.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/feedback", replace: true });
  }

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <Backdrop />
      <Mascot kind="lion" className="absolute -left-10 bottom-0 hidden w-[22rem] opacity-30 lg:block xl:w-[28rem]" duration={11} />
      <Mascot kind="parrot" className="absolute -right-6 top-10 hidden w-56 opacity-25 lg:block xl:w-64" duration={8} delay={1} flip />

      <motion.section
        {...fade(0)}
        className="glass relative w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <BrandLockup size="md" />
        <motion.p {...fade(0.15)} className="eyebrow mt-8">
          Engineers' Day 2026
        </motion.p>
        <motion.h1 {...fade(0.22)} className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          Your Experience.
          <br />
          Your Voice. <span className="text-gold-gradient">Your Ideas.</span>
        </motion.h1>
        <motion.p {...fade(0.3)} className="mt-4 text-sm text-muted-foreground">
          Sign in once with your company account — no forms, no passwords. We'll pick up your name automatically.
        </motion.p>

        <motion.div {...fade(0.4)} className="mt-8">
          <Button variant="hero" size="xl" className="w-full" onClick={signIn} disabled={busy || loading}>
            <Building2 />
            {busy ? "Connecting…" : "Continue with Company Account"}
            {!busy && <ArrowRight />}
          </Button>
          {error && (
            <div className="mt-4 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{error}</p>
              <button onClick={signIn} className="mt-1 text-xs font-semibold uppercase tracking-widest text-gold hover:underline">
                Try again
              </button>
            </div>
          )}
        </motion.div>

        <motion.div {...fade(0.5)} className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success-light" />
          Secure company sign-in · One response per employee
        </motion.div>
      </motion.section>
    </main>
  );
}
