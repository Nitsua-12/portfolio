---
title: Design System — Portfolio Site
tags: [design, design-system]
updated: 2026-08-04
---

# Design System — Portfolio Site

## Color

The site's brand palette is **Miami Nights** — one of the three curated palettes already built for the [[../../projects/synthwave-scene-generator|scene generator]] (`palettes.ts`: deep indigo → hot pink → warm gold sky, cyan grid, hot-pink glow). The generator itself stays user-selectable across all three palettes on its own project page; the site around it commits to one, because a portfolio needs one consistent identity, not three.

- **Base:** near-black (`#05010f`–`#0d0117` range, already defined as `silhouette`/sky-top in `palettes.ts`) for backgrounds — not pure black, which reads flatter and harsher.
- **Accent (use sparingly):** hot pink (`#ff2e88`) for primary actions/links, cyan (`#00e5ff`) as a secondary accent for hover states and technical/code-adjacent UI. Both are loud enough that overusing them reads as noisy, not premium — reserve them for the handful of moments that should actually draw the eye (CTA, active nav state, the hero itself).
- **Text:** off-white, never pure white, matching the softer palette already used in the shift-swap UI (`text-slate-100` / `text-slate-400` register) — full-contrast white-on-black is harsher than it needs to be for long-form reading.

## Typography

Three typefaces, each doing one job:

- **Headings — Space Grotesk.** Geometric, confident, has a technical edge without tipping into the cliché "sci-fi" display fonts (Orbitron and its relatives) that make synthwave sites look templated rather than crafted.
- **Body — Inter.** Highly legible at small sizes, the safe and correct choice for case-study prose that a busy hiring manager actually has to read. Personality lives in the layout and color, not in making body text harder to read.
- **Mono accent — JetBrains Mono.** Used for code snippets, tech-stack tags, timestamps on Decision Log/Dev Journal excerpts, and small UI labels. A quiet, credible "I write real code" signal that developers recognize without it being decorative.

Scale: a standard 1.25 ratio type scale, base 16px body / 18px on the case-study reading column. Headings max out around 56px on the homepage hero, stepping down through section (32px) and card-title (20px) sizes — nothing bigger than the hero needs to be, per the master brief's "every element should have purpose" principle.

## Layout

- **Reading column:** case-study and About prose caps at ~680px measure — the width where long-form text is actually comfortable to read, not full-bleed.
- **Hero:** full-bleed, edge-to-edge — the one place the layout should feel expansive, because it's carrying the live scene generator.
- **Spacing scale:** 4px base unit (4/8/12/16/24/32/48/64/96) — consistent vertical rhythm between sections rather than ad-hoc margins.
- **Grid:** single-column content flow for all text pages. No multi-column marketing-site layouts — matches the "progressive disclosure, don't dump everything on one page" principle from [[../Product/Site-Map|Site Map]].

## Component inventory

| Component | Purpose |
|---|---|
| `NavBar` | Persistent top nav, 5 items, active-page indicator in cyan |
| `Hero` (island) | Live scene-generator canvas + positioning line, homepage only |
| `ProjectCard` | Used on `/projects` index — project name, one-line summary, tech tags |
| `CaseStudyLayout` | Shared shell for both project pages — intro, technical approach, screenshots, challenges |
| `DecisionExcerpt` | Pull-quote-style block for surfacing real Decision Log entries on `/ai-workflow` |
| `TechTag` | Small mono-font pill for stack names (`FastAPI`, `TypeScript`, etc.) |
| `Footer` | Email, LinkedIn, GitHub links |
| `Button`/`Link` | Primary (pink fill) and secondary (outline) states, shared across CTAs |

## Animation philosophy

Austin's own bar, from Discovery: too much animation is "when everything on the page is animated." Applied here as a hard rule, not a suggestion:

- The **hero's living motion** (twinkling stars, pulsing grid glow — already built into the scene generator) is the site's one signature animation. It runs continuously because it's the whole point of that component.
- **Everything else animates once, on entrance, and stays still after.** Section fade-ins on scroll (subtle, ~200ms, no bounce/elastic easing), simple hover-state transitions on buttons/links (~150ms color/border transitions, nothing that moves layout). No parallax, no scroll-jacking, no looping decorative motion outside the hero.
- Respects `prefers-reduced-motion` — entrance animations and any non-essential motion disable cleanly; the hero's canvas animation is treated as content, not decoration, and stays (same logic as a video autoplay muted vs. a decorative background loop — see [[../Accessibility|Accessibility Strategy]], to be written during the Development phase).

## Mood reference

Rather than an invented mood board, the actual proof-of-concept already exists: `projects/synthwave-scene-generator/showcase/*.png`. Those screenshots — the pink/cyan Miami Nights palette against the gas-station structure, dusk through night — are the literal visual target for the site's brand identity, not a stylized approximation of it.
