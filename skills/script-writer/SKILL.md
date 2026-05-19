---
name: script-writer
description: "Write a production-ready short-form video script from an approved idea and a brand profile. Produces a three-hook block (visual, written, spoken), beat-by-beat body, retention marks, CTA, and a light shotlist. Use when the user has a video idea and wants it scripted in their brand voice. Triggers on: script this idea, write a short-form script, turn this into a video script."
---

# Script Writer

Turn one approved short-form video idea into a production-ready script.

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

## Output

One markdown script per idea, following the template in `references/script-template.md` exactly. All sections must be present: Hook, Body (all beats with retention marks), CTA, Shotlist.

## Reference

See `references/script-template.md` for:

- Precise definitions of all five retention devices.
- The authoritative script template and field notes.
