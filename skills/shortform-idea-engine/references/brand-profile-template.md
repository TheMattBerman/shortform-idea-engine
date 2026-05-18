# Brand Profile Template

Reference for the `shortform-idea-engine` skill. Use this document to collect or validate a brand profile before scoring ideas.

If the user has no brand profile, the orchestrator offers to build one and chains to the `brand-voice` skill for the `voice_tone` field.

---

## Schema

Every brand profile must conform to this structure. Field names are used verbatim by the orchestrator when scoring ideas against voice match, audience match, content-pillar match, and the anti-topic hard gate.

```
# Brand Profile: <brand name>

voice_tone:          how the brand sounds (reuse brand-voice skill output)
audience:            who the content is for
positioning:         the one-line "who we are"
content_pillars:     topics that ARE on-brand (list)
anti_topics:         topics that are OFF-brand, hard exclude (list)
proof_credibility:   what the brand can authentically claim
format_preferences:  one or more of: talking-head, b-roll-heavy, text-heavy, mixed
```

**Note on `proof_credibility`:** If the brand is new and has no track record, set this field to `none yet`. In that case, score the "authentic credibility" brand-fit sub-factor as 5 (neutral) until real proof exists.

---

## Filled example

The block below shows what a complete, useful brand profile looks like. This example is for a generic AI-tools educator; it is not tied to any real person or brand.

```
# Brand Profile: AI Tools Weekly

voice_tone:          Direct and practical. Plain sentences. No hype words ("game-changer",
                     "revolutionary"). Conversational but not casual, like a knowledgeable
                     colleague explaining a tool over coffee. Occasional dry humor is fine.

audience:            Knowledge workers and indie founders who want to work faster using AI.
                     Comfortable with tech but not engineers. Ages 28-45. Already using
                     ChatGPT; looking for what to use next and how to use it well.

positioning:         We test AI tools so busy people know which ones are worth their time.

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

proof_credibility:   Tests every tool hands-on before reviewing. 50k newsletter subscribers.
                     Has shipped 3 AI-powered side projects used by real customers.

format_preferences:  talking-head, b-roll-heavy
```
