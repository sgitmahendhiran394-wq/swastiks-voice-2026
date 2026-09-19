import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeedbackRow } from "@/lib/admin.functions";
import {
  departmentSummary,
  questionAverages,
  ratingDistribution,
  distributionByQuestion,
} from "@/lib/admin-analytics";
import { RATING_KEYS } from "@/lib/questions";

const AXIS = { stroke: "rgba(255,255,255,0.45)", fontSize: 12 };
const TOOLTIP_STYLE = {
  background: "rgba(7,26,61,0.95)",
  border: "1px solid rgba(212,175,55,0.35)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 12,
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RatingCharts({ rows }: { rows: FeedbackRow[] }) {
  const dist = ratingDistribution(rows);
  const qAvg = questionAverages(rows);
  const depts = departmentSummary(rows);
  const qDist = distributionByQuestion(rows);
  const barColors = ["#22C55E", "#4ADE80", "#D4AF37", "#E53935", "#C62828"]; // 5,4,3,2,1 star colors

  // For stacked bar chart, we want questions on X axis, and star counts stacked on Y axis
  const stackedData = RATING_KEYS.map((k) => {
    const qData: Record<string, string | number> = { question: k.toUpperCase() };
    qDist.forEach((d) => {
      // mapping "5 Star" back to numerical key for coloring
      const star = parseInt(d["rating"] as string);
      qData[`star_${star}`] = (d[k.toUpperCase()] as number | string) ?? 0;
    });
    return qData;
  });

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Overall Rating Distribution">
        <BarChart data={dist}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="rating" tick={AXIS} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {dist.map((_, i) => (
              <Cell key={i} fill={barColors[i]} />
            ))}
          </Bar>
        </BarChart>
      </Panel>

      <Panel title="1–5 Star Rating Breakdown per Question">
        <BarChart data={stackedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="question" tick={AXIS} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="star_5" name="5 ★" stackId="a" fill="#22C55E" />
          <Bar dataKey="star_4" name="4 ★" stackId="a" fill="#4ADE80" />
          <Bar dataKey="star_3" name="3 ★" stackId="a" fill="#D4AF37" />
          <Bar dataKey="star_2" name="2 ★" stackId="a" fill="#E53935" />
          <Bar dataKey="star_1" name="1 ★" stackId="a" fill="#C62828" radius={[8, 8, 0, 0]} />
        </BarChart>
      </Panel>

      <Panel title="Question-wise Average (Q1–Q8)">
        <BarChart data={qAvg}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={AXIS} />
          <YAxis domain={[0, 5]} tick={AXIS} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Bar dataKey="average" fill="#1769E0" radius={[8, 8, 0, 0]} />
        </BarChart>
      </Panel>

      <Panel title="Department Summary">
        <BarChart data={depts}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="department" tick={AXIS} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="responses" name="Responses" fill="#D4AF37" radius={[8, 8, 0, 0]} />
          <Bar dataKey="average" name="Avg /5" fill="#22C55E" radius={[8, 8, 0, 0]} />
        </BarChart>
      </Panel>
    </div>
  );
}
