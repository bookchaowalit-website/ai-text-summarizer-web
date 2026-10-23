import { describe, expect, it } from "vitest";
import { MAX_SENTENCES, SAMPLE, clampCount, countWords, splitSentences, summarize, topKeywords } from "@/lib/summarizer";

describe("splitSentences", () => {
  it("splits on . ! ? followed by whitespace and collapses newlines", () => {
    expect(splitSentences("One.  Two!\n\nThree? Four")).toEqual(["One.", "Two!", "Three?", "Four"]);
  });

  it("returns nothing for blank input", () => {
    expect(splitSentences("   \n ")).toEqual([]);
  });

  it("does not split inside a number like 3.5", () => {
    expect(splitSentences("It costs 3.5 baht. Cheap.")).toEqual(["It costs 3.5 baht.", "Cheap."]);
  });
});

describe("countWords", () => {
  it("counts short words too, not only keyword-length ones", () => {
    // Regression: the counter used the 4+ letter keyword list, so "Portfolio demos should be honest." showed 4 words.
    expect(countWords("Portfolio demos should be honest.")).toBe(5);
    expect(countWords("a b cd efgh")).toBe(4);
  });

  it("treats contractions and hyphenated words as one word", () => {
    expect(countWords("don't over-claim")).toBe(2);
  });

  it("is zero for empty text", () => {
    expect(countWords("")).toBe(0);
  });
});

describe("topKeywords", () => {
  it("ranks by frequency, ignores case and words under four letters", () => {
    expect(topKeywords("Data data DATA tool tool the the the the")).toEqual(["data", "tool"]);
  });

  it("caps the list", () => {
    const text = "alpha bravo charlie delta echoes foxtrot golfer hotel indigo juliet";
    expect(topKeywords(text)).toHaveLength(8);
    expect(topKeywords(text, 3)).toEqual(["alpha", "bravo", "charlie"]);
  });
});

describe("clampCount", () => {
  it("keeps the count between 1 and the maximum", () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(-4)).toBe(1);
    expect(clampCount("abc")).toBe(1);
    expect(clampCount(2.7)).toBe(2);
    expect(clampCount(99)).toBe(MAX_SENTENCES);
  });
});

describe("summarize", () => {
  it("keeps the first N sentences of the sample", () => {
    const result = summarize(SAMPLE, 1);
    expect(result.top).toBe("Portfolio demos should be honest.");
    expect(result.sentences).toBe(3);
    expect(result.words).toBe(26);
  });

  it("returns an empty extract for empty text", () => {
    expect(summarize("", 2)).toEqual({ top: "", keywords: [], sentences: 0, words: 0 });
  });
});
