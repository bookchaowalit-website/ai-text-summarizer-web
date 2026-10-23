"use client";

import { useMemo, useState } from "react";
import { MAX_SENTENCES, SAMPLE, clampCount, summarize } from "@/lib/summarizer";

export default function Home() {
  const [text, setText] = useState(SAMPLE);
  const [count, setCount] = useState(2);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => summarize(text, count), [text, count]);
  const copySummary = async () => {
    try { await navigator.clipboard.writeText(result.top); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };

  return (
    <main className="copy-desk">
      <header className="desk-header">
        <div className="desk-mark">B / COPY DESK</div>
        <div className="desk-rule" />
        <div className="desk-status"><span /> EXTRACTIVE / NO API</div>
      </header>
      <section className="desk-intro">
        <div><p className="desk-label">EDITING INSTRUMENT 001</p><h1>Make the<br /><em>shorter cut.</em></h1></div>
        <p className="intro-note">A browser-only text summarizer that keeps the source sentences intact and surfaces recurring words.</p>
      </section>
      <section className="editor-station" aria-label="Text summarizer">
        <div className="source-column">
          <div className="station-head"><div><p className="desk-label">SOURCE COPY</p><h2>Paste the long version</h2></div><span className="station-id">A1</span></div>
          <textarea value={text} onChange={(event) => setText(event.target.value)} aria-label="Text to summarize" placeholder="Write or paste text here..." />
          <div className="source-footer"><span>{result.words} words / {result.sentences} sentences</span><button onClick={() => setText(SAMPLE)}>Load sample</button></div>
        </div>
        <div className="output-column">
          <div className="station-head"><div><p className="desk-label">EDITED COPY</p><h2>First sentences</h2></div><span className="station-id red">B1</span></div>
          <div className="flap-summary" aria-live="polite">{result.top || "Start typing to make an extract."}</div>
          <div className="output-controls">
            <label><span>Sentences to keep</span><input type="number" min={1} max={MAX_SENTENCES} value={count} onChange={(event) => setCount(clampCount(event.target.value))} /></label>
            <button className="copy-button" onClick={copySummary}>{copied ? "Copied" : "Copy summary"} <span>↗</span></button>
          </div>
          <div className="keyword-line"><span>KEYWORDS</span>{result.keywords.length ? result.keywords.map((word) => <b key={word}>{word}</b>) : <i>none yet</i>}</div>
        </div>
      </section>
      <section className="desk-note-block"><span className="note-pin" /> <p>This tool selects the opening sentences and counts repeated words. It does not understand meaning, fact-check, or call an LLM.</p></section>
      <footer className="desk-footer"><span>BOOKCHAOWALIT / TEXT SUMMARIZER</span><span>LOCAL BROWSER PROCESSING</span></footer>
    </main>
  );
}
