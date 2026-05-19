---
name: video-decoder
description: "Decode a single short-form video into its reusable components: root category, written hook, spoken hook, Viral Vector, Interest Topic, and Format, using a short-form video decode framework. Use when the user wants to understand why one video works or break down a competitor video. Triggers on: decode this video, break down this video, why did this video work, analyze this short."
---

# Video Decoder

Decode one short-form video into a filled Decode Record.

## When to use

Use this skill when you have a single video URL (or a post already pulled by the `scrape` skill) and need to understand why it won. It can be run standalone or called by the `shortform-idea-engine` orchestrator as a sub-step in a batch decode run.

## Input

Provide one of:

- A direct video URL (TikTok, Instagram Reel, YouTube Short, or other short-form platform).
- A handle plus a post already fetched by the `scrape` skill (pass the post object or transcript text directly).

Optionally, pass a Gemini deep-analysis text block (pacing, visual style, retention notes). When provided, the decode runs at `deep` depth (Step 6 runs). Without it, the decode is `shallow`.

Optionally, a competitor ring classification (`direct`, `indirect`, `adjacent`, or `distant`) passed in by the orchestrator. When the orchestrator runs a batch decode in keyword mode, it knows which ring's discovery query produced each video; that classification is authoritative and should be accepted as-is.

## Procedure

### 1. Gather inputs

Fetch the transcript and cover frame using the `scrape` skill:

- Transcript: `/scrape transcript [video_url]` (YouTube) or `/scrape posts [handle] [platform]` for TikTok/Instagram. If a transcript was already passed in, skip the API call.
- Cover frame: the first-frame or thumbnail image of the video. The `scrape` skill returns a thumbnail URL in the posts output. Download or reference it for vision analysis in Step 2. For a YouTube URL, derive the video ID from the URL and use `https://img.youtube.com/vi/[VIDEO_ID]/hqdefault.jpg` as the cover frame (`maxresdefault.jpg` is higher resolution but not always available).
- Record the `platform`, `creator_handle`, and native `video_id` from the response.
- Record `outlier_magnitude`: compare this video's view count against the median of the creator's last 20 comparable posts on the same platform. Express as a ratio (e.g. "8x baseline"). If the input is a bare URL rather than a pre-fetched post object and no baseline data is available yet, run `/scrape posts [creator_handle] [platform]` to collect roughly 20 recent posts and use the median of their view counts as the baseline. If baseline data is still unavailable after that, set `outlier_magnitude: n/a`.

### 2. Written hook and visual hook

Use vision on the cover frame image. The written hook and the visual hook are two separate things read from the same image: the written hook is the on-screen text; the visual hook is the scene itself.

**Written hook:**

- Read every on-screen text overlay verbatim. That is the `written_hook`.
- Note placement (top/center/bottom, full-width/corner), visual style (font weight, color, capitalization), and the curiosity gap the text opens.
- Record these observations as `written_hook_notes`.
- If the cover frame has no text overlay, set `written_hook` to `n/a` and `written_hook_notes` to a brief description of the visual composition instead.

**Visual hook (shallow decode):**

- Describe the opening scene: who or what is on screen, the composition (framing, angle, depth), and any immediately striking visual element.
- Write this description into the `visual_hook` field.
- Do not copy the written hook text here. `visual_hook` is the scene, not the text overlay.

### 3. Spoken hook

Take the first approximately 3 seconds of the transcript, verbatim. That is the `spoken_hook`. If timestamps are present, use everything up to the 0:03 mark. If the transcript has no timestamps, use the first sentence or the first natural pause, whichever comes first.

### 4. Root

Apply the rooting ladder from `references/decode-framework.md`:

1. Assign Level 1: `Fiction`, `Non-fiction`, or `Lifestyle`.
2. Assign Level 2: a short domain label plus treatment (e.g. `Tech + commentary`, `Fitness + tutorial`).
3. Assign Level 3: `educational`, `argumentative`, `opinion-based`, `narrative`, or `demo`.

Write the root as a single line using `>` separators: `Non-fiction > Tech + commentary > opinion-based`.

Disambiguation note: `educational` is concept-driven (teaches an idea); `demo` is output-driven (shows a visible result being produced).

### 5. Extract

Apply "The three extractables" from `references/decode-framework.md`. Produce all three.

**Viral Vectors.** Identify every repeatable mechanism that caused this video to outperform the creator's baseline. A Viral Vector is structural, rhetorical, or emotional; it must be transplantable to a different topic. If only one mechanism is present, list one. If more than one discrete mechanism is present, list each separately in `viral_vectors` (it is a list). Fail the definition test: if the mechanism only works on this exact topic, it is a topic-specific hook, not a Viral Vector.

**Interest Topic.** Name the niche subject, angle, or cultural moment the video taps. Tag it `fixed` (evergreen, stable year-round) or `ephemeral` (tied to a launch, news cycle, or trending moment).

**Format.** Name the structural container (e.g. listicle, teardown, before/after, tutorial, talking-head essay, POV, reaction, product demo, case study). Format is distinct from the Viral Vector (which is the mechanism) and the Interest Topic (which is the subject).

Also assign `competitor_ring`: if a competitor ring classification was passed in by the orchestrator, use it directly and do not re-derive it. Only if no ring was passed in, classify the ring yourself as `direct`, `indirect`, `adjacent`, or `distant` relative to the brand, using the ring definitions in `references/decode-framework.md`.

### 6. Deep (optional, runs only when a Gemini analysis block is provided)

Extract the following from the Gemini deep-analysis block and populate `deep_notes`:

- Pacing: average cut frequency, notable slow or fast segments.
- Cut rhythm: pattern of cuts (e.g. cut-on-beat, reaction cuts, b-roll intercuts).
- Visual style: color grading, background, camera movement, on-screen graphic density.
- Text-on-screen cadence: how often captions or callouts appear relative to spoken content.
- Retention devices: specific hooks, pattern interrupts, cliffhangers, or loops used mid-video.

Also enrich `visual_hook` with the motion layer from the Gemini block: append the opening action (what is physically happening in the first seconds), the pattern interrupt (any jarring or unexpected visual move), and first-seconds movement (camera or subject motion). Keep the scene description from Step 2 as the base and add the motion detail after it.

If no Gemini block was provided, skip this step and leave `deep_notes` blank.

## Output

Emit one filled Decode Record following the schema in `references/decode-framework.md` exactly: all 17 fields, in the order defined there. Populate every field; use `n/a` only when a field is genuinely inapplicable. Set `decode_depth` to `deep` if Step 6 ran, otherwise `shallow`.

## Reference

See `references/decode-framework.md` for:

- The full rooting ladder and worked examples.
- Competitor ring definitions and extraction signal weights by ring.
- Precise definitions of all three extractables (Viral Vector, Interest Topic, Format), including the Viral Vector definition test.
- The authoritative Decode Record schema and field notes.
