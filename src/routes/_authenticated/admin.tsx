import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, Download, TableProperties, Sheet, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminFeedback, type FeedbackRow } from "@/lib/admin.functions";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { RatingCharts } from "@/components/admin/RatingCharts";
import { exportToExcel } from "@/lib/export-report";
import { formatDateTime } from "@/lib/admin-analytics";
import { Backdrop } from "@/components/brand/Backdrop";
import { BrandLockup } from "@/components/brand/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QUESTIONS, type Question } from "@/lib/questions";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchFeedback = useServerFn(getAdminFeedback);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<FeedbackRow | null>(null);

  const query = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return fetchFeedback({ data: { token: session?.access_token ?? "" } });
    },
  });

  useEffect(() => {
    // Only set up realtime if we have admin access
    if (!query.data?.isAdmin) return;

    const channel = supabase
      .channel("admin-feedback-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          queryClient.setQueryData(
            ["admin-feedback"],
            (oldData: { isAdmin: boolean; rows: FeedbackRow[]; event: unknown } | undefined) => {
              if (!oldData || !oldData.rows) return oldData;
              return {
                ...oldData,
                rows: [payload.new, ...oldData.rows],
              };
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query.data?.isAdmin, queryClient]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login", replace: true });
  };

  if (query.isLoading) {
    return (
      <main className="relative min-h-screen px-4 py-10">
        <Backdrop />
        <div className="flex h-64 flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="mt-4 text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  if (query.isError || !query.data?.isAdmin) {
    return (
      <main className="relative min-h-screen px-4 py-10">
        <Backdrop />
        <div className="mx-auto w-full max-w-3xl text-center">
          <BrandLockup size="sm" />
          <div className="glass mt-8 rounded-3xl p-10">
            <h2 className="text-xl font-bold text-red-bright">Access Denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You do not have administrative privileges to view this page.
            </p>
            <Button variant="hero" className="mt-6" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const rows = query.data.rows;

  return (
    <main className="relative min-h-screen px-4 py-10">
      <Backdrop />
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <BrandLockup size="sm" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="glass border-glass-border hover:bg-glass-dark"
              onClick={() =>
                alert(
                  "To link to Google Sheets, set up a Supabase Webhook on the 'feedback' table to post data to a Zapier or Make.com URL which adds rows to Google Sheets.",
                )
              }
            >
              <Sheet className="mr-2 h-4 w-4 text-green-500" />
              Link Google Sheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel(rows)}
              className="glass border-glass-border"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <AnalyticsCards rows={rows} />
          <RatingCharts rows={rows} />

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-foreground">
                Recent Submissions
              </h3>
              <TableProperties className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="border-b border-glass-border/50 text-xs uppercase text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Avg Rating</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/30">
                  {rows.slice(0, 50).map((row) => (
                    <tr key={row.id} className="hover:bg-glass-dark/30">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDateTime(row.submitted_at)}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">{row.employee_name}</td>
                      <td className="px-4 py-3">{row.employee_email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                          {(
                            (row.q1 +
                              row.q2 +
                              row.q3 +
                              row.q4 +
                              row.q5 +
                              row.q6 +
                              row.q7 +
                              row.q8) /
                            8
                          ).toFixed(1)}{" "}
                          ★
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRow(row)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No feedback submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Feedback Details</DialogTitle>
            <DialogDescription>
              Submitted by {selectedRow?.employee_name} ({selectedRow?.employee_email}) on{" "}
              {selectedRow ? formatDateTime(selectedRow.submitted_at) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-glass-dark/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Employee ID</p>
                <p className="font-medium">{selectedRow?.employee_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Department</p>
                <p className="font-medium">{selectedRow?.department || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="border-b border-glass-border pb-2 font-semibold text-gold">
                Quantitative Ratings
              </h4>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((qNum) => {
                const question = QUESTIONS.find((q: Question) => q.id === `q${qNum}`);
                const rating = selectedRow ? selectedRow[`q${qNum}` as keyof FeedbackRow] : 0;
                return (
                  <div
                    key={qNum}
                    className="flex flex-col justify-between gap-2 rounded-lg p-3 hover:bg-glass-dark/30 sm:flex-row sm:items-start"
                  >
                    <span className="max-w-lg text-sm text-foreground/90">{question?.title}</span>
                    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-bold text-gold">
                      {Number(rating)} / 5 ★
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <h4 className="border-b border-glass-border pb-2 font-semibold text-gold">
                Qualitative Feedback
              </h4>
              {[9, 10].map((qNum) => {
                const question = QUESTIONS.find((q: Question) => q.id === `q${qNum}`);
                const text = selectedRow ? selectedRow[`q${qNum}` as keyof FeedbackRow] : "";
                return (
                  <div key={qNum} className="space-y-2 p-3 rounded-lg bg-glass-dark/30">
                    <p className="text-sm font-medium text-foreground">{question?.title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap italic">
                      {text ? `"${text}"` : "No response provided."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
