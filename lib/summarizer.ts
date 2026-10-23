// Extractive summary logic shared by the page and the MCP route. No model, no network:
// it keeps the opening sentences and counts recurring words.

export const SAMPLE =
  "Portfolio demos should be honest. A short summary tool can extract the first sentences and key phrases without calling an external LLM API. Keep claims bounded.";

export const MAX_SENTENCES = 10;

export type Summary = {
  top: string;
  keywords: string[];
  sentences: number;
  words: number;
};

export function splitSentences(text: string): string[] {
  return text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).filter(Boolean);
}

// Every word in the text, any length (what the "words" counter shows).
export function countWords(text: string): number {
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
}

// Words of four or more letters, ranked by how often they appear (ties keep first-seen order).
export function topKeywords(text: string, limit = 8): string[] {
  const words = text.toLowerCase().match(/[a-z฀-๿]{4,}/g) ?? [];
  const frequency = new Map<string, number>();
  for (const word of words) frequency.set(word, (frequency.get(word) ?? 0) + 1);
  return [...frequency.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word]) => word);
}

export function clampCount(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, MAX_SENTENCES);
}

export function summarize(text: string, count: number): Summary {
  const sentences = splitSentences(text);
  return {
    top: sentences.slice(0, clampCount(count)).join(" "),
    keywords: topKeywords(text),
    sentences: sentences.length,
    words: countWords(text),
  };
}
