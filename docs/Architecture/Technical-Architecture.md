---
title: Technical Architecture — Portfolio Site
tags: [architecture, stack]
updated: 2026-08-03
---

# Technical Architecture — Portfolio Site

Covers the portfolio site itself (`/site`, not yet created). The two flagship projects have their own independent stacks — see their case studies — and are not rebuilt here, only linked/embedded.

## Stack: Astro, with a React island for the interactive hero

**Decision:** [Astro](https://astro.build) as the site framework, Markdown-driven content, one client-side "island" for the embedded synthwave-generator hero.

**Alternatives considered:**
- **Next.js/React for the whole site** — rejected. This site is content-forward (case studies, prose, one interactive hero), not app-like. Shipping a full React runtime for pages that are 95% static text is exactly the kind of unnecessary weight the master brief's performance/SEO requirements argue against.
- **Plain static HTML/CSS/JS** — rejected. Would work, but loses Markdown-driven content (meaning the case studies couldn't be pulled directly from `docs/Product/Case-Studies/` with minimal transformation) and a component model for shared layout/nav across five pages.

**Why Astro specifically:** ships zero JavaScript by default and only hydrates the specific components that need interactivity (the scene-generator hero) — which is close to the ideal architecture for "mostly static content site with one genuinely interactive moment." Markdown/MDX support means the case-study content can live once, in the docs vault, and be pulled into the site rather than duplicated and drifted out of sync. Also directly demonstrates the same judgment call the master brief keeps asking for: choosing the tool that fits the actual shape of the problem instead of defaulting to the most familiar framework.

**Trade-off:** Astro is less familiar than React/Next to someone whose coursework and job-market expectations skew toward React — worth naming directly to Austin, and worth him being able to speak to *why* in an interview (it's a genuine, defensible performance/SEO decision, not an unexplained choice).

## The hero embed

The scene generator's `rng.ts` / `palettes.ts` / `scene.ts` modules are already framework-agnostic — plain TypeScript operating on a `CanvasRenderingContext2D`. They get imported directly into an Astro island component for the homepage hero, not rebuilt. This is the one place client-side JS ships on the homepage, and it's the one place that's supposed to move.

## Planned top-level structure

```
/site
  src/
    pages/           one file per route in the Site-Map
    components/       shared nav, footer, case-study layout
    content/          case-study Markdown (sourced from /docs/Product/Case-Studies)
    islands/          the scene-generator hero component
  astro.config.mjs
```

Not built yet — this is the plan the Development phase will follow.
