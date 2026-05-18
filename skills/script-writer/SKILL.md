---
name: script-writer
description: "Write a production-ready short-form video script from an approved idea and a brand profile. Produces a paired written and spoken hook, beat-by-beat body, retention marks, CTA, and a light shotlist. Use when the user has a video idea and wants it scripted in their brand voice. Triggers on: script this idea, write a short-form script, turn this into a video script."
---

# Script Writer

Turn one approved short-form video idea into a production-ready script.

## When to use

Use this skill when you have a single approved idea (with its borrowed VV, IT, and Format) and a brand profile, and you need a complete script ready to shoot. It can be run standalone or called by the `shortform-idea-engine` orchestrator for each approved top-N idea.

## Input

Provide:

- **One approved idea:** its borrowed Viral Vector, Interest Topic, and Format, plus the brand angle (how the format and vector were remixed to fit this brand).
- **Brand profile:** following the schema in `shortform-idea-engine/references/brand-profile-template.md`. If no brand profile is supplied, ask the user to provide one or offer to build one via the `brand-voice` skill before continuing. When used standalone (outside the full suite), the user may supply any brand profile that covers tone, vocabulary, persona, and pacing.

## Procedure

### 1. Load idea

Restate the borrowed VV, IT, and Format. Confirm the brand angle. If anything is ambiguous, ask one clarifying question before proceeding.

### 2. Hook block

Write the hook as a complementary pair:

- **Written hook (on-screen text):** the text overlay the viewer reads in the first 0-3 seconds.
- **Spoken hook (VO):** the line said aloud over the same window.

The two must complement each other, not duplicate. One can open the loop; the other can deepen it or add a contrasting layer.

### 3. Body

Write beat-by-beat body copy following the borrowed Format's structure. Apply the brand voice from the profile (tone, vocabulary, persona, pacing preferences). Each beat should advance the payoff set up by the hook. If no target length is supplied, default to 30 to 60 seconds and note the assumption in the output. If the Format's beat structure is not self-evident, infer it from the Format name and the brand angle, or ask the user before writing.

### 4. Retention marks

At every beat where viewer drop-off typically spikes (seconds 3-5, mid-body, pre-CTA), label which retention device fires. Use the five devices defined in `references/script-template.md` Part 1 (open loop, pattern break, callback, escalation, visual reset). More than one device can fire at the same beat.

### 5. CTA

Write a close consistent with the brand's positioning and any format preferences stated in the brand profile. Match the energy of the body (do not abruptly shift tone).

### 6. Shotlist

For each beat plus the CTA, state what is on screen: talking head, b-roll description, text card, or screen recording. Keep it directive, not cinematic.

## Output

One markdown script per idea, following the template in `references/script-template.md` exactly. All sections must be present: Hook, Body (all beats with retention marks), CTA, Shotlist.

## Reference

See `references/script-template.md` for:

- Precise definitions of all five retention devices.
- The authoritative script template and field notes.
