import { createFileRoute } from "@tanstack/react-router";
import { SignInScreen } from "@/components/auth/SignInScreen";

const TITLE = "Sign in — Swastiks Engineers' Day 2026";
const DESC =
  "Continue with your Swastiks company account to share your Engineers' Day 2026 feedback.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: SignInScreen,
});
