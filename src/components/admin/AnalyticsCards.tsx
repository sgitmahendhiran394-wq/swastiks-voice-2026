import { motion } from "motion/react";
import { MessageSquareQuote, Star, TrendingUp, Users } from "lucide-react";
import type { FeedbackRow } from "@/lib/admin.functions";
import { overallAverage, suggestionCount } from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";

export function AnalyticsCards({ rows }: { rows: FeedbackRow[] }) {
  const avg = overallAverage(rows);
  const cards = [
    { label: "Total Responses", value: String(rows.length), icon: Users, tone: "text-electric" },
    {
      label: "Response Rate",
      value: rows.length ? "100%" : "0%",
      hint: "of submitted responses",
      icon: TrendingUp,
      tone: "text-success",
    },
    { label: "Overall Average", value: `${avg.toFixed(2)} / 5`, icon: Star, tone: "text-gold" },
    {
      label: "Suggestions Received",
      value: String(suggestionCount(rows)),
      icon: MessageSquareQuote,
      tone: "text-red-bright",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <p className="eyebrow">{c.label}</p>
            <c.icon className={cn("h-4 w-4", c.tone)} />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-foreground">{c.value}</p>
          {c.hint && <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>}
        </motion.div>
      ))}
    </div>
  );
}
