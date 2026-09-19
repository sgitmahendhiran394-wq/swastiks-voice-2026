import { createFileRoute } from "@tanstack/react-router";
import { SignInScreen } from "@/components/auth/SignInScreen";

const TITLE = "Swastiks Engineers' Day 2026 — Employee Feedback";
const DESC =
  "Your Experience. Your Voice. Your Ideas. Share your Engineers' Day 2026 feedback with Swastiks.";

export const Route = createFileRoute("/")({
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
