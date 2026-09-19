import { createFileRoute } from "@tanstack/react-router";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const TITLE = "Share Your Feedback — Swastiks Engineers' Day 2026";
const DESC = "Your Experience. Your Voice. Your Ideas. Answer ten quick questions about Engineers' Day 2026.";

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

function FeedbackPage() {
  const { employee, loading } = useAuth();

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <Backdrop />
      <div className="glass relative w-full max-w-xl rounded-3xl p-8 text-center">
        <BrandLockup size="md" />
        <p className="eyebrow mt-6">Engineers' Day 2026</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          {loading ? "Loading your feedback experience..." : `Hi, ${employee?.firstName ?? "there"} 👋`}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Help us make our next celebration even better.
        </p>
        <Button variant="hero" size="xl" className="mt-8">
          Start Feedback
        </Button>
      </div>
    </main>
  );
}
