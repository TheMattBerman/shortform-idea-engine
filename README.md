# Short-Form Idea Engine

A Claude Code plugin that turns competitor short-form videos into ranked, brand-fit video ideas and production-ready scripts.

Point it at a niche keyword or a list of competitor handles. It discovers which videos are outperforming their creator's baseline, decodes why they work (visual hook, written hook, spoken hook, Viral Vector, Interest Topic, Format), remixes the underlying mechanisms to fit your brand, ranks the resulting ideas by viral potential and brand fit, pauses for your approval, then scripts the picks you green-light.

---

## What it does

The orchestrator runs a ten-step pipeline (Stage 0 through Stage 8, plus an explicit user approval gate between ranking and scripting):

1. **Stage 0 - Intake:** confirms mode (keyword or handles), loads your brand profile, checks API keys, and reports which modes are available before spending any credits.
2. **Stage 1 - Discovery:** finds outlier videos either by niche keyword across direct, indirect, and adjacent competitor rings (Virlo) or by analyzing specific competitor handles (ScrapeCreators). In keyword mode, Virlo reuses an existing matching Comet (free) when one is available and fires a fresh Orbit (which costs credits) only for rings with no Comet coverage.
3. **Stage 2 - Receipts:** collects transcripts and cover frames for every outlier.
4. **Stage 3 - Decode:** runs each outlier through the video-decoder skill to extract its visual hook, written hook, spoken hook, Viral Vector, Interest Topic, and Format.
5. **Stage 4 - Deep pass:** for the top 5 to 8 outliers by magnitude, runs a Gemini visual analysis of pacing, cut rhythm, and retention devices (requires OpenRouter key).
6. **Stage 5 - Ideate:** generates 10 to 15 remixed ideas anchored to your brand profile's pillars, audience, and credibility.
7. **Stage 6 - Rank:** scores every idea on viral potential and brand fit, removes any that hit your anti-topics list, and writes the ranked table.
8. **GATE:** presents the ranked table and waits for your explicit approval. Nothing is scripted until you select which ideas to proceed with.
9. **Stage 7 - Script:** writes one production-ready script per approved idea (three-hook block with visual, written, and spoken hooks; beat-by-beat body with retention marks; CTA; shotlist; source lineage block tracing each borrowed element back to the original outlier video).
10. **Stage 8 - Log:** verifies run-folder completeness, confirms every factual claim traces to a raw API response file, and outputs a run summary (outliers found, decodes shallow vs. deep, ideas generated, scripts produced).

---

## Bundled Skills

| Skill | Role |
|---|---|
| `shortform-idea-engine` | Orchestrator: runs the full discovery-to-script pipeline described above. |
| `video-decoder` | Decodes one short-form video into a filled Decode Record (visual hook, written hook, spoken hook, root, Viral Vector, Interest Topic, Format). |
| `script-writer` | Writes one production-ready short-form script from an approved idea and brand profile. |
| `virlo` | Keyword-based outlier discovery across competitor rings using the Virlo API. Reuses existing Comets (free) when available and fires a fresh Orbit ($0.50) only when no matching Comet exists. |
| `scrape` | Pulls posts, transcripts, cover frames, and ad creatives from TikTok, Instagram, and YouTube via the ScrapeCreators API. |
| `brand-profiler` | Builds or extracts a brand profile conforming to the kit schema, either through a guided interview or from an existing brand document. |

---

## Installation

This kit is a Claude Code plugin. To run it locally:

```bash
claude --plugin-dir ~/Documents/Github/shortform-idea-engine
```

Skills are namespaced under the plugin name when invoked. The orchestrator is:

```
/shortform-idea-engine:shortform-idea-engine
```

---

## Quick Start

1. Complete the API key setup described in `docs/setup.md`.
2. Create a `.env` file in your working directory with your keys.
3. Optionally prepare a brand profile using the `brand-profiler` skill (the orchestrator will offer to build one at startup if none exists).
4. Start a run:

```
/shortform-idea-engine:shortform-idea-engine
```

The orchestrator will ask: which mode (keyword or handles), your brand profile path, a short run slug, and where to write the run folder. It checks your keys and reports available modes before spending anything.

After discovery and decoding, it presents a ranked idea table and waits for you to select which ideas to script. Once you approve, it writes one script per pick to the run folder.

A typical run produces:
- `00-intake.md`: mode, inputs, keys available, any overrides.
- `01-decodes/`: one Decode Record per outlier video.
- `02-ideas.md`: ranked idea table with viral potential, brand fit, combined scores, and source-video lineage.
- `03-scripts/`: one script per approved idea.
- `raw/`: all raw API responses for traceability.

---

## Setup

See [docs/setup.md](docs/setup.md) for the three API keys, where to get them, what they cost, and how the engine degrades gracefully when one is missing.
