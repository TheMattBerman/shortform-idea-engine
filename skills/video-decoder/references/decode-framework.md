# Decode Framework

Reference for the `video-decoder` skill. Use this document when decoding a short-form video into a structured Decode Record.

---

## Rooting

Rooting is the act of classifying a video into a stable category hierarchy before analyzing it. It prevents misreading: a cooking tutorial and a cooking opinion piece share a topic but win through completely different mechanisms. Establish the root first; everything else follows from it.

**The category ladder has three levels:**

**Level 1: Top-level mode**

```
Fiction | Non-fiction | Lifestyle
```

- `Fiction`: scripted, narrative, or character-driven (sketches, skits, anime essays, storytelling)
- `Non-fiction`: factual, analytical, or commentary-driven (news, reviews, tutorials, explainers)
- `Lifestyle`: personal, aspirational, or identity-driven (GRWM, vlog, day-in-my-life, fitness)

**Level 2: Domain + Treatment**

Combine the subject domain with how it is treated. Examples: `Tech + commentary`, `Food + demo`, `Finance + opinion`, `Fitness + tutorial`.

Level 2 is a freeform descriptive label, not a controlled vocabulary. For consistency across decoders, use a short common-noun domain (Tech, Food, Fitness, Money, Media) and keep the treatment to a small natural set (commentary, analysis, tutorial, demo, reaction, story).

**Level 3: Treatment sub-type (treatment detail)**

```
educational | argumentative | opinion-based | narrative | demo
```

- `educational`: teaches a concept or skill; accuracy and clarity are the win conditions. Concept-driven: the payoff is understanding an idea.
- `argumentative`: takes a stance and builds a case; the argument hook is the win condition
- `opinion-based`: shares a perspective without a formal thesis; relatability or provocation is the win condition
- `narrative`: story arc; tension, payoff, and character drive retention
- `demo`: shows a process or output; the visible result is the win condition. Output-driven: the payoff is watching a visible result get produced.

Disambiguation: `educational` is concept-driven (teaches an idea); `demo` is output-driven (shows a visible result being produced).

**Worked examples:**

- An anime video essay analyzing character motivations roots to: `Fiction > Media + essay > opinion-based`
- An AI news short covering a model launch roots to: `Non-fiction > Tech + commentary > opinion-based`
- A "build this in 60 seconds" tutorial showing a finished web app being deployed roots to: `Non-fiction > Tech + demo > demo`

Write the root as a single line in the Decode Record: `Fiction > Media + essay > opinion-based`.

---

## Competitor Rings

Competitor rings define how closely a reference video relates to the brand being studied. The ring determines what to extract from the video.

**Ring definitions:**

| Ring | Description |
|------|-------------|
| `direct` | Same exact niche, format, and audience. A direct competitor. |
| `indirect` | Same target audience, different format or topic. They compete for attention, not content space. |
| `adjacent` | Same format or production style, different topic entirely. Useful as format proof-of-concept. |
| `distant` | Unrelated niche or entertainment category. Included only when a Viral Vector is unusually transferable. |

**Extraction rule:**

Every decode logs all three extractables (Viral Vector, Interest Topic, Format) regardless of ring. Signal weight by ring:

- **Viral Vectors** are valid from all four rings.
- **Interest Topics** are highest-signal from indirect competitors: they share your audience, so their topics directly signal audience appetite.
- **Formats** are highest-signal from adjacent competitors: they prove a container works at scale, divorced from topic.
- From a **direct competitor**, format parity is expected and carries low signal. Focus on the Viral Vector as the main extractable.

When logging `competitor_ring`, use the ring that reflects the relationship to the brand the decoder is working for, not to the original creator's self-description.

---

## The Three Extractables

A Decode Record must yield exactly three extractables. Precision matters. Vague extractables produce vague ideas.

**Viral Vector (VV)**

The repeatable mechanism that caused the video to outperform the creator's own baseline. A VV is not the topic. It is the structural, rhetorical, or emotional device that could be transplanted into a different video on a different topic and still win.

Examples of VVs:
- Curiosity gap in the first 2 seconds before any setup
- Counterintuitive claim stated as fact, proven inside the video
- Social proof anchored to a specific, surprising number
- Visual before/after with no narration required to understand the payoff

A VV fails the definition test if it only works on this specific topic. If the answer to "would this mechanism work in a video about something else?" is no, it is not a VV. It is a topic-specific hook.

A strong video may exhibit more than one discrete Viral Vector. List each separately in `viral_vectors`.

**Interest Topic (IT)**

The niche subject matter, angle, or cultural moment the video taps into. Tag it:

- `fixed`: evergreen; the topic is stable and searchable year-round (e.g. "how to negotiate salary")
- `ephemeral`: time-bound; tied to a launch, news cycle, or trending moment (e.g. "GPT-5 reaction")

Tag matters because ephemeral ITs require fast production turnaround; fixed ITs can be scheduled.

**Format**

The structural container. Format is distinct from VV (which is the mechanism) and IT (which is the topic). Format describes the shape of the video.

Common formats: listicle, POV, teardown, before/after, reaction, tier-list, tutorial, explainer, talking-head essay, day-in-my-life, challenge, duet/stitch, product demo, case study.

A format is reusable. The same format applied to a different IT with a strong VV is the unit of remixing.

---

## The three hooks

A short-form video has three hooks, ranked by importance: visual hook (what is on screen), written hook (on-screen text), spoken hook (the voiceover line). Eyes comprehend before ears, so the visual and written hooks carry more weight than the spoken hook.

When decoding, note how tightly the three hooks align onto one idea. A winning video usually has all three reinforcing the same idea. Tight alignment is often itself part of why the video won, and can surface as a Viral Vector.

---

## Decode Record Schema

Every decoded video produces one Decode Record. Fields must be populated in order. Do not skip fields; use `n/a` only when a field is genuinely inapplicable (e.g. `written_hook` on a video with no on-screen text).

```
## Decode Record

video_id:            short stable id
source_url:          link to the video
platform:            tiktok | instagram | youtube | other
creator_handle:
outlier_magnitude:   views vs the creator's own baseline (e.g. "8x baseline")
competitor_ring:     direct | indirect | adjacent | distant
visual_hook:         what is on screen in the opening seconds: scene, subject, framing; on a deep decode, also the action and pattern interrupt
written_hook:        verbatim on-screen text from the cover frame
written_hook_notes:  placement, style, the curiosity gap it opens
spoken_hook:         first ~3 seconds of the transcript, verbatim
root:                e.g. Non-fiction > Tech + commentary > opinion-based
viral_vectors:       list of repeatable reasons it won
interest_topic:      the niche topic
interest_topic_type: fixed | ephemeral
format:              the structural container
deep_notes:          optional: pacing, cut rhythm, visual style, retention devices
decode_depth:        shallow (transcript + cover only) | deep (Gemini pass included)
```

**Field notes:**

`outlier_magnitude`: baseline = the median view count across the creator's recent comparable videos on the same platform (roughly their last 20 posts). Express the ratio against that baseline, e.g. "8x baseline".

`visual_hook`: on a shallow decode, fill this from the cover frame (the static scene, subject, and framing). On a deep decode, enrich it with the motion layer from the Gemini pass: the opening action, the pattern interrupt, and first-seconds movement. `visual_hook` is always populated; it gets richer on a deep decode.

`deep_notes`: populated only when `decode_depth` is `deep`, meaning a Gemini visual-analysis pass was supplied. Leave blank for shallow decodes.

`video_id`: prefer the platform's native video ID. If unavailable, fall back to a slug derived from the creator handle plus publish date (e.g. `techcreator-2026-05-18`).

`platform`: common values are `tiktok`, `instagram`, `youtube`. Other platforms are allowed; use a short lowercase label (e.g. `x`, `linkedin`, `facebook`).
