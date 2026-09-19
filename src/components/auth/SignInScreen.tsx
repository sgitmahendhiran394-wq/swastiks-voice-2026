import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";

export function SignInScreen() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/feedback", replace: true });
  }, [loading, isAuthenticated, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Please fill out your name and email.");
      setBusy(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setBusy(false);
      return;
    }

    try {
      login({ name, email, employeeId: employeeId || null, department: department || null });
      navigate({ to: "/feedback", replace: true });
    } catch {
      setError("An unexpected error occurred.");
      setBusy(false);
    }
  }

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6">
      <Backdrop />

      <motion.section
        {...fade(0)}
        className="glass relative w-full max-w-md rounded-3xl p-6 sm:p-8"
      >
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <BrandLockup size="md" />
        <motion.p {...fade(0.15)} className="eyebrow mt-4">
          Engineers' Day 2026
        </motion.p>
        <motion.h1 {...fade(0.22)} className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          Your Experience.
          <br />
          Your Voice. <span className="text-gold-gradient">Your Ideas.</span>
        </motion.h1>
        <motion.p {...fade(0.3)} className="mt-3 text-sm text-muted-foreground">
          Please enter your details below to begin the feedback survey.
        </motion.p>

        <motion.form {...fade(0.4)} className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-glass-border bg-black/50 px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy || loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Company Email *
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-glass-border bg-black/50 px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || loading}
            />
          </div>
          <div>
            <label htmlFor="empId" className="block text-sm font-medium text-foreground">
              Employee ID (Optional)
            </label>
            <input
              id="empId"
              type="text"
              className="mt-1 block w-full rounded-xl border border-glass-border bg-black/50 px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={busy || loading}
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-foreground">
              Department (Optional)
            </label>
            <input
              id="department"
              type="text"
              className="mt-1 block w-full rounded-xl border border-glass-border bg-black/50 px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={busy || loading}
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="mt-4 w-full"
            disabled={busy || loading}
          >
            {busy ? "Starting…" : "Start Feedback"}
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
            <ShieldCheck className="size-3.5 text-success-light" />
            One response per employee
          </div>
          <button
            onClick={() => navigate({ to: "/admin-login" })}
            className="hover:text-foreground transition-colors"
          >
            Admin Login
          </button>
        </motion.div>
      </motion.section>
    </main>
  );
}
