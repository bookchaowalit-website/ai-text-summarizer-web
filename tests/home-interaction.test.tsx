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
    expect($("[role=status]")).toBeNull();
  });
});
