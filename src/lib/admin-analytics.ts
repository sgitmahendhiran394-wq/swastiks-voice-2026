import { RATING_KEYS, QUESTIONS, type RatingKey } from "@/lib/questions";
import type { FeedbackRow } from "@/lib/admin.functions";

export function rowAverage(row: FeedbackRow): number {
  const sum = RATING_KEYS.reduce((acc, k) => acc + Number(row[k] ?? 0), 0);
  return sum / RATING_KEYS.length;
}

export function overallAverage(rows: FeedbackRow[]): number {
  if (!rows.length) return 0;
  return rows.reduce((acc, r) => acc + rowAverage(r), 0) / rows.length;
}

export function questionAverages(rows: FeedbackRow[]) {
  return RATING_KEYS.map((k) => {
    const q = QUESTIONS.find((x) => x.id === k)!;
    const avg = rows.length ? rows.reduce((a, r) => a + Number(r[k] ?? 0), 0) / rows.length : 0;
    return { key: k, short: q.short, label: k.toUpperCase(), average: Number(avg.toFixed(2)) };
  });
}

export function ratingDistribution(rows: FeedbackRow[]) {
  return [5, 4, 3, 2, 1].map((star) => {
    const count = rows.reduce(
      (acc, r) => acc + RATING_KEYS.filter((k) => Number(r[k]) === star).length,
      0,
    );
    return { rating: `${star} ★`, star, count };
  });
}

export function distributionByQuestion(rows: FeedbackRow[]) {
  return [5, 4, 3, 2, 1].map((star) => {
    const entry: Record<string, string | number> = { rating: `${star} Star` };
    RATING_KEYS.forEach((k: RatingKey) => {
      entry[k.toUpperCase()] = rows.filter((r) => Number(r[k]) === star).length;
    });
    return entry;
  });
}

export function departmentSummary(rows: FeedbackRow[]) {
  const map = new Map<string, FeedbackRow[]>();
  rows.forEach((r) => {
    const dept = r.department?.trim() || "Unassigned";
    map.set(dept, [...(map.get(dept) ?? []), r]);
  });
  const total = rows.length || 1;
  return Array.from(map.entries())
    .map(([department, list]) => ({
      department,
      responses: list.length,
      share: Number(((list.length / total) * 100).toFixed(1)),
      average: Number(overallAverage(list).toFixed(2)),
      perQuestion: RATING_KEYS.map((k) =>
        Number((list.reduce((a, r) => a + Number(r[k] ?? 0), 0) / list.length).toFixed(2)),
      ),
    }))
    .sort((a, b) => b.responses - a.responses);
}

export function suggestionCount(rows: FeedbackRow[]) {
  return rows.filter((r) => (r.q10 ?? "").trim().length > 0).length;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
