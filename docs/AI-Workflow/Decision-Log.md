---
title: Decision Log
tags: [ai-workflow, decisions]
updated: 2026-08-03
---

# Decision Log

Every non-obvious decision, in the order made. Each entry: what was decided, what else was considered, why, and the trade-off accepted.

## 2026-08-03 — Recalibrate audience framing to honest early-career positioning

**Decision:** Build the site around an honest early-career narrative (strong fundamentals + AI fluency + leadership experience), not a senior-engineer narrative.

**Alternatives considered:** Follow the original master brief's framing literally, which assumed an experienced engineer trying to impress CTOs.

**Why:** Austin is a Shift Lead at Jersey Mike's studying web development — not yet a professional engineer. A senior framing would get caught out in the first technical conversation with a hiring manager (see [[../Product/User-Personas|User Personas]]).

**Trade-off:** Less "impressive on paper" than the original brief's ambition, but defensible and true, which matters more for actually getting hired.

## 2026-08-03 — Faith stated explicitly on the site

**Decision:** Austin's Christian faith appears directly on the site, not just implied through values-language.

**Alternatives considered:** Implicit-only (values like integrity/service without naming the source), or omitted entirely.

**Why:** Austin's own direct choice when asked — not a default I picked. When asked what he wants people to remember about him, his unprompted answers were "my love for God" and "that man has good character and it comes from God."

**Trade-off:** Some hiring managers may react to explicit religious content either positively or negatively; Austin chose authenticity over optimizing for the widest possible audience reaction. Exact placement/prominence still open — see [[Development-Journal]].

## 2026-08-03 — Full synthwave palette over blending in forest green

**Decision:** Commit fully to the pink/blue/purple retro-neon-sunset palette Austin described. Forest green (his stated personal color) is not blended in.

**Alternatives considered:** Forest green as a signature accent inside the neon palette; mocking up both before deciding.

**Why:** Austin chose the simpler, more cohesive option directly when given the choice. One vivid, fully-committed reference beats a diluted blend of two unrelated color meanings.

**Trade-off:** Loses a personally-meaningful color signal, but gains visual cohesion — a portfolio that looks decisive rather than compromised.

## 2026-08-03 — herbert-west-landscaping is not Austin's project

**Decision:** Do not use `F:\ui-ux-pro-max-skill-main\herbert-west-landscaping` (or `-no-bs`) as portfolio content, and do not treat it as evidence of Austin's existing work.

**Why:** Investigation showed both folders sit at the top level of the open-source `ui-ux-pro-max-skill-main` repository itself, alongside its own README/LICENSE — bundled demo content (a Lovecraft-themed joke site) shipped with a design-skill tool Austin has installed, not code he wrote. He'd mistaken it for his own work since he'd had the folder open in VS Code.

**Consequence:** Confirmed Austin has no existing personal projects ready to show, which is what drove the decision below.

## 2026-08-03 — Build two real flagship projects instead of using existing work

**Decision:** Build a full-stack shift-swap/scheduling app and a visual/front-end synthwave scene generator, from scratch, as part of this engagement — documented as genuine AI-orchestration case studies.

**Alternatives considered:** Portfolio-ify old school assignments (rejected — Austin doesn't have any ready); generic CRUD-app clichés like a todo list or recipe site (rejected — Austin explicitly didn't want these, and they say nothing specific about him).

**Why:** The shift-swap app idea ties to Austin's real domain expertise as a shift lead — "I built this because I live the problem" is a stronger interview story than a hypothetical persona guess. The scene generator plays to his stated preference for "something visual/front-end" and his unprompted synthwave imagery.

**Trade-off:** Meaningfully more work than assembling an existing portfolio would have been — accepted because Austin has no hard deadline and a few hours/week to invest.

## 2026-08-03 — Synthwave scene generator: Vite + TypeScript + Canvas 2D, no framework

**Decision:** Plain Canvas 2D API, TypeScript, Vite as the dev/build tool. No React/Vue/etc.

**Alternatives considered:** A UI framework (rejected — this is a single interactive canvas with no routing or complex shared state, so a framework is dead weight); WebGL/Three.js (rejected for v1 — more power than a 2D procedural scene needs, adds real complexity for no visual gain at this scope).

**Why:** TypeScript over plain JS because typed code catches real mistakes while Austin is still learning, and it signals more engineering maturity. Vite because it's a genuinely useful, transferable skill (hot reload, real build step) he'll use on nearly every front-end project going forward, including the full-stack app.

## 2026-08-03 — Seeded PRNG with layout/render separation

**Decision:** Scene composition (mountain shape, star field, gas-station-vs-mountains choice, car position) is generated once per seed via a deterministic `mulberry32` PRNG and cached as a `SceneLayout`. Palette and time-of-day changes re-render every frame without touching the layout.

**Alternatives considered:** Regenerating the whole scene on every parameter change (rejected — would make the palette/time-of-day controls feel laggy and would make "Randomize" and "change color" the same action, which they conceptually aren't).

**Why:** Keeps parameter changes (palette swap, time-of-day slider) cheap and instant, while "Randomize" is the only thing that reseeds composition. Also makes a given scene reproducible from its seed, which is why the PNG export filename embeds the seed.

## 2026-08-03 — Shift-swap app: FastAPI + SQLModel + SQLite, React + TS + Tailwind

**Decision:** Backend is FastAPI with SQLModel over SQLite; frontend is React + TypeScript via Vite, styled with Tailwind CSS v4.

**Alternatives considered:** Django (rejected — its admin/template-first defaults push toward server-rendered pages rather than the clean separate frontend Austin wanted, and it's more "batteries" than this scope needs); Postgres from day one (rejected for now — SQLite needs zero setup for anyone, including Austin, to clone and run; SQLModel makes swapping to Postgres later nearly free if this ever needs to serve real users); no framework on the frontend (rejected here, unlike the scene generator — a schedule/swap-request UI has real shared state and multiple views, which is exactly what a component framework is for).

**Why:** Austin's coursework is in Python, so FastAPI lets that existing strength do the harder half of the work (data modeling, auth, business logic) while pairing naturally with a typed frontend. Also diversifies what the portfolio demonstrates — Python backend competency alongside the TypeScript-only scene generator.

## 2026-08-03 — Denormalized `SwapRequestDetail` response for the swap board

**Decision:** Added a second response schema, joined server-side (via SQLAlchemy `aliased()` on `User` for the requester/claimer, plus an outer join since `claimed_by` is nullable), so the frontend gets names and shift date/time directly instead of raw foreign-key IDs.

**Why:** The first pass returned bare `requested_by_id`/`claimed_by_id` integers — technically correct, but the swap board would have shown "Requested by user #2," which is a real usability failure, not just cosmetic. Worth the extra join complexity.

**Trade-off:** Two response shapes for the same underlying model (`SwapRequestRead` for the plain mutation endpoints, `SwapRequestDetail` for the list views) instead of one — accepted because collapsing them into a single always-enriched shape would mean every claim/approve/deny response pays for a join it doesn't need.

## 2026-08-03 — CORS: origin regex instead of a fixed allow-list

**Decision:** Backend CORS uses `allow_origin_regex=r"http://localhost:\d+"` instead of a fixed `allow_origins=["http://localhost:5173"]`.

**Why:** Discovered the hard way — this machine already had the scene-generator dev server holding port 5173, so Vite silently moved the shift-swap frontend to 5174, and the hardcoded CORS allow-list rejected it (`Disallowed CORS origin` on the preflight). A regex matching any localhost port fixes this for local dev; a real deployment would go back to an explicit origin list for the actual production domain, which is a v2/deployment-time change.

**Trade-off:** A regex allow-list is intentionally looser than a fixed one — acceptable for local dev only, and flagged here so it isn't accidentally carried into a production deploy.

## 2026-08-03 — Portfolio site itself: Astro, not Next.js/React

**Decision:** The portfolio site (not the flagship projects) is built in Astro, Markdown-driven, with a single React/vanilla-TS island for the scene-generator hero.

**Alternatives considered:** Next.js/React for the whole site (rejected — most of the site is static prose; shipping a full app-framework runtime for that is unnecessary weight against the master brief's own performance/SEO requirements); plain static HTML (rejected — loses Markdown-driven content reuse from the docs vault's case studies).

**Why:** Full reasoning in [[../Architecture/Technical-Architecture|Technical Architecture]]. Short version: Astro's zero-JS-by-default model matches the actual shape of this problem (mostly static content, one genuinely interactive hero) better than a general-purpose app framework would.

**Trade-off:** Less familiar than React/Next given Austin's coursework and typical entry-level job listings skew React — flagged directly so he can speak to the "why" if asked about it, rather than it reading as an unexplained or default choice.

## 2026-08-05 — Hero polish: drop the car, animate the grid, add particles

**Decision:** The homepage hero no longer draws the car silhouette (the interactive generator on its own project page still does); the ground grid now continuously animates toward the viewer instead of sitting static; drifting glow particles were added across the whole scene.

**Why:** Direct feedback from Austin, delivered as annotated screenshots in his Obsidian vault rather than a text description — he circled the car and said "remove this," and separately said the site "just seems bland" and wanted the animation to "have particles and seem like its flowing." Annotated screenshots turned out to be a very precise way to give this kind of feedback — no ambiguity about which car, which frame, or what "bland" meant once the second screenshot showed exactly where.

**Implementation note:** `drawScene` gained an optional `showCar` flag (default `true`) rather than duplicating the whole draw function — the homepage hero and the interactive generator page share the same engine and should only differ in this one deliberate way. The grid "flow" is done by animating the fractional position fed into the existing perspective-easing math (`t = (i/hLines + flowOffset) % 1`) rather than adding a second animation system.

**Trade-off:** None really — this was a case where "spice it up" and the existing animation-restraint principle (see [[../Design/Design-System|Design System]]) weren't in tension, since it's all still confined to the one hero animation, just a richer version of it.

## 2026-08-05 — Drop the mountain silhouette entirely; slow the grid flow and particles

**Decision:** Removed the "mountains" scene variant completely (type, generation, and draw function) — every scene now always renders the gas-station structure. Also slowed the grid's flow cycle (4.2s → 9s per loop) and the particles' rise/drift speed (roughly halved).

**Alternatives considered:** Keep the mountain shape but give it a gradient/glow treatment instead of flat silhouette color, so it blends with the grid rather than reading as a harsh black cutout. Austin chose outright removal instead when given the choice — simpler, and the gas-station structure (his own original inspiration image) is the stronger visual anyway.

**Why:** Direct feedback — "get rid of the black mountain," plus "I like the motion but slow it down" for the previous round's grid-flow/particle additions. The mountain was flagged specifically as a flat, harsh black shape sitting above the cyan grid; removing it (rather than just recoloring) also deletes real code (`drawMountains`, the `sceneType` branch) instead of leaving an unused path around.

**Trade-off:** Slightly less variety on "Randomize" now — every seed produces the same structural silhouette, varying only in stars, particles, and car position. Accepted since Austin explicitly chose this over a treatment-only fix.

## 2026-08-05 — Site-wide visual polish: ambient glow, grain, scroll-reveal, hover glow

**Decision:** Extended the synthwave identity past the hero into every page — two large slow-drifting blurred glow blobs fixed behind all content, a very subtle film-grain texture overlay, scroll-triggered fade/rise reveals on headings and cards (via one shared `IntersectionObserver` in `Layout.astro`), gradient-text page headings, and hover-glow on card-style links. A glass/blur treatment was also added to the nav bar.

**Why:** Direct request — "make this site majestic... as if one can't take their eyes off." The real gap wasn't the hero (already strong); it was that every page *after* the hero was flat and generic, so the site's energy dropped off a cliff past the homepage.

**Implementation note:** Caught and fixed a real CSS bug while building this — `.reveal` and `.glow-card` both set the `transition` shorthand, and when an element has both classes, the cascade doesn't merge the two property lists; whichever rule is later in the stylesheet wins outright for all sub-properties. Fixed by making `.reveal`'s transition list comprehensive enough to cover both concerns rather than assuming they'd compose. Also added a separate `.glow-frame` (static glow, no hover-lift) distinct from `.glow-card` (lift + glow) — the interactive scene-generator embed needed the former, since a hover-lift on a container people are actively clicking controls inside of would just look like a bug.

**Trade-off:** More CSS surface area and one more moving part (the reveal observer) — justified because it's genuinely shared/reusable across every page, not per-page bespoke animation code.

## 2026-08-05 — Drop the gas-station structure from the homepage hero too

**Decision:** Added a second `DrawOptions` flag, `showStructure`, alongside `showCar`. The homepage hero now renders neither the car nor the gas-station canopy/sign/kiosk — just sky, sun, grid, stars, particles. The project page's interactive generator still shows the full structure.

**Why:** Same root cause as the mountain removal, one round later — Austin flagged the gas-station canopy/sign as "weird black boxes" via another annotated screenshot. Once hero text overlaps those flat rectangular silhouettes, they don't read as a gas station at all, just stray black bars. The structure is the generator's actual point on its own project page (full context, no overlapping text, described explicitly in the case-study copy), so it stays there — this is scoped to the hero specifically, following the same reasoning as the car.

**Trade-off:** None — this was purely additive (one more boolean flag on an option object that already existed for exactly this purpose).
