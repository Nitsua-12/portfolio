---
title: "Case Study — Synthwave Scene Generator"
tags: [case-study, project, draft]
updated: 2026-08-03
status: draft — needs Austin's personalization before it goes on the live site
---

# Synthwave Scene Generator

*Flagship project #1. Source: `/projects/synthwave-scene-generator`. Screenshots: `/projects/synthwave-scene-generator/showcase/`.*

> **Draft notice:** The sections marked *(draft — personalize)* below are written from what I observed in our session together, not from Austin's own words. He should rewrite them in his own voice before this goes on the live site — a case study has to hold up if a hiring manager asks him to elaborate on it in person.

## The idea

During Discovery, I asked Austin what he loved visually, without prompting a specific style. Unprompted, he described: *"Retro neon gas station art set at sundown... vibrant pink and blue glows, moody twilight skies, vintage car silhouettes."* That's an oddly specific, vivid image for someone to produce off the cuff — specific enough that it deserved to become something real rather than just inform a color palette.

So instead of a generic "practice project," this became: build a tool that generates that exact scene, procedurally, so it's never the same image twice.

## What it does

A browser-based generator that draws a synthwave sunset scene on an HTML canvas — gradient sky, a glowing retro sun with the classic horizontal scanline cutout, a perspective grid floor, a silhouette (either mountains or a small gas-station structure, chosen at random), a vintage car silhouette, and twinkling stars. Three curated color palettes. A time-of-day slider blends the whole scene from dusk to night live. A "Randomize" button reshuffles the composition. A "Save as PNG" button exports it.

Try it: `npm run dev` in the project folder, or see the screenshots in `showcase/`.

## Technical approach

- **Vite + TypeScript, no framework.** This is one interactive canvas with no routing or shared app state — a UI framework would have been pure overhead. TypeScript because typed code catches real mistakes early, which matters more, not less, early in a developer's career.
- **Seeded procedural generation.** A `mulberry32` PRNG means every scene is reproducible from its seed — the same seed always draws the same mountains, star positions, and silhouette choice.
- **Layout and rendering are deliberately separate.** The composition (mountain shape, star positions, which silhouette) is generated once per seed. Palette and time-of-day changes re-render every frame without touching that layout. That's what makes the slider feel instant instead of janky, and it's what makes "Randomize" a meaningfully different action from "change the color."
- **Curated, not infinite, color choice.** Three hand-picked palettes instead of a full color wheel — a deliberate constraint, because infinite choice is worse design than a few good choices.

Full reasoning and the alternatives considered for each of these are in the [[../../AI-Workflow/Decision-Log|Decision Log]].

## How this got built *(draft — personalize)*

Austin directed the project — choosing the concept over two alternatives (an audio-reactive visualizer and a night-drive mini-game), setting the scope, and reviewing/approving the result — while Claude wrote the implementation. That division isn't "AI did the work" — the concept, the taste calls (which palette, which silhouette style, what counts as "good enough" for v1), and the judgment about what to build next all came from Austin. The code is real, typed, and passes its own type-check; it was also verified running in an actual browser (via Playwright) before being called done, not just assumed to work.

*(Austin: rewrite this paragraph in your own words once you've sat with the project a bit — what did directing this actually feel like, where did you push back or redirect, what would you tell someone about your role in it?)*

## Challenges & what I'd improve *(draft — personalize)*

The trickiest part technically was getting the retro "scanline sun" effect and the perspective grid to read correctly — those are the two details that make or break whether this looks like *the* synthwave aesthetic or just "a dark gradient with a circle." Getting the layering order right (sky → stars → sun → silhouette → grid → car) mattered more than any individual shape.

For v2: audio reactivity (rejected for v1 as too big a technical jump — see [[../../AI-Workflow/Decision-Log|Decision Log]]), more palette options, maybe a way to save/share a specific seed as a URL.

*(Austin: what was actually hard for you to follow or learn while this was being built? What would you personally want to add next? Fill this in once you've spent more time with the code.)*
