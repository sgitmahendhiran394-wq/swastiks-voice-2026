import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";

export function AdminLoginScreen() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/admin", replace: true });
      }
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill out your email and password.");
      setBusy(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
      setBusy(false);
    }
  }

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <Backdrop dense hideVideo />

      <motion.section
        {...fade(0)}
        className="glass relative w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <BrandLockup size="md" />
        <motion.p {...fade(0.15)} className="eyebrow mt-8">
          Secure Access
        </motion.p>
        <motion.h1 {...fade(0.22)} className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          Admin <span className="text-gold-gradient">Login.</span>
        </motion.h1>
        <motion.p {...fade(0.3)} className="mt-4 text-sm text-muted-foreground">
          Enter your administrator credentials to access the feedback dashboard.
        </motion.p>

        <motion.form {...fade(0.4)} className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-glass-border bg-glass-dark px-4 py-3 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-glass-border bg-glass-dark px-4 py-3 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </div>

          <Button type="submit" variant="hero" size="xl" className="mt-6 w-full" disabled={busy}>
            {busy ? "Authenticating…" : "Login to Dashboard"}
            {!busy && <ArrowRight />}
          </Button>
          {error && (
            <div className="mt-4 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{error}</p>
            </div>
          )}
        </motion.form>

        <motion.div
          {...fade(0.5)}
          className="mt-6 flex items-center justify-between text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-gold" />
            Authorized personnel only
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="hover:text-foreground transition-colors"
          >
            Back to User Site
          </button>
        </motion.div>
      </motion.section>
    </main>
  );
}
