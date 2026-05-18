# Brand Profile Template

> **Canonical source:** This file (`skills/brand-profiler/references/brand-profile-template.md`) owns the schema. The orchestrator's copy at `skills/shortform-idea-engine/references/brand-profile-template.md` must stay in sync with it. Any schema change must be applied to both files at the same time.

Reference for the `brand-profiler` skill and the `shortform-idea-engine` orchestrator. Use this document to build or validate a brand profile before scoring ideas.

---

## Schema

Every brand profile must conform to this structure. Field names are used verbatim by the orchestrator when scoring ideas against voice match, audience match, content-pillar match, and the anti-topic hard gate. The `forbidden_constructions` field is checked by the `script-writer` lint pass.

```
# Brand Profile: <brand name>

voice_tone:               how the brand sounds
audience:                 who the content is for
positioning:              the one-line "who we are"
content_pillars:          topics that ARE on-brand (list)
anti_topics:              topics that are OFF-brand, hard exclude (list)
forbidden_constructions:  hard voice rules, e.g. no em dashes, no "not X it's Y" (list)
proof_credibility:        what the brand can authentically claim
format_preferences:       one or more of: talking-head, b-roll-heavy, text-heavy, mixed
```

**Note on `proof_credibility`:** If the brand is new and has no track record, set this field to `none yet`. In that case, score the "authentic credibility" brand-fit sub-factor as 5 (neutral) until real proof exists.

**Note on `forbidden_constructions`:** List each rule as a short phrase starting with "no". The `script-writer` skill reads this field verbatim and flags any generated script line that violates a listed rule before output is returned.

---

## Filled example

The block below shows what a complete, useful brand profile looks like. This example is for a generic AI-tools educator; it is not tied to any real person or brand.

```
# Brand Profile: AI Tools Weekly

voice_tone:               Direct and practical. Plain sentences. No hype words ("game-changer",
                          "revolutionary"). Conversational but not casual, like a knowledgeable
                          colleague explaining a tool over coffee. Occasional dry humor is fine.

audience:                 Knowledge workers and indie founders who want to work faster using AI.
                          Comfortable with tech but not engineers. Ages 28-45. Already using
                          ChatGPT; looking for what to use next and how to use it well.

positioning:              We test AI tools so busy people know which ones are worth their time.

content_pillars:
  - AI tool comparisons and walkthroughs
  - Practical workflows (copy, research, ops)
  - Time-saving automation setups
  - "Tool I dropped and why" honest takes

anti_topics:
  - Politics and social commentary
  - Crypto, NFTs, Web3
  - Get-rich-quick or passive income framing
  - Topics that require medical, legal, or financial licensing to credibly discuss
  - Gear / gadget reviews unrelated to AI software

forbidden_constructions:
  - no em dashes (use commas or colons instead)
  - no "not X, it's Y" contrarian framing
  - no hype adjectives: game-changer, revolutionary, insane, mind-blowing
  - no rhetorical questions used as hooks (e.g. "Ever wonder why...?")
  - no passive voice in hooks

proof_credibility:        Tests every tool hands-on before reviewing. 50k newsletter subscribers.
                          Has shipped 3 AI-powered side projects used by real customers.

format_preferences:       talking-head, b-roll-heavy
```
