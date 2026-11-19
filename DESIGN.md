# Text Summarizer — Design

Since 2026-11-19 the summarizer uses the shared **App shell** (see `APP-SHELL.md`; `app/app-shell.css` and
`components/app-shell.tsx` are copied byte for byte from productivity-ideas-web). It replaced the earlier
"copy desk" look, whose 10px letter-spaced mono labels, near-4.5:1 muted text, 10px Load sample link, 70px
number input, unloaded system fonts (Trebuchet / Georgia / Courier), missing focus ring on the textarea and
missing link back to the hub failed the design floor (review 2026-11-11).

- Single column on phones, two cards side by side from 900px: **Source text** (textarea, word and sentence
  count, Load sample, Clear, a "Jump to the summary" link on phones) and **Summary** (the extract, Sentences to
  keep as a 44px number field, Copy summary, keywords as pills).
- Honesty: a grey pill says "Extractive · no AI model, no API"; the note under the cards repeats that it does
  not understand meaning or call an LLM, and that nothing leaves the browser.

Floor: Geist via `next/font` (variable on `<html>`), text ≥ 12px, controls ≥ 44px, 4.5:1 text contrast in
light and dark, 3px focus ring, forced-colors support, no horizontal scroll at 320px. `/more-projects`
redirects (308) to https://bookchaowalit.com/ and the footer links there. Canonical domain, robots.txt and
sitemap.xml: https://text-summarizer.bookchaowalit.com.
