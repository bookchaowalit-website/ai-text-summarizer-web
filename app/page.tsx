"use client";

import { useMemo, useRef, useState } from "react";
import { AppFoot, AppTop, Pill } from "@/components/app-shell";
import { MAX_SENTENCES, SAMPLE, clampCount, summarize } from "@/lib/summarizer";

const SOURCE = "https://github.com/bookchaowalit-website/ai-text-summarizer-web";

export default function Home() {
  const [text, setText] = useState(SAMPLE);
  const [count, setCount] = useState(2);
  const [copyMessage, setCopyMessage] = useState("");
  // Bumped by every edit and every copy: an edit cancels the copy status, and only the latest copy may report.
  const copyEpoch = useRef(0);
  const result = useMemo(() => summarize(text, count), [text, count]);
  const cancelCopy = () => {
    copyEpoch.current += 1;
    setCopyMessage("");
  };
  const editText = (next: string) => {
    cancelCopy();
    setText(next);
  };
  const editCount = (next: number) => {
    cancelCopy();
    setCount(next);
  };
  const copySummary = async () => {
    const mine = ++copyEpoch.current;
    let message = "Summary copied.";
    try {
      await navigator.clipboard.writeText(result.top);
    } catch {
      message = "Copy was blocked by the browser. Select the text and copy it manually.";
    }
    if (copyEpoch.current === mine) setCopyMessage(message);
  };

  return (
    <div className="as">
      <a className="as-skip" href="#source">Skip to the text</a>
      <AppTop name="Text Summarizer" tagline="Extractive, in your browser" />

      <main className="as-page">
        <div className="as-intro">
          <p className="as-eyebrow">Shorter cut</p>
          <h1>Make the shorter cut.</h1>
          <p>Paste a long text: it keeps the opening sentences intact and lists the words that recur.</p>
          <Pill tone="grey">Extractive · no AI model, no API</Pill>
        </div>

        <div className="ts-desk">
          <section className="as-composer ts-card" aria-labelledby="source-heading">
            <h2 id="source-heading">Source text</h2>
            <label className="as-field" htmlFor="source">
              Text to summarize
              <textarea id="source" value={text} onChange={(event) => editText(event.target.value)} placeholder="Write or paste text here…" aria-describedby="source-count" />
            </label>
            <div className="as-composer-foot">
              <span className="ts-meta" id="source-count">{result.words} words · {result.sentences} sentences</span>
              <div className="as-composer-actions">
                <button type="button" className="as-plain" onClick={() => editText(SAMPLE)}>Load sample</button>
                <button type="button" className="as-plain" onClick={() => editText("")} disabled={!text}>Clear</button>
              </div>
            </div>
            <a className="ts-jump" href="#summary">Jump to the summary</a>
          </section>

          <section className="as-composer ts-card" id="summary" aria-labelledby="summary-heading">
            <h2 id="summary-heading">Summary</h2>
            <p className="ts-summary" aria-live="polite" data-empty={result.top ? undefined : "true"}>{result.top || "Paste or type some text and the opening sentences appear here."}</p>
            <div className="ts-controls">
              <label className="as-field">
                Sentences to keep
                <input type="number" inputMode="numeric" min={1} max={MAX_SENTENCES} value={count} onChange={(event) => editCount(clampCount(event.target.value))} />
              </label>
              <button type="button" className="as-button" onClick={copySummary} disabled={!result.top}>Copy summary</button>
            </div>
            {/* Rendered before the first copy so screen readers announce the result. */}
            <p className="ts-meta ts-copy-status" role="status">{copyMessage}</p>
            <dl className="ts-keywords">
              <dt>Keywords</dt>
              {result.keywords.length ? result.keywords.map((word) => <dd key={word}><Pill tone="grey">{word}</Pill></dd>) : <dd className="ts-meta">None yet: words of four or more letters show up here.</dd>}
            </dl>
          </section>
        </div>

        <p className="as-note">This tool selects the opening sentences and counts repeated words. It does not understand meaning, fact-check, or call an LLM. Nothing you paste leaves this browser.</p>
      </main>
      <AppFoot source={SOURCE} />
    </div>
  );
}
