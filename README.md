# Text Summarizer

A browser-only extractive summarizer: it keeps the first N sentences (1-10) of the text you paste, counts words and
sentences, and lists the eight most repeated words of four or more letters. No model or API is called; nothing is
saved.

Live: https://text-summarizer.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No TF-IDF or sentence scoring, no abstractive summary, no LLM, no highlighting, no export, no offline mode.
- No account, history or storage. Thai text without spaces or sentence punctuation is treated as one long word and
  one sentence.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: summarizer logic, MCP route, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/summarizer.ts`: `splitSentences`, `countWords`, `topKeywords`, `clampCount` and `summarize` (used by the page
  and the MCP route).
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `summarize`, `keywords` and `get_sample`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
