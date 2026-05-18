# Run Artifacts

Reference for the `shortform-idea-engine` skill. Use this document to create and populate the run folder for each session.

---

## Run folder structure

Each run lives in its own timestamped folder. Create the folder before writing any artifacts.

```
runs/YYYY-MM-DD-<slug>/
  00-intake.md     mode (keyword|handles), brand profile used, API keys available
  01-decodes/      one decode record per video (the VV/IT/Format pool)
  02-ideas.md      the ranked idea table (the gate artifact)
  03-scripts/      one script per approved top-N idea
  raw/             raw Virlo / ScrapeCreators / Gemini JSON, receipts for every claim
```

**Folder naming:** `YYYY-MM-DD` is the run date. `<slug>` is a short lowercase label for the session, e.g. `ai-tools-keyword` or `techcreator-handles`. Handles in slugs drop the `@`. Example: `runs/2026-05-18-ai-tools-keyword/`.

---

## File descriptions

**`00-intake.md`**

Written at the start of the run. Records the inputs that produced this run so it can be reproduced or audited. Include: mode (`keyword` or `handles`), the exact query or handle list, the brand profile filename used, which API keys were available (Virlo, ScrapeCreators, OpenRouter), and any flags or overrides set for the run.

**`01-decodes/`**

One Decode Record file per video, named by `video_id`. Each file follows the Decode Record schema from `decode-framework.md`. This folder is the VV/IT/Format pool the idea-generation step draws from.

**`02-ideas.md`**

The gate artifact. Contains the ranked idea table produced by the `shortform-idea-engine` orchestrator, formatted per `ranking-rubric.md`. This is the file the user reviews and approves before scripts are written.

**`03-scripts/`**

One script file per idea the user approves at the gate. Named by idea slug, e.g. `03-scripts/tool-graveyard-teardown.md`. Each script follows the output format defined in the `script-writer` skill.

**`raw/`**

Source receipts. Every API response, JSON payload, and external data file that backs a factual claim in any artifact goes here. Files are named by source and timestamp, e.g. `virlo-response-2026-05-18T14-32.json`.

---

## Traceability rule

Every factual claim in any artifact (view counts, outlier magnitudes, trend data, engagement rates) must trace to a file in `raw/`. If a claim cannot be traced to a `raw/` file, it must be flagged as unverified in the artifact where it appears.
