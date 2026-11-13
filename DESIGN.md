# Design system — Text Summarizer

## Overview

The summarizer is an editorial copy desk: source copy enters on a paper sheet, the extractive result appears on a dark split-flap board, and the limitations are pinned below the work.

## Colors

- #E8E2D8 — paper-desk ground.
- #F4F0E9 — source sheet.
- #171716 — output board and primary ink.
- #1F4B74 — editorial blue for navigation and labels.
- #D85A3C — vermilion correction mark.
- #E3B473 — warm output highlight.

## Typography

Trebuchet MS is used for practical controls and Georgia for the reading voice. Courier New is reserved for editorial metadata, counters, and the honest capability note.

## Layout

The first viewport introduces the shorter-cut idea, then splits the task into source copy and edited copy. The source remains a generous writing surface; the output side groups summary, sentence count, copy action, and keyword readout in one station.

## Elevation & Depth

The paper source sheet and dark output board are adjacent material changes. A framed summary block gives the result a stable reading plane without using soft card stacks.

## Shapes

Straight editorial rules, squared controls, and one circular correction pin define the desk. No gradients, glass, or decorative progress widgets.

## Components

- Copy desk header
- Source textarea and sample loader
- Extractive summary output
- Sentence-count control and copy action
- Keyword strip and limitation note

## Do's and Don'ts

- Do say extractive and no API where the capability is introduced.
- Do keep the original text visible beside the result.
- Don't call the result semantic, factual, AI-generated, or meaning-aware.
- Don't hide the tool's limitations behind a generic “smart” label.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
