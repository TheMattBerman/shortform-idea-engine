# Short-Form Idea Engine

A Claude Code plugin that turns competitor short-form videos into ranked, brand-fit video ideas and scripts.

You point it at a niche keyword or a list of competitor handles. It discovers which videos are outperforming their creator's baseline, decodes why they work, remixes the underlying mechanisms to fit your brand, ranks the resulting ideas, pauses for your approval, then scripts the picks you green-light.

---

## What it does

The orchestrator runs an eight-stage pipeline:

1. **Intake:** confirms mode (keyword or handles), loads your brand profile, checks API keys, and reports which modes are available before spending any credits.
2. **Discovery:** finds outlier videos either by niche keyword across direct, indirect, and adjacent competitor rings (Virlo) or by analyzing specific competitor handles (ScrapeCreators).
3. **Receipts:** collects transcripts and cover frames for every outlier.
4. **Decode:** runs each outlier through the video-decoder skill to extract its Viral Vector, Interest Topic, and Format.
5. **Deep pass:** for the top 5 to 8 outliers by magnitude, runs a Gemini visual analysis of pacing, cut rhythm, and retention devices (requires OpenRouter key).
6. **Ideate:** generates 10 to 15 remixed ideas anchored to your brand profile's pillars, audience, and credibility.
7. **Rank and gate:** scores every idea on viral potential and brand fit, removes any that hit your anti-topics list, presents the ranked table, and waits for your approval before scripting.
8. **Script:** writes one production-ready script per approved idea (hook pair, beat-by-beat body with retention marks, CTA, shotlist).

---

## Bundled Skills

| Skill | Role |
|---|---|
| `shortform-idea-engine` | Orchestrator: runs the full discovery-to-script pipeline described above. |
| `video-decoder` | Decodes one short-form video into a filled Decode Record (written hook, spoken hook, root, Viral Vector, Interest Topic, Format). |
| `script-writer` | Writes one production-ready short-form script from an approved idea and brand profile. |
| `virlo` | Keyword-based outlier discovery across competitor rings using the Virlo API. |
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
- `02-ideas.md`: ranked idea table with viral potential, brand fit, and combined scores.
- `03-scripts/`: one script per approved idea.
- `raw/`: all raw API responses for traceability.

---

## Setup

See [docs/setup.md](docs/setup.md) for the three API keys, where to get them, what they cost, and how the engine degrades gracefully when one is missing.
