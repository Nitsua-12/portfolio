---
title: Development Journal
tags: [ai-workflow, journal]
updated: 2026-08-03
---

# Development Journal

## 2026-08-03 — Discovery, project scoping, and flagship project #1

**Discovery.** Started from a large master brief written for an experienced-engineer portfolio. Rather than executing it literally, ran a real Discovery interview — visual direction, background, faith, career goals, design preferences — across several rounds, because the brief itself demanded it ("interview me thoroughly... do not assume my visual preferences") and because several early answers were genuinely ambiguous or self-contradicting on first pass (e.g., "spent good money on it" + "90s retro neon" + "forest green" needed reconciling, not averaging).

Key realization mid-interview: Austin's actual situation (Shift Lead at Jersey Mike's, studying web dev) doesn't match the master brief's senior-engineer audience assumption. Flagged this directly rather than silently building the wrong thing — recalibrated to an honest early-career narrative. See [[Decision-Log]].

**The herbert-west-landscaping detour.** Austin pointed to two folders as "his VS Code projects." Investigation showed they were bundled demo content inside an installed open-source design-skill repo, not his work. Rather than quietly using them anyway, said so directly — this is exactly the kind of thing that would embarrass someone in a technical interview if they couldn't explain code they didn't write. This confirmed Austin had no existing portfolio-ready projects, which reframed the whole plan: two flagship projects would need to be built for real, as part of this engagement.

**Choosing flagship project #1.** Proposed a full-stack shift-swap app (tied to Austin's real shift-lead experience) and a visual/creative front-end piece. Austin wanted to start with the visual piece. Offered three concrete directions — a procedural scene generator, an audio-reactive visualizer, and a synthwave night-drive mini-game — with a recommendation against the audio visualizer (too technically risky this early) toward the mini-game. Austin picked the scene generator instead, which was also a completely reasonable call — it's the most literal expression of the specific imagery he'd described unprompted.

**Node.js blocker.** Scaffolding needed Node; it wasn't installed. Austin installed it, but it turned out to be a portable zip distribution extracted directly onto the root of his F:\ drive (`F:\node.exe`, `F:\node_modules`, etc.) rather than a standard installer location — functional, since F:\ was already on the machine PATH from some earlier setup, but the current shell sessions had started before that PATH entry existed, so `node`/`npm` weren't resolving until PATH was manually refreshed from the registry per command. Flagged the clutter to Austin but didn't reorganize his drive unprompted — not asked for.

**Building it.** Scaffolded with `npm create vite@latest -- --template vanilla-ts`, then wrote real modules: a seeded PRNG (`rng.ts`), three curated palettes with a color-lerp helper (`palettes.ts`), and all the canvas drawing logic (`scene.ts`) — sky gradient, retro scanline sun, perspective grid, mountain/gas-station silhouettes, car silhouette, twinkling stars — kept deliberately separate from parameter state (`main.ts`) so palette/time-of-day changes don't require re-rolling the composition. See [[Decision-Log]] for the reasoning behind that split.

**Verifying it actually works.** Type-checked clean (`tsc --noEmit`). Ran the dev server and drove it with Playwright against the system Chrome install (no `chromium-cli` available in this environment) — screenshots of the initial load, a randomized layout, the day/night slider, and a palette swap, plus a console-error check. Zero console errors, and the output matched Austin's original description closely enough that no visual rework was needed. Austin reviewed and approved.

**Next.** Document this project as a proper case study, then move to flagship project #2 — the full-stack shift-swap app.

## 2026-08-03 (continued) — Building the shift-swap app, and everything that broke along the way

Austin deferred both the case-study reflection questions and the backend framework choice ("do what you think best" / "whatever you think is best") — a pattern worth naming: he's early-career and often won't have a strong opinion on implementation-level choices yet, which is fine, but it means the responsibility to actually explain reasoning (not just decide silently) matters more, not less. Confirmed his coursework is in Python, which settled FastAPI as the backend framework. See [[Decision-Log]] for the full reasoning.

**The build itself went smoothly** — models, JWT auth, the shift/swap-request data model, all four routers. The debugging after that was the real story:

1. `sqlmodel==0.0.22` (a version I pinned from memory) turned out to be incompatible with the Pydantic version it pulled in — `PydanticUserError: Field 'id' requires a type annotation` on the very first model class. Fixed by bumping to the latest SQLModel (0.0.39).
2. `EmailStr` needs the separate `email-validator` package, which isn't a `pydantic` core dependency — missed it in the initial `requirements.txt`, caught immediately when the server failed to boot.
3. Port 8000 turned out to already be occupied by an **n8n** instance running on this machine — and n8n happens to also expose a `/health` endpoint, so an early `curl` check returned a plausible-looking JSON response that was actually from the wrong service entirely, not from my server (which had actually crashed on the `email-validator` import error). Worth remembering: a 200 response on the *expected* path isn't proof it's *your* server — check the body, not just the status code.
4. Once on a real port, CORS rejected the frontend outright, because the frontend hadn't landed on 5173 either — the scene generator's dev server was still running from earlier in the session and had claimed it. Fixed with an origin regex instead of a hardcoded port (see [[Decision-Log]]).
5. Restarting the backend to pick up that CORS fix turned into its own small saga — `uvicorn --reload`'s reloader process outlived a `Stop-Process` by port ownership (the port showed a listener whose PID no longer existed — a stale OS-level TCP table entry), and a second restart attempt collided with it. Resolved by abandoning port 8010 entirely and moving to 8011 rather than fighting Windows' TCP state.

None of these were design mistakes — they were the ordinary friction of standing up a real full-stack app on a real, already-occupied machine, and they're exactly the kind of thing "AI wrote it and it just worked" narratives skip over. Verified end-to-end with Playwright after all of that: register/login, request a swap as one user, claim it as another, approve it as the manager, and confirm the approvals list correctly empties out afterward. Zero console errors, and the enriched swap-board data (see [[Decision-Log]] on `SwapRequestDetail`) reads as actual names and times, not raw IDs.

**Next.** Write this project's case study, then start the whole-portfolio PRD now that both flagship projects have working v1s.

## 2026-08-04 — Building the actual portfolio site

Planning (PRD, site map, technical architecture) and the design system went smoothly and got approved without much back-and-forth — Austin's pattern throughout this project has been to defer implementation-level choices ("whatever you think is best") while still catching things when they matter to him directly (he read the draft faith statement himself rather than deferring on that one).

Scaffolded Astro with React and Tailwind, copied the scene-generator's `rng`/`palettes`/`scene` modules in as-is for two islands: an ambient, control-free version for the homepage hero, and the full interactive version (with palette/time-of-day/randomize/save controls) embedded live on its own project page. Wrote all seven pages — Home, Projects index, both case-study pages, About, AI Workflow, Contact.

Two real bugs surfaced in the production build, not just the dev server:

1. **A CSS `@import` ordering violation.** The Google Fonts `@import` was placed after `@import "tailwindcss"` — which expands into real CSS rules at build time, meaning by the time the browser sees the stylesheet, the fonts import comes after non-import rules, which the CSS spec disallows (browsers silently drop it). `astro build` surfaced this as a warning; the dev server never showed it. Fixed by ordering all `@import`s — real ones and the Tailwind directive — before anything else.
2. **Astro's whitespace handling collapsed spaces across line breaks in two places** — a sentence reading "AI Workflow pageshows..." with the space silently eaten, and a similar case around an inline `<code>` element. Both were adjacent-tag-across-a-newline patterns; fixed with explicit `{" "}` expressions. Caught by actually reading the rendered screenshots, not by any type-check — a reminder that "it compiles" and "it reads correctly" are different questions, and the second one requires actually looking.

Verified with Playwright across all seven routes both before and after the fixes: zero console errors, and a full production build completes clean.

**Next.** Ask Austin for a real contact email (Contact page currently only has LinkedIn), and get his personalization pass on both case studies' reflective sections before considering this "done" rather than "built."
