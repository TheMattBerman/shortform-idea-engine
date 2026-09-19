---
name: script-writer
description: "Write a production-ready short-form video script from an approved idea and a brand profile. Produces a three-hook block (visual, written, spoken), beat-by-beat body, retention marks, CTA, and a light shotlist. Use when the user has a video idea and wants it scripted in their brand voice. Triggers on: script this idea, write a short-form script, turn this into a video script."
---

# Script Writer

Turn one approved short-form video idea into a production-ready script.

## Preserve the creative mechanism

Carry the selected concept's creative contract into the script: native format,
attention promise, product role, viewer expectation, change mechanism, earned
ending and signature beat. Keep the setup required for that beat. Before polishing
individual hooks, read the full opening-to-ending sequence and identify what each
beat changes in information, expectation or emotion.

For every beat record `viewer knows before`, `new information/emotion after`, and
`intended performance`. Give a reaction, pause or repeated reveal its actual job;
do not add a cut or a line merely to satisfy a retention-device quota. Compare the
script with one relevant positive and one close negative when available, naming
the mechanism rather than copying surface traits.

The hook and CTA fields below describe the common spoken-video template. For an
approved music-led, narrative or native-placement format, retain the section and
write `not used` with its reason when speech, text, demonstration or a sales CTA
would break the concept. Use an earned ending in the CTA section. Do not invent
dialogue or force an offer to fill a template. A proof object may be an action,
exchange or reveal, not necessarily a product screen or document.

Return a keep list, at most three specific fixes, and the responsible stage. A
broken premise goes back to the idea owner; an awkward line stays in scripting.
When AI Video Kit is the downstream producer, use its configured root's
`docs/creative-stage-review.md` and `creative-director/stage-judge.md`. Script taste
is a forecast; actual acting, audio and motion remain uninspected until production.

## Carry a complete causal story

A script is not a sequence of labeled moments; it is a chain of triggers,
reactions and consequences. Before writing beats, confirm the story actually
moves:

- Every beat produces a new consequence, emotional change or escalation. A time
  or attempt label ("day 3", "attempt one") is not itself an event; if the label
  is the only thing that changed, the beat has not earned its place.
- Establish why the scene is being recorded (the in-world reason a camera or
  phone exists), a plausible environment for what is shown, and who is speaking
  before polishing any individual line.
- Give every character a stable ID (for example `OWNER_01`, `CUSTOMER_02`) instead
  of a generic label like "man" or "woman". Reuse the same ID for that person in
  every beat, the shotlist and any downstream production reference.
- Name setup/payoff pairs: when a beat pays off an earlier setup, state which
  earlier beat it depends on. Do not write a payoff whose setup was never
  planted.
- Order triggers before reactions: a character cannot react to something that
  has not happened yet. If a beat is a reaction, name what it is reacting to.
- Name any sound the viewer must recognize (what it is, where it comes from,
  and what it causes a character to do), not just that "audio plays."
- For any beat that needs a specific, provable performance, state who performs
  it, whether it happens on camera or off, and the exact line or action
  required. This is the signature beat; do not leave it implicit.
- Offscreen narration and phone voices are legitimate performers. Do not force
  an offscreen voice onto camera to "show" the speaker; visibility should match
  what the story needs.
- Not every format needs a CTA. A narrative or native-placement format can end
  on the earned beat itself. Do not bolt a negative hook, a demo and a sales
  close onto a format that does not call for one.
- If a beat asks one character to perform more than one coordinated action
  (for example: notice, then react, then hand off an object), split it into
  separate beats wherever a natural edit point would preserve the meaning.
  A single beat asking for too much coordinated action is where generation and
  editing tend to fail.

### Optional scene block

When the downstream producer understands `scene-contract/v1` (for example AI
Video Kit's `docs/scene-contract.md`), add the optional `scene` block described
in `references/script-template.md` to carry cast IDs, events and sound cues
through storyboard and generation without re-deriving them from prose. Omit the
block entirely when the downstream producer does not use it; the prose causal
story above is the minimum bar for every script.

## When to use

Use this skill when you have a single approved idea (with its borrowed VV, IT, and Format) and a brand profile, and you need a complete script ready to shoot. It can be run standalone or called by the `shortform-idea-engine` orchestrator for each approved top-N idea.

## Input

Provide:

- **One approved idea:** its borrowed Viral Vector, Interest Topic, and Format, plus the brand angle (how the format and vector were remixed to fit this brand).
- **Brand profile:** following the schema in `shortform-idea-engine/references/brand-profile-template.md`. If no brand profile is supplied, ask the user to provide one or offer to build one via the `brand-profiler` skill before continuing. When used standalone (outside the full suite), the user may supply any brand profile that covers tone, vocabulary, persona, and pacing.

## Procedure

> **HARD RULE: draft-and-hold.** Complete every step below (Hook, Body, Retention marks, CTA, Lint pass, Shotlist) internally before producing any visible output or writing any file. Do NOT stream sections as they are drafted. The complete, lint-cleared script is produced as a single output only after the lint pass has run and all violations are fixed. Partial output before the lint pass clears is not permitted.

### 1. Load idea

Restate the borrowed VV, IT, and Format. Confirm the brand angle. If anything is ambiguous, ask one clarifying question before proceeding.

### 2. Hook block

Write all three hooks for the 0-3 second window. Draft visual first, then written, then spoken.

- **Visual hook (on screen):** the opening shot, scene, or action the viewer sees. It answers "what is happening?" It is distinct from the shotlist (which covers all beats); the visual hook is the opening moment only.
- **Written hook (on-screen text):** the text overlay the viewer reads in the first 0-3 seconds. It answers "what does this mean for me?" Length must be 3 to 7 words (hard ceiling about 10). It is a headline, not a sentence, readable in under a second.
- **Spoken hook (VO):** the line said aloud over the same window. It answers "why should I care, and what is coming next?" It must be a complete, independently meaningful sentence and must not back-reference the written hook with words like "that plan", "this", or any pronoun that only makes sense after reading the on-screen text.

The three hooks must align onto one idea. If the visual implies one story, the text another, and the voiceover a third, the viewer gets confused and leaves. Written and spoken must complement each other, not duplicate: one can open the loop, the other can deepen it or add a contrasting layer.

See `references/script-template.md` for the full hook rules (role split, alignment, standalone-coherence, length, spoken-hook pattern guidance).

### 3. Body

Write beat-by-beat body copy following the borrowed Format's structure. Apply the brand voice from the profile (tone, vocabulary, persona, pacing preferences). Each beat should advance the payoff set up by the hook. If no target length is supplied, default to 30 to 60 seconds and note the assumption in the output. If the Format's beat structure is not self-evident, infer it from the Format name and the brand angle, or ask the user before writing.

### 4. Retention marks

At every beat where viewer drop-off typically spikes (seconds 3-5, mid-body, pre-CTA), label which retention device fires. Use the five devices defined in `references/script-template.md` Part 1 (open loop, pattern break, callback, escalation, visual reset). More than one device can fire at the same beat.

### 5. CTA

Write a close consistent with the brand's positioning and any format preferences stated in the brand profile. Match the energy of the body (do not abruptly shift tone).

### 6. Brand-voice lint pass

This step runs on the fully drafted, internally-held script before any output is produced. Do not output or write the script until the lint pass clears. Check every line of the drafted script, including all three hook lines (visual, written, spoken) drafted in step 2, against:

(a) The brand profile's `forbidden_constructions` field: flag and fix any line that violates a listed rule.
(b) Universal house rules: no em dashes (use commas, colons, or parentheses instead) and no `--` double-hyphen constructions.
(c) Written-hook length: count the words in the written hook. If it exceeds 7 words (hard ceiling about 10), tighten it to 7 words or fewer before the script is written. Do not output a script with an overlong written hook.

Fix all violations before proceeding. The final script is produced as a single output only after all violations are resolved. Do not output a script that contains any flagged construction. Example violations caught in test runs: an em dash used as a clause separator, and a "not X, it's Y" contrarian framing in a hook.

### 7. Shotlist

For each beat plus the CTA, state what is on screen. The canonical no-talent value is `none`. If the brand profile's `on_camera_talent` field is `none` or otherwise clearly indicates no on-camera presenter, do not spec a talking-head shot anywhere in the shotlist. Use b-roll, text cards, screen recordings, or voiceover-over-visuals instead. Treat the field as "has talent" only when it names a specific person or role. If `on_camera_talent` names a specific presenter or the founder, the shotlist may use them by name. Keep the shotlist directive, not cinematic.

### 8. Source lineage block

Fill the Source lineage block from the idea's data. The idea object carries its borrowed Viral Vector, Interest Topic, and Format, and each of those was extracted from one or more specific Decode Records. For each borrowed element, write the label, the creator handle, and the source video URL from the corresponding Decode Record. Also list the Decode Record id(s) on the "Decoded in:" line. The decode record id is the source video's `video_id` (decode records are stored as `01-decodes/[video_id].md`).

Lineage is mandatory. Every script ends with a filled Source lineage block, never blank or omitted. If the idea was assembled from elements that came from multiple source videos (VV from one, Format from another), each line names its own source.

## Output

One markdown script per idea, following the template in `references/script-template.md` exactly. All sections must be present: Hook, Body (all beats with retention marks), CTA, Shotlist, Source lineage.

## Reference

See `references/script-template.md` for:

- Precise definitions of all five retention devices.
- The authoritative script template and field notes.
