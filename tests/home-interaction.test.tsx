// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  act(() => {
    Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("summarizer", () => {
  it("changes the kept sentences, clears to an empty state and reloads the sample", () => {
    type($<HTMLInputElement>("input[type=number]")!, "1");
    expect($(".ts-summary")!.textContent).toBe("Portfolio demos should be honest.");
    press(button("Clear"));
    expect($(".ts-summary")!.textContent).toContain("Paste or type some text");
    expect(button("Copy summary").disabled).toBe(true);
    expect(host.textContent).toContain("None yet");
    press(button("Load sample"));
    expect($<HTMLTextAreaElement>("#source")!.value).toContain("Portfolio demos");
  });

  it("copies the summary or says the copy was blocked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await act(async () => { button("Copy summary").click(); });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Portfolio demos should be honest."));
    expect($("[role=status]")!.textContent).toBe("Summary copied.");
    writeText.mockRejectedValueOnce(new Error("blocked"));
    await act(async () => { button("Copy summary").click(); });
    expect($("[role=status]")!.textContent).toContain("Copy was blocked");
    type($<HTMLTextAreaElement>("#source")!, "New text. Second.");
    expect($("[role=status]")!.textContent).toBe("");
  });

  it("renders the copy status region before the first copy", () => {
    const region = $(".ts-copy-status")!;
    expect(region.getAttribute("role")).toBe("status");
    expect(region.textContent).toBe("");
  });

  it("drops the Copied state when the summary changes without typing", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await act(async () => { button("Copy summary").click(); });
    expect($(".ts-copy-status")!.textContent).toBe("Summary copied.");
    type($<HTMLInputElement>("input[type=number]")!, "1");
    expect($(".ts-copy-status")!.textContent).toBe("");
    await act(async () => { button("Copy summary").click(); });
    press(button("Clear"));
    expect($(".ts-copy-status")!.textContent).toBe("");
  });

  it("does not show a late copy result for a summary that has since changed", async () => {
    let finish!: () => void;
    const writeText = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    act(() => { button("Copy summary").click(); });
    type($<HTMLInputElement>("input[type=number]")!, "1");
    await act(async () => { finish(); });
    expect($(".ts-copy-status")!.textContent).toBe("");
  });

  it("lets a long unbroken keyword wrap inside its pill", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("app/globals.css", "utf8");
    expect(css).toMatch(/\.ts-keywords \.as-pill \{[^}]*white-space: normal;[^}]*overflow-wrap: anywhere;/);
    expect(css).toMatch(/\.ts-keywords dd \{[^}]*min-width: 0;[^}]*max-width: 100%;/);
  });
});
