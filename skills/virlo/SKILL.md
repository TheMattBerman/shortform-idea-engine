---
name: virlo
description: "Keyword-based short-form creator and outlier discovery across competitor rings using the Virlo API. Use when you need to find who is winning in a niche by keyword, surface outlier videos across direct/indirect/adjacent rings, or identify repeatable formats before a decode pass. Triggers on: discover creators by keyword, find outliers in niche, ring analysis, virlo orbit, who is winning in [niche]."
---

# Virlo

Turn a keyword or niche into ranked outlier short-form videos across competitor rings.

## When to use

Use this skill to discover outlier short-form videos by keyword across competitor rings. The valid rings are direct, indirect, adjacent, and distant. The caller (typically the `shortform-idea-engine` orchestrator) decides which rings to run: the orchestrator runs direct, indirect, and adjacent by default. Distant is a valid but lower-signal ring that the caller may include explicitly; this skill does not run it automatically.

When run standalone, you may pass any combination of rings. This skill does not impose a fixed ring set.

It is called by the `shortform-idea-engine` orchestrator as the discovery step that feeds the decode and ideation pipeline. It can also be run standalone when the job is pure discovery without a downstream idea-generation pass.

Do not use this skill when you already know the creator handles and want post-level data (use the `scrape` skill instead). Virlo's value is in finding who is winning a niche when you do not know the handles yet.

## Procedure

### 1. Confirm API key

Resolve `$VIRLO_API_KEY` from the environment. If not set, stop and ask. Do not proceed without it.

### 2. Define ring queries

For each competitor ring the orchestrator specifies (direct, indirect, adjacent, distant), prepare a separate orbit submission with:
- A `name` that includes the ring label (e.g. `"direct ring -- [niche]"`).
- A `keywords` array (1-10 terms) scoped to that ring's positioning relative to the brand.
- `time_period`: use `this_month` by default unless the orchestrator specifies otherwise.
- `run_analysis: true` on every submission.
- `min_views`: use 5000 unless the niche is small; then lower to 1000.

### 3. Comet-first, Orbit for gaps

Before submitting any Orbit, list existing Comets (free: `GET /v1/comet`) and check whether a Comet already covers each ring keyword. A Comet "matches" a ring when its keywords substantially overlap the ring keyword or the niche label appears in the Comet name.

For each ring:
- **Matching Comet found:** retrieve its accumulated outliers (`GET /v1/comet/:id/creators/outliers`) and videos (`GET /v1/comet/:id/videos`). Both calls are free. Use those results for the ring. Tag the source as `comet:[id]` in the output. Skip the Orbit submission for that ring.
- **No matching Comet:** submit a fresh Orbit for that ring (cost: $0.50). Follow the sequential submission rule below.

Reading a Comet's accumulated data is preferred over firing a new Orbit: it costs nothing and the data is often richer because it compounds across multiple execution cycles. Only spend credits when no Comet covers the ring.

See `references/virlo-endpoints.md` for the exact Comet list and retrieval calls, and for the Orbit POST body.

### 4. Submit Orbit queries sequentially (gaps only)

Orbit submissions are capped at 2 concurrent jobs. Submit ring queries **one at a time**: submit the first, poll until `completed`, then submit the next. Never fire all rings simultaneously. This step only runs for rings that had no matching Comet.

See `references/virlo-endpoints.md` for the exact POST body, poll call, and retrieval calls.

### 5. Retrieve outliers and videos per ring

For rings served by a Comet, use the Comet retrieval endpoints (both free):

- `GET /v1/comet/:comet_id/creators/outliers?order_by=outlier_ratio&sort=desc&limit=20`
- `GET /v1/comet/:comet_id/videos?order_by=views&sort=desc&limit=20`

For rings served by a fresh Orbit, use the Orbit retrieval endpoints (both free):

- `GET /v1/orbit/:orbit_id/creators/outliers?order_by=outlier_ratio&sort=desc&limit=20`
- `GET /v1/orbit/:orbit_id/videos?order_by=views&sort=desc&limit=20`

Tag each result with its ring label and source type (`comet:[id]` or `orbit:[id]`) before moving to the next ring.

### 6. Apply judgment

Apply the reading rules in `references/reading-virlo.md` before surfacing any result:

- Apply the outlier threshold (default 3.0). Drop creators below it.
- Check for ephemeral spike signatures. Flag or drop them.
- Check stop conditions. If any are triggered, halt and report the stop condition instead of proceeding.

### 7. Emit ranked outlier list

Output a flat ranked list of outlier videos (not just creators) sorted by outlier ratio, with each entry tagged by ring, creator handle, platform, video URL, view count, and outlier ratio. This is the artifact the orchestrator consumes for the decode pass.

## Reading the results

See `references/reading-virlo.md` for judgment rules: what outlier magnitude means, which signals lie, how to distinguish ephemeral spikes from repeatable patterns, ring-by-ring reading priorities, and stop conditions.

## Reference

- `references/virlo-endpoints.md`: auth, Comet list and retrieval paths, Orbit submit/poll/retrieve paths, exact params, error codes, and all known gotchas.
- `references/reading-virlo.md`: operator judgment for interpreting Virlo output correctly.
