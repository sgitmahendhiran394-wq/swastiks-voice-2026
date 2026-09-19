export type RatingLabel = { value: 1 | 2 | 3 | 4 | 5; label: string };

export const STANDARD_LABELS: RatingLabel[] = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];

export const FUTURE_LABELS: RatingLabel[] = [
  { value: 1, label: "Definitely Not" },
  { value: 2, label: "Probably Not" },
  { value: 3, label: "Maybe" },
  { value: 4, label: "Probably Yes" },
  { value: 5, label: "Definitely Yes" },
];

export type Question =
  | {
      id: RatingKey;
      index: number;
      type: "rating";
      title: string;
      short: string;
      labels: RatingLabel[];
    }
  | {
      id: TextKey;
      index: number;
      type: "text";
      title: string;
      short: string;
      placeholder: string;
      maxLength: number;
    };

export type RatingKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";
export type TextKey = "q9" | "q10";
export type AnswerKey = RatingKey | TextKey;

export const RATING_KEYS: RatingKey[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];
export const TEXT_MAX = 500;

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    index: 1,
    type: "rating",
    title: "How would you rate your overall Engineers’ Day experience?",
    short: "Overall Experience",
    labels: STANDARD_LABELS,
  },
  {
    id: "q2",
    index: 2,
    type: "rating",
    title: "How engaging and energetic did you find the celebration?",
    short: "Engagement",
    labels: STANDARD_LABELS,
  },
  {
    id: "q3",
    index: 3,
    type: "rating",
    title: "How enjoyable were the games and activities?",
    short: "Games & Activities",
    labels: STANDARD_LABELS,
  },
  {
    id: "q4",
    index: 4,
    type: "rating",
    title: "How well did the event encourage interaction between employees and teams?",
    short: "Interaction",
    labels: STANDARD_LABELS,
  },
  {
    id: "q5",
    index: 5,
    type: "rating",
    title: "How well did the event reflect the spirit of engineering and innovation?",
    short: "Engineering Spirit",
    labels: STANDARD_LABELS,
  },
  {
    id: "q6",
    index: 6,
    type: "rating",
    title: "How would you rate the overall organization and coordination of the event?",
    short: "Organization",
    labels: STANDARD_LABELS,
  },
  {
    id: "q7",
    index: 7,
    type: "rating",
    title: "How would you rate the creativity and uniqueness of the activities?",
    short: "Creativity",
    labels: STANDARD_LABELS,
  },
  {
    id: "q8",
    index: 8,
    type: "rating",
    title: "Would you like to participate in similar employee activities in the future?",
    short: "Future Activities",
    labels: FUTURE_LABELS,
  },
  {
    id: "q9",
    index: 9,
    type: "text",
    title: "Which part of Engineers’ Day did you enjoy the most, and why?",
    short: "Favourite Moment",
    placeholder: "Tell us about your favourite moment...",
    maxLength: TEXT_MAX,
  },
  {
    id: "q10",
    index: 10,
    type: "text",
    title:
      "If you could improve one thing or add something to our next celebration, what would it be?",
    short: "Improvement Idea",
    placeholder: "Your idea could become our next activity...",
    maxLength: TEXT_MAX,
  },
];

export type Answers = Partial<Record<RatingKey, number> & Record<TextKey, string>>;

export function isAnswered(q: Question, answers: Answers): boolean {
  if (q.type === "rating") {
    const v = answers[q.id];
    return typeof v === "number" && v >= 1 && v <= 5;
  }
  const t = answers[q.id];
  return typeof t === "string" && t.trim().length > 0 && t.length <= q.maxLength;
}

export function allAnswered(answers: Answers): boolean {
  return QUESTIONS.every((q) => isAnswered(q, answers));
}

export function ratingLabel(q: Question, value: number): string {
  if (q.type !== "rating") return "";
  return q.labels.find((l) => l.value === value)?.label ?? "";
}
