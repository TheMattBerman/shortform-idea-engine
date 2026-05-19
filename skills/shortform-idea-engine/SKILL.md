---
name: shortform-idea-engine
description: "End-to-end short-form video ideation. Discovers outlier short-form videos by niche keyword or competitor handles, decodes why they work, remixes them into brand-fit ideas, ranks ideas by viral potential and brand fit, and scripts the top picks. Use when the user wants short-form, Reels, TikTok, or Shorts content ideas, a video idea pipeline, or to turn competitor research into scripts. Triggers on: short-form ideas, video ideas, reels ideas, what should I post, find me content ideas, decode competitors."
---

# Short-Form Idea Engine

Research-to-script pipeline that turns competitor outlier videos into ranked, brand-fit short-form ideas and finished scripts.

## When to use

Use this skill when the user wants a short-form video idea pipeline: discover what is winning in a niche, understand why, generate remixed ideas, and receive scripts ready to shoot.

Do not use for:
- A single known video the user wants decoded: route to `video-decoder` instead.
- An idea the user already has and wants scripted: route to `script-writer` instead.

## Dependencies

This is a self-contained plugin. It bundles all sub-skills and the Gemini helper script. No shared skills environment is required. The hard external requirements are three API keys (see next section).

| Dependency | Role in this skill |
|---|---|
| `virlo` skill (bundled) | Stage 1 keyword mode: discovers outlier short-form videos by niche keyword across Instagram, TikTok, and YouTube |
| `scrape` skill (bundled) | Stage 1 handles mode, Stage 2, and Stage 4 CDN URL resolution: pulls recent posts, transcripts, cover frames, and direct media URLs via ScrapeCreators API |
| `video-decoder` skill | Stage 3 and Stage 4: decodes each outlier into a filled Decode Record (visual hook, written hook, spoken hook, root, VV, IT, Format) |
| `script-writer` skill | Stage 7: writes one production-ready script per approved idea |
| `brand-profiler` skill (bundled) | Stage 0: builds a new brand profile when none exists, collecting all schema fields including `voice_tone` |
| `scripts/gemini-video-analyze.js` (bundled) | Stage 4 deep pass: runs visual analysis (pacing, cut rhythm, visual style, retention devices, text-on-screen cadence) via OpenRouter Gemini |

## API keys and graceful degradation

Required keys: `VIRLO_API_KEY`, `SCRAPECREATORS_API_KEY`, `OPENROUTER_API_KEY`.

Load them at Stage 0 before any spend:

```bash
source .env
```

Degradation rules:

| Missing key | Effect |
|---|---|
| `VIRLO_API_KEY` | Keyword mode is disabled. Handles mode still works. Report this clearly at Stage 0. |
| `OPENROUTER_API_KEY` | Stage 4 (deep pass) is skipped entirely. All decodes remain `shallow`. Ideas derived from shallow decodes are flagged "shallow-decoded" in the ranked table. |
| `SCRAPECREATORS_API_KEY` | The engine cannot run. ScrapeCreators is required for transcripts and cover frames in all modes. Stop at Stage 0 and tell the user plainly. |

## Pipeline

### Stage 0: Intake

Ask the user for:

1. **Mode**: keyword mode (discover videos by niche keyword) or handles mode (analyze specific competitor handles).
2. **Brand profile path**: the path to a filled brand profile following `references/brand-profile-template.md`. If none exists, offer to build one by chaining to the bundled `brand-profiler` skill, which collects all schema fields (`voice_tone`, `audience`, `positioning`, `content_pillars`, `anti_topics`, `forbidden_constructions`, `proof_credibility`, `format_preferences`, `on_camera_talent`) interactively or from an existing brand document.
3. **Run slug**: a short lowercase label for this session (e.g. `ai-tools-keyword` or `techcreator-handles`). Used to name the run folder.
4. **Run base path**: where the run folder should be written. The default base is `./shortform-runs/` relative to the current working directory, producing `./shortform-runs/YYYY-MM-DD-<slug>/`. If the session is running inside a structured project that has its own research or output area, ask the user whether to place the run there instead. Confirm the resolved base path with the user before writing any file.

Check all three API keys. Report which modes are available before spending any credits. Create the run folder at the confirmed base path (e.g. `<base>/YYYY-MM-DD-<slug>/`) and write `00-intake.md` with mode, query or handle list, brand profile filename used, run base path, keys available, and any overrides.

### Stage 1: Discovery

**Keyword mode.** Invoke the `virlo` skill to discover outlier short-form videos for the niche keyword. Run discovery across all three competitor rings defined in `video-decoder/references/decode-framework.md`:

- Direct ring: the exact niche keyword as-is.
- Indirect ring: audience-adjacent keyword phrases (same audience, different topic angle).
- Adjacent ring: format-adjacent keyword phrases (same format or production style, different topic).

Invoke the `virlo` skill one ring at a time, passing the ring label and keyword phrase for that ring. Do not invoke virlo for multiple rings concurrently. The `virlo` skill owns all orbit mechanics: it first checks for an existing Comet that covers the ring keyword and reuses its accumulated data (free) when one is available, and only fires a fresh Orbit (cost: $0.50) for rings with no matching Comet. The orchestrator's responsibility is sequencing: wait for virlo to return the ranked outlier list for a ring before invoking virlo for the next ring.

After virlo returns results for a ring, compute per-video outlier magnitude. Virlo's results include a creator-level outlier ratio, but the orchestrator needs a per-video ratio for Stage 4 and the Stage 6 ranking rubric. For each unique creator appearing in the ring results, invoke the `scrape` skill to fetch that creator's recent posts (roughly the last 20) on the relevant platform. Use the returned posts to compute a baseline median view count for that creator. Then compute each video's outlier ratio as `video_views / creator_median_views`. Save raw JSON responses to `raw/` for each ring and for each baseline fetch.

**Handles mode.** Invoke the `scrape` skill to fetch recent posts (roughly the last 20) for each handle on the relevant platform. For each handle, compute the median view count across the returned posts. Keep only posts that beat that creator's own median by 2x or more (outlier threshold). Save raw JSON to `raw/`.

If a handle yields zero posts above the 2x threshold (low-variance creator), include that creator's single top-performing recent post anyway. Note in `00-intake.md` that the handle had no clear outlier and that the top post was included as a fallback.

In both modes, the Stage 1 output is a de-duplicated list of outlier videos with their source URL, platform, creator handle, and view count.

### Stage 2: Receipts

For each outlier video, invoke the `scrape` skill to collect:

- Transcript: for YouTube, invoke the `scrape` skill to fetch the transcript by video URL. For TikTok and Instagram, attempt to extract transcript text from the posts payload already fetched in Stage 1. If the posts payload contains no transcript for a video, invoke the `scrape` skill's transcript function for that video URL as a fallback before passing the video to Stage 3.
- Cover frame: the thumbnail URL returned in the posts payload. For YouTube, derive the cover frame as `https://img.youtube.com/vi/[VIDEO_ID]/hqdefault.jpg`.

Save all raw responses to `raw/` named by source and timestamp (e.g. `scrapecreators-transcript-[video_id]-[timestamp].json`). Every view count and engagement figure used downstream must trace to a file in `raw/`.

### Stage 3: Decode

Run the `video-decoder` skill on every outlier. Pass in: the transcript text (if available), the cover frame URL (if available), the creator handle, the platform, the outlier magnitude (ratio computed in Stage 1), and the competitor ring assignment (classify each video's ring relative to the brand using the ring definitions in `video-decoder/references/decode-framework.md`).

The `video-decoder` skill returns one filled Decode Record per video, including the visual hook (derived from the cover frame and any visible text-on-screen), written hook, and spoken hook. Write each record to `01-decodes/[video_id].md`. At this point all decodes have `decode_depth: shallow`.

A missing transcript alone is NOT a reason to skip a video. Many of the highest-outlier videos are text-overlay or POV-style videos with no spoken content. If the video has a cover frame or a caption, decode it shallow with `spoken_hook: n/a`. Skip a video only when there is genuinely nothing to decode: no transcript, no cover frame, no caption, AND no other meaningful signal (e.g. a hard fetch failure with nothing retrievable). Record any skipped video as `decode-failed` in `00-intake.md` with the video URL and the exact reason. Continue processing the remaining videos.

### Stage 4: Deep pass

Select the top 5 to 8 outliers ranked by outlier magnitude (highest ratio first).

Before calling the Gemini helper for any video, resolve the direct CDN media URL for that video using the `scrape` skill. A social page URL (e.g. a TikTok or Instagram page URL) is rejected by Gemini. Pass the CDN media URL to the helper, never the social page URL. The resolution method differs by platform: consult `scrape/references/reading-scrape.md` under "Resolving a Direct Media URL for Video" for the per-platform approach (TikTok requires a video-info lookup; Instagram media URLs are in the already-fetched posts payload; YouTube watch URLs pass through directly). Resolve and use CDN URLs promptly within the run, since CDN URLs expire.

For each selected video, call the Gemini helper and redirect stdout directly to the raw file in one command.

The helper path must be resolved as an absolute path from the directory that contains this SKILL.md (the `shortform-idea-engine` skill directory within the installed plugin). Determine that directory at runtime and construct the absolute path to `scripts/gemini-video-analyze.js` within it. The output redirect targets the run folder under the run base path confirmed in Stage 0. These two paths are resolved independently: the helper from the skill directory, the output from the run base path.

```bash
OPENROUTER_API_KEY=<key> node <skill-dir>/scripts/gemini-video-analyze.js <cdnMediaUrl> "Analyze this short-form video for: pacing (average cut frequency, notable slow or fast segments), cut rhythm (pattern of cuts: cut-on-beat, reaction cuts, b-roll intercuts), visual style (color grading, background, camera movement, on-screen graphic density), text-on-screen cadence (how often captions or callouts appear relative to spoken content), and retention devices (specific hooks, pattern interrupts, cliffhangers, or loops used mid-video). Return structured notes for each dimension." > <run-base>/YYYY-MM-DD-<slug>/raw/gemini-<video_id>-<timestamp>.json
```

Where `<skill-dir>` is the absolute path to the `shortform-idea-engine` skill directory (the directory containing this SKILL.md) and `<run-base>/YYYY-MM-DD-<slug>/` is the run folder confirmed in Stage 0.

The redirect saves the raw Gemini response to `raw/gemini-<video_id>-<timestamp>.json` inside the run folder so Stage 8 traceability can be satisfied.

Re-run the `video-decoder` skill for each of these videos, passing the Gemini block as the optional deep-analysis input. The re-run returns an updated Decode Record with `decode_depth: deep` and `deep_notes` populated. Overwrite the existing `01-decodes/[video_id].md` with the deep record.

Skip Stage 4 entirely if `OPENROUTER_API_KEY` is not set. All decodes remain `shallow` and the flag "shallow-decoded" is noted per idea in Stage 6.

### Stage 5: Ideate

Pool all Viral Vectors, Interest Topics, and Formats from every Decode Record in `01-decodes/`. Generate 10 to 15 remixed ideas. Each idea must:

- Name which Viral Vector it borrows (verbatim label from the Decode Record).
- Name which Interest Topic it borrows or adapts.
- Name which Format it uses.
- State the brand angle: how the borrowed VV, IT, and Format are remixed to fit this specific brand (use the brand profile's `content_pillars`, `audience`, and `proof_credibility` fields to anchor the angle).
- Record source lineage for each borrowed element: the `creator_handle`, `source_url`, and `video_id` from the Decode Record(s) the element was extracted from. If an element appears in more than one Decode Record, list all of them. This lineage travels with the idea through ranking and into the script.

Extraction signal weights by ring apply here (from `video-decoder/references/decode-framework.md`): VVs are valid from all four rings; ITs are highest-signal from indirect competitors; Formats are highest-signal from adjacent competitors. Weight your remixing accordingly but do not exclude ideas mechanically on ring alone.

If the decode pool is too small to support 10 distinct ideas without fabricating VV, IT, or Format combinations not present in the pool, generate only as many genuine ideas as the pool supports. Note the shortfall and the actual count at the top of `02-ideas.md`. Never invent extractables that were not decoded.

### Stage 6: Rank

Score every idea using `references/ranking-rubric.md`:

1. Check each idea against the brand profile's `anti_topics` list. Any match is an immediate disqualification (`DQ: anti-topic`). Remove disqualified ideas from the ranked table. Add each disqualified idea to a clearly-labelled "Disqualified (anti-topic)" section at the bottom of `02-ideas.md`, below the ranked table, listing the idea and the specific anti-topic it triggered.
2. Score surviving ideas on two axes: `viral_potential` (average of five sub-factors: VV strength, outlier magnitude, format repeatability, topic freshness, hook strength) and `brand_fit` (average of four sub-factors: voice match, audience match, content-pillar match, authentic credibility). Both scores use a 1 to 10 scale.
3. Compute `combined = viral_potential * (brand_fit / 10)`. Round to one decimal place.
4. Sort descending by `combined`. When two ideas tie, the one with the higher `viral_potential` ranks first.
5. Write the ranked table to `02-ideas.md` in this column order: `# | idea | root | borrowed VV/IT/Format | source video | viral | brand fit | combined | one-line rationale`. The `source video` cell shows the primary source video the idea traces to as `@creator_handle / video_id`. If the idea borrows elements from multiple source videos, list each handle/id pair separated by a comma. Populate this cell from the source lineage recorded in Stage 5.
6. Append "shallow-decoded" to the `one-line rationale` for any idea whose source video(s) did not receive a deep pass, for ANY reason: `OPENROUTER_API_KEY` was missing, OR the source video ranked below the top 5-8 cutoff and was not selected for Stage 4, OR the deep pass attempt failed for that video.

---

## GATE: User approval required before proceeding

Present the ranked table from `02-ideas.md` to the user. Do not proceed to Stage 7 until the user explicitly selects which ideas to script.

Default: suggest the top 3 to 5 ideas. The user may pick any subset, reorder, or substitute. Confirm the final approved list before continuing.

---

### Stage 7: Script

For each approved idea, invoke the `script-writer` skill. Pass in:

- The approved idea object: borrowed VV label, IT label, Format label, the brand angle written in Stage 5, and the source lineage recorded in Stage 5 (creator handle, source URL, and video id for each borrowed element).
- The full brand profile content: read the brand profile file from the path collected in Stage 0 and pass its content to `script-writer`, not the path string itself.

The `script-writer` skill returns one markdown script per idea, following the template in `script-writer/references/script-template.md` (Hook, Body beats with retention marks, CTA, Shotlist). Write each script to `03-scripts/[idea-slug].md`.

### Stage 8: Log

Finalize the run folder per `references/run-artifacts.md`:

- Verify `00-intake.md` is complete and accurate.
- Confirm every Decode Record in `01-decodes/` has a corresponding raw file in `raw/`.
- Confirm `02-ideas.md` contains the final ranked table.
- Confirm `03-scripts/` contains one script per approved idea.
- Confirm every factual claim (view counts, outlier magnitudes, engagement rates) in any artifact traces to a file in `raw/`. Flag unverified claims in the artifact where they appear.

Report the run folder path and a summary: how many outliers discovered, how many decoded (shallow vs deep), how many ideas generated, how many survived the anti-topic gate, and how many scripts produced.

## References

- `references/ranking-rubric.md`: viral potential sub-factors, brand fit sub-factors, anti-topic hard gate, combined score formula, and gate table column format.
- `references/brand-profile-template.md`: brand profile schema and filled example.
- `references/run-artifacts.md`: run folder structure, file descriptions, and traceability rule.
- `video-decoder/references/decode-framework.md`: rooting ladder, competitor ring definitions and extraction signal weights, three extractables (Viral Vector, Interest Topic, Format), and authoritative Decode Record schema.
