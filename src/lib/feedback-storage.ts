import type { Answers } from "./questions";

const KEY_PREFIX = "swastiks-ed2026-draft:";

type Draft = { answers: Answers; step: number };

function key(email: string) {
  return `${KEY_PREFIX}${email.toLowerCase()}`;
}

export function loadDraft(email: string): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(email));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || typeof parsed !== "object") return null;
    return { answers: parsed.answers ?? {}, step: Number(parsed.step) || 0 };
  } catch {
    return null;
  }
}

export function saveDraft(email: string, draft: Draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(email), JSON.stringify(draft));
  } catch {
    /* storage may be unavailable; drafts are best-effort */
  }
}

export function clearDraft(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(email));
  } catch {
    /* ignore */
  }
}
