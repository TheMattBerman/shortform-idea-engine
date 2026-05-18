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

All five sub-skills and the Gemini helper script must be present in the same skills environment.

| Dependency | Role in this skill |
|---|---|
| `virlo` skill | Stage 1 keyword mode: discovers outlier short-form videos by niche keyword across Instagram, TikTok, and YouTube |
| `scrape` skill | Stage 1 handles mode and Stage 2: pulls recent posts per handle, transcripts, and cover frames via ScrapeCreators API |
| `video-decoder` skill | Stage 3 and Stage 4: decodes each outlier into a filled Decode Record (written hook, spoken hook, root, VV, IT, Format) |
| `script-writer` skill | Stage 7: writes one production-ready script per approved idea |
| `brand-voice` skill | Optional at Stage 0: builds the `voice_tone` field of a new brand profile |
| `scripts/gemini-video-analyze.js` | Stage 4 deep pass: runs visual analysis (pacing, cut rhythm, visual style, retention devices, text-on-screen cadence) via OpenRouter Gemini |

## API keys and graceful degradation

Required keys: `VIRLO_API_KEY`, `SCRAPECREATORS_API_KEY`, `OPENROUTER_API_KEY`.

Load them at Stage 0 before any spend:

```bash
source MatthewBerman/04-claude-code/config/.env
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
2. **Brand profile path**: the path to a filled brand profile following `references/brand-profile-template.md`. If none exists, offer to build one: chain to the `brand-voice` skill for the `voice_tone` field, then collect the remaining fields (`audience`, `positioning`, `content_pillars`, `anti_topics`, `proof_credibility`, `format_preferences`) interactively.
3. **Run slug**: a short lowercase label for this session (e.g. `ai-tools-keyword` or `techcreator-handles`). Used to name the run folder.

Check all three API keys. Report which modes are available before spending any credits. Create the run folder `runs/YYYY-MM-DD-<slug>/` and write `00-intake.md` with mode, query or handle list, brand profile filename used, keys available, and any overrides.

### Stage 1: Discovery

**Keyword mode.** Invoke the `virlo` skill to discover outlier short-form videos for the niche keyword. Orbit jobs are async: submit, poll until complete, then retrieve results. Run three separate orbit queries covering the three competitor rings defined in `video-decoder/references/decode-framework.md`:

- Direct ring: the exact niche keyword as-is.
- Indirect ring: audience-adjacent keyword phrases (same audience, different topic angle).
- Adjacent ring: format-adjacent keyword phrases (same format or production style, different topic).

For each ring, follow the virlo skill's documented two-step orbit procedure:

1. Submit the orbit job: `/virlo orbit "<keyword_phrase>" --platforms instagram,tiktok,youtube --raw`. This queues the job and returns an `orbit_id`.
2. Poll status with `/virlo orbit-status [orbit_id]` until `status: "completed"`.
3. Retrieve outlier creators: `/virlo orbit-outliers [orbit_id] --limit 25`.
4. Retrieve videos: call `GET /v1/orbit/[orbit_id]/videos` directly for the video list.

Save raw JSON responses to `raw/` for each orbit.

**Handles mode.** Invoke the `scrape` skill for recent posts per handle: `/scrape posts [handle] [platform] --limit 20 --raw`. For each handle, compute the median view count across the returned posts. Keep only posts that beat that creator's own median by 2x or more (outlier threshold). Save raw JSON to `raw/`.

If a handle yields zero posts above the 2x threshold (low-variance creator), include that creator's single top-performing recent post anyway. Note in `00-intake.md` that the handle had no clear outlier and that the top post was included as a fallback.

In both modes, the Stage 1 output is a de-duplicated list of outlier videos with their source URL, platform, creator handle, and view count.

### Stage 2: Receipts

For each outlier video, invoke the `scrape` skill to collect:

- Transcript: `/scrape transcript [video_url]` for YouTube. For TikTok and Instagram, attempt to extract transcript text from the posts payload already fetched in Stage 1. If the posts payload contains no transcript for a video, invoke the `scrape` skill's transcript function as a fallback: `/scrape transcript [video_url]` before passing the video to Stage 3.
- Cover frame: the thumbnail URL returned in the posts payload. For YouTube, derive the cover frame as `https://img.youtube.com/vi/[VIDEO_ID]/hqdefault.jpg`.

Save all raw responses to `raw/` named by source and timestamp (e.g. `scrapecreators-transcript-[video_id]-[timestamp].json`). Every view count and engagement figure used downstream must trace to a file in `raw/`.

### Stage 3: Decode

Run the `video-decoder` skill on every outlier. Pass in: the transcript text, the cover frame URL, the creator handle, the platform, the outlier magnitude (ratio computed in Stage 1), and the competitor ring assignment (classify each video's ring relative to the brand using the ring definitions in `video-decoder/references/decode-framework.md`).

The `video-decoder` skill returns one filled Decode Record per video. Write each record to `01-decodes/[video_id].md`. At this point all decodes have `decode_depth: shallow`.

If the `video-decoder` skill cannot complete a decode for a video (missing transcript, failed cover frame, sub-skill error, or any other reason), skip that video, do not write a record to `01-decodes/`, and record it as `decode-failed` in `00-intake.md` with the video URL and the reason. Continue processing the remaining videos.

### Stage 4: Deep pass

Select the top 5 to 8 outliers ranked by outlier magnitude (highest ratio first).

For each selected video, call the Gemini helper and redirect stdout directly to the raw file in one command:

```bash
OPENROUTER_API_KEY=<key> node scripts/gemini-video-analyze.js <videoUrl> "Analyze this short-form video for: pacing (average cut frequency, notable slow or fast segments), cut rhythm (pattern of cuts: cut-on-beat, reaction cuts, b-roll intercuts), visual style (color grading, background, camera movement, on-screen graphic density), text-on-screen cadence (how often captions or callouts appear relative to spoken content), and retention devices (specific hooks, pattern interrupts, cliffhangers, or loops used mid-video). Return structured notes for each dimension." > raw/gemini-<video_id>-<timestamp>.json
```

The redirect saves the raw Gemini response to `raw/gemini-<video_id>-<timestamp>.json` so Stage 8 traceability can be satisfied.

Re-run the `video-decoder` skill for each of these videos, passing the Gemini block as the optional deep-analysis input. The re-run returns an updated Decode Record with `decode_depth: deep` and `deep_notes` populated. Overwrite the existing `01-decodes/[video_id].md` with the deep record.

Skip Stage 4 entirely if `OPENROUTER_API_KEY` is not set. All decodes remain `shallow` and the flag "shallow-decoded" is noted per idea in Stage 6.

### Stage 5: Ideate

Pool all Viral Vectors, Interest Topics, and Formats from every Decode Record in `01-decodes/`. Generate 10 to 15 remixed ideas. Each idea must:

- Name which Viral Vector it borrows (verbatim label from the Decode Record).
- Name which Interest Topic it borrows or adapts.
- Name which Format it uses.
- State the brand angle: how the borrowed VV, IT, and Format are remixed to fit this specific brand (use the brand profile's `content_pillars`, `audience`, and `proof_credibility` fields to anchor the angle).

Extraction signal weights by ring apply here (from `video-decoder/references/decode-framework.md`): VVs are valid from all four rings; ITs are highest-signal from indirect competitors; Formats are highest-signal from adjacent competitors. Weight your remixing accordingly but do not exclude ideas mechanically on ring alone.

If the decode pool is too small to support 10 distinct ideas without fabricating VV, IT, or Format combinations not present in the pool, generate only as many genuine ideas as the pool supports. Note the shortfall and the actual count at the top of `02-ideas.md`. Never invent extractables that were not decoded.

### Stage 6: Rank

Score every idea using `references/ranking-rubric.md`:

1. Check each idea against the brand profile's `anti_topics` list. Any match is an immediate disqualification (`DQ: anti-topic`). Remove disqualified ideas from the ranked table. Add each disqualified idea to a clearly-labelled "Disqualified (anti-topic)" section at the bottom of `02-ideas.md`, below the ranked table, listing the idea and the specific anti-topic it triggered.
2. Score surviving ideas on two axes: `viral_potential` (average of five sub-factors: VV strength, outlier magnitude, format repeatability, topic freshness, hook strength) and `brand_fit` (average of four sub-factors: voice match, audience match, content-pillar match, authentic credibility). Both scores use a 1 to 10 scale.
3. Compute `combined = viral_potential * (brand_fit / 10)`. Round to one decimal place.
4. Sort descending by `combined`. When two ideas tie, the one with the higher `viral_potential` ranks first.
5. Write the ranked table to `02-ideas.md` in this column order: `# | idea | root | borrowed VV/IT/Format | viral | brand fit | combined | one-line rationale`.
6. If `OPENROUTER_API_KEY` was missing, append "shallow-decoded" to the `one-line rationale` for any idea whose source video(s) did not receive a deep pass.

---

## GATE: User approval required before proceeding

Present the ranked table from `02-ideas.md` to the user. Do not proceed to Stage 7 until the user explicitly selects which ideas to script.

Default: suggest the top 3 to 5 ideas. The user may pick any subset, reorder, or substitute. Confirm the final approved list before continuing.

---

### Stage 7: Script

For each approved idea, invoke the `script-writer` skill. Pass in:

- The approved idea object: borrowed VV label, IT label, Format label, and the brand angle written in Stage 5.
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
