---
title: "Case Study — Shift Swap"
tags: [case-study, project, draft]
updated: 2026-08-03
status: draft — needs Austin's personalization before it goes on the live site
---

# Shift Swap

*Flagship project #2. Source: `/projects/shift-swap` (`/backend`, `/frontend`). Screenshots: `/projects/shift-swap/showcase/`.*

> **Draft notice:** As with the [[Synthwave-Scene-Generator|scene generator case study]], the reflective sections below are placeholders written from observation, not Austin's own words — he should personalize them before this goes live.

## The idea

Austin is a Shift Lead at Jersey Mike's. Rather than build a generic CRUD demo (a todo list, a recipe app — the kind of project that says nothing specific about the person who built it), this app solves a problem he actually deals with: getting a shift covered when something comes up, and getting a manager's sign-off without it turning into a group text.

## What it does

Employees see their upcoming shifts and can flag one as available to swap. Other employees see open requests on a shared board and can claim one. A manager reviews claimed swaps and approves or denies them — only on approval does the shift actually change hands. Three roles of interaction (request → claim → approve/deny), one real workflow.

## Technical approach

- **FastAPI + SQLModel + SQLite (backend), React + TypeScript + Tailwind (frontend).** Full reasoning in the [[../../AI-Workflow/Decision-Log|Decision Log]] — short version: FastAPI lets Austin's existing Python strength do the harder half of the work, while SQLite means anyone (including Austin, months from now) can clone the repo and run it with zero setup.
- **JWT auth with two roles.** Employees and managers share the same login flow; role checks happen server-side (`require_manager` dependency), not just hidden in the UI — a manager-only endpoint actually rejects a non-manager token, it doesn't just hide a button.
- **A real state machine, not just a boolean.** Swap requests move through `open → claimed → approved` or `open → claimed → denied`, and the API enforces valid transitions (you can't claim your own swap, you can't approve something that hasn't been claimed yet).
- **A join, not just a raw ID dump.** The swap board and approvals list return actual names and shift times via a server-side join (`SwapRequestDetail`), not bare foreign-key integers the frontend would have to resolve itself.

## How this got built *(draft — personalize)*

Same division as the scene generator: Austin set the direction (the concept itself, deferring implementation-level choices like the backend framework once his coursework context was known), reviewed progress, and made the calls that mattered — Claude wrote and debugged the code. This project surfaced more real friction than the first one: version incompatibilities, a port collision with an unrelated service already running on the machine, and a CORS misconfiguration that only showed up because two projects' dev servers were running side by side. All of that is logged honestly in the [[../../AI-Workflow/Development-Journal|Development Journal]] rather than smoothed over — a portfolio that only shows things going right isn't believable.

*(Austin: once you've read through the code and the journal entry, what would you tell an interviewer about this build specifically — anything you'd have approached differently, anything that surprised you?)*

## Challenges & what I'd improve *(draft — personalize)*

The state machine (who can do what, in what order, enforced server-side rather than trusted to the frontend) was the part that mattered most to get right — a shift-swap app where the API would let anyone approve their own swap request isn't a real app, it's a demo that only works if nobody tries to break it.

For v2: shift creation/scheduling UI for managers (currently seeded via a script, not built in the app itself), email or push notifications when a swap is claimed or decided, and a real calendar view instead of a flat list.

*(Austin: what part of this was hardest for you to follow, and what would you personally prioritize next?)*
