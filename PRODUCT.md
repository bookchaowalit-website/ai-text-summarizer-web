# Text Summarizer — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `text-summarizer`, evidence Prototype) on
> 2026-10-23.

## What it is

A client-side extractive summarizer: the "summary" is the opening sentences of the source text, unchanged.

## Who it is for

A portfolio visitor who wants to see a small editing-desk UI, and anyone who needs a quick first-N-sentences cut.

## What works today

1. Paste or type text; the page shows the word and sentence counts and the first N sentences (N = 1-10).
2. The eight most frequent words of four or more letters are listed as keywords.
3. Copy the extract to the clipboard; reload the sample text.
4. `/api/mcp` answers JSON-RPC with `summarize`, `keywords` and `get_sample`, running the same code as the page.
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No TF-IDF or sentence scoring, highlighting, export or offline mode (claims removed from the portfolio card in the
  2026-10 review). No LLM or any other model.
- Keywords include common words (no stop-word list). Thai text is not segmented.
- No account, storage or history; nothing survives a reload. No product analytics beyond Vercel Analytics.

## Live URL and deploy state

- Live: https://text-summarizer.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-text-summarizer-frontend` is deployed only by CLI (last production 2026-10-23,
  CLI deploy of commit 07d4474, the Next 16.4.2 security patch) and its Git link names the old repository
  `bookchaowalit/bookchaowalit-text-summarizer-frontend`, so a push to `main` does not deploy. The live site lags
  `main` (no Sentry, template MCP route, old word counter) until the owner reconnects Vercel Git to this repository
  (owner action D9). `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project (Sentry project
  `ai-text-summarizer-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route.
