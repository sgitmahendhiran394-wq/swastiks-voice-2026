import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginScreen } from "@/components/auth/AdminLoginScreen";

const TITLE = "Admin Login — Swastiks Engineers' Day 2026";
const DESC = "Secure access to the Admin Dashboard.";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AdminLoginScreen,
});
