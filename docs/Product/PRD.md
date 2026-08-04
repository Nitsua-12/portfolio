---
title: Product Requirements Document
tags: [product, prd]
updated: 2026-08-03
---

# Product Requirements Document

## Goals, in priority order

1. **Get Austin an entry-level web development job or internship interview.** Everything on the site is judged against this first.
2. **Generate freelance client interest** as a secondary path, without diluting the primary message (see [[User-Personas]]).
3. **Prove the AI-orchestration philosophy through the site's own existence** — the process, the documentation, and the fact that both showcased projects were built transparently with AI direction *are* the pitch, not just a claim made in an About paragraph.

## Success looks like

This is a portfolio, not a SaaS product — metrics are softer, but still real:

- A hiring manager reads one case study fully instead of bouncing after the hero (the [[User-Personas|primary persona]]'s stated bar: a specific origin story + real decisions, not a screenshot and a tech-stack list).
- The site is fast and clean enough that nothing about the *engineering* undercuts the pitch — strong Lighthouse scores, no layout shift, works on a phone one-handed.
- If someone reaches out because of the site, they reference something specific from it (a project detail, the process, the AI-workflow story) — evidence the content actually landed, not just that a link got clicked.

## Feature list — v1

**Home**
- Hero built around the [[../../projects/synthwave-scene-generator|synthwave scene generator]] itself as a live, animated background/centerpiece — not a static hero image, not "Hi, I'm Austin." The generator already exists and is exactly the kind of "wow, they built that" moment the master brief asks for. One confident, specific line of positioning copy over it — what Austin actually does and how, not a generic aspiring-developer tagline.
- Brief, scannable entry points into the two case studies and the AI-workflow story.

**Projects**
- Two case-study pages, sourced from `docs/Product/Case-Studies/` (once Austin's personalization pass is done) — [[Case-Studies/Synthwave-Scene-Generator|Synthwave Scene Generator]] and [[Case-Studies/Shift-Swap-App|Shift Swap]]. Each includes the real screenshots, the technical narrative, and an honest "how this got built" section.
- Live links/embeds where practical — the scene generator can run live in-page; Shift Swap is a full-stack app with a real database, so it links to a demo video or a hosted instance rather than embedding directly (deployment approach TBD in the Deployment doc, not needed for v1 planning).

**About**
- Background: shift lead experience, studying web development, how he got into it (his own words from Discovery, not paraphrased into something generic).
- AI philosophy, in his own voice — orchestration, not replacement (matches [[../Vision/Project-Vision|Project Vision]]).
- Faith statement — see the draft below. Placed here, not on the homepage: present and unmissable to anyone who reads the About page, but not the very first thing a hiring manager sees before they've read anything else. Open for Austin to move if he wants it more prominent.
- What he's looking for in a team (communicates the "avoid teams that work me to death" value from Discovery without stating it that bluntly — framed positively as what he *does* want: clear communication, sustainable pace).

**AI Workflow**
- Dedicated page (per Austin's own answer to "how should the portfolio showcase your AI workflow" — combination of dedicated + integrated), pulling real excerpts from the [[../AI-Workflow/Decision-Log|Decision Log]] and [[../AI-Workflow/Development-Journal|Development Journal]] — not a generic "I use AI" statement, but actual logged decisions and actual bugs that got hit and fixed. This is the single most differentiating page on the site, since almost no other junior candidate's portfolio will have this.

**Contact**
- Direct email + LinkedIn. No contact-form backend needed for v1 — a `mailto:` link is honest and sufficient; adding a form is a v2 nicety, not a v1 requirement.

## Draft About-page faith statement, for Austin's reaction

Not final — a starting point built entirely from his own words in Discovery, for him to edit or replace:

> *My faith is the center of who I am, and it shapes how I show up at work — with patience, honesty, and the belief that how I treat people matters as much as what I build. If there's one thing I'd want you to know about me beyond the code, it's that.*

## Explicitly out of scope for v1

- Blog/writing section — not requested, would dilute focus.
- Contact form backend/CMS — `mailto:` is enough for now.
- Full deployment/hosting setup — separate decision, not a planning blocker.
