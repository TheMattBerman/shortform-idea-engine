---
name: brand-profiler
description: "Build or extract a brand profile for the shortform-idea-engine kit. Use when the orchestrator has no existing brand profile (Stage 0), when the user wants to create one from scratch, or when the user supplies an existing brand or voice document and needs it converted to the kit schema. Triggers on: build brand profile, extract brand profile, create brand voice, no brand profile exists."
---

# Brand Profiler

Produce a filled brand profile conforming to `references/brand-profile-template.md`.

## When to use

Use this skill when:

- The `shortform-idea-engine` orchestrator reaches Stage 0 and finds no brand profile in scope.
- The user explicitly asks to build or update a brand profile for their kit.
- The user supplies an existing voice guide, brand doc, or style sheet and needs it translated into the kit schema.

## Procedure

Two modes. Choose based on what the user provides.

### Mode A: Guided build

The user has no existing brand document. Ask for each schema field in order, one at a time or as a short grouped interview. Do not skip any field.

Field sequence:

1. `voice_tone` - Ask: how does the brand sound? Collect at minimum: a tone descriptor (e.g. "direct and practical"), a sentence-style note (e.g. "short declarative sentences"), and one or two "never says" examples (e.g. "never uses hype words like game-changer"). A single word like "casual" is not enough depth to be useful to downstream skills.
2. `audience` - Ask: who is the content for? Demographics, platform, level of expertise.
3. `positioning` - Ask: one sentence describing what the brand does and the value it delivers to its audience.
4. `content_pillars` - Ask: what topics are always on-brand? Collect as a list.
5. `anti_topics` - Ask: what topics are off-limits, no exceptions? Collect as a list.
6. `forbidden_constructions` - Ask explicitly: are there any hard voice rules? Specific phrases, punctuation, or framing patterns the brand never uses? Common examples: no em dashes, no "not X it's Y" contrarian framing, no hype adjectives. This field is checked by the `script-writer` lint pass, so the more specific the better.
7. `proof_credibility` - Ask: what can the brand authentically claim (metrics, track record, credentials)? If none yet, set to `none yet`.
8. `format_preferences` - Ask: preferred video formats. Options: talking-head, b-roll-heavy, text-heavy, mixed.
9. `on_camera_talent` - Ask: who is available to appear on camera? Accept: a named presenter (give their name) or the founder. If the brand has no on-camera presenter, record the value as exactly `none` (you may add a short parenthetical, e.g. `none (faceless brand, no on-camera presenter)`). Do not accept free-text variants like "faceless", "n/a", or "no presenter" as the stored value; always normalize to `none`.

After collecting all fields, assemble the filled profile and show it to the user for confirmation before saving.

### Mode B: Extract from existing document

The user supplies a brand voice guide, style sheet, or other brand document. Read it and fill every schema field from the supplied material.

- Map the supplied document's content to the schema fields as accurately as possible.
- For `forbidden_constructions`: scan the document for any stated prohibitions, "never say" lists, or style rules. If the document is silent on this field, ask the user directly before proceeding. Do not leave it blank.
- For `anti_topics`: look for content restrictions, off-limits subjects, or audience exclusions stated in the document.
- Where the document is ambiguous or silent on a field, ask a single clarifying question for that field rather than guessing.
- For `format_preferences` specifically: this field must resolve to one or more of the four allowed values (talking-head, b-roll-heavy, text-heavy, mixed). When asking the user about it, offer those four options explicitly rather than using an open question, to avoid collecting free text that must be mapped later.
- For `on_camera_talent`: look for any mention of a host, presenter, founder, or face of the brand. If the document is silent on this, ask: who can appear on camera, or is this a faceless brand with no on-camera talent? If the brand has no on-camera presenter, record the value as exactly `none` (you may add a short parenthetical, e.g. `none (faceless brand, no on-camera presenter)`). Normalize all free-text variants ("faceless", "n/a", "no presenter") to `none`.

After filling the schema, show the completed profile to the user and note any fields that were inferred (not explicitly stated) so the user can confirm or correct them.

## Output

A filled brand profile following `references/brand-profile-template.md`. Output as a fenced markdown block the user can copy directly into a file.

If the user confirms the profile, save it as `brand-profile.md` in the working directory unless they specify another path.

## Reference

`references/brand-profile-template.md`
