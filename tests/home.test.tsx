import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the sample extract, counters and the no-LLM notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Make the");
    expect(html).toContain("Portfolio demos should be honest. A short summary tool can extract");
    expect(html).toContain("26<!-- --> words / <!-- -->3<!-- --> sentences");
    expect(html).toContain("EXTRACTIVE / NO API");
    expect(html).toContain("It does not understand meaning, fact-check, or call an LLM.");
  });
});
