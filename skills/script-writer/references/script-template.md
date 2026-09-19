# Script Template

Reference for the script-writer skill: defines re-hook retention devices and the exact template the skill fills in to produce a production-ready short-form video script.

---

## Part 1: Retention devices

Place one or more of these re-hook tactics at any beat where viewer drop-off typically spikes (seconds 3-5, mid-body, pre-CTA).

**Open loop:** Pose a question or tease a payoff at the top that the video does not resolve until a later beat, keeping the viewer watching to close the loop.

**Pattern break:** Interrupt the expected rhythm with a sudden change in pace, tone, visual treatment, or subject, forcing the viewer's attention to reset.

**Callback:** Reference a specific detail, phrase, or image from an earlier beat in a new context, creating a satisfying connection that rewards viewers who stayed.

**Escalation:** Raise the stakes, specificity, or surprise level with each successive beat so the value of continuing to watch compounds rather than plateaus.

**Visual reset:** Cut to a noticeably different shot type, text card, or screen element at a drop-point, giving the eye a fresh frame that reads as new content.

---

## Part 2: Script template

**Hook rules (apply before filling the template):**

- The written hook and the spoken hook must complement each other, not duplicate. One may open the loop; the other may deepen it or add a contrasting layer.
- Each hook line must be standalone-coherent: it must parse on its own without reference to the other line. The spoken hook (VO) must be a complete, independently meaningful sentence. It must not back-reference the written hook with words like "that plan", "this", or any other pronoun or phrase that only makes sense after reading the on-screen text.
- Role split: each hook answers its own question. Visual hook answers "what is happening?" Written hook answers "what does this mean for me?" Spoken hook answers "why should I care, and what is coming next?" Keeping the roles distinct is what makes standalone coherence automatic.
- Alignment: all three hooks must lock onto one idea. If the visual implies one story, the text another, and the voiceover a third, the viewer gets confused and leaves. The three hooks reinforce a single idea.
- Length: the written (on-screen) hook is 3 to 7 words, with a hard ceiling of about 10. It is a headline, not a sentence, readable in under a second. The spoken hook carries the nuance in 2 to 4 short sentences. The written hook just names the tension or the promise.
- Spoken hook pattern (recommended guidance, not a hard rule): a strong default is context lean, then contrast, then a contrarian snapback, delivered staccato, on one subject. Override this pattern when forcing it makes the hook read worse.

```
# Script: <idea title>

Brand: <brand name>
Borrowed from: VV <viral vector> | IT <interest topic> | Format <format>
Target length: <seconds>

## Hook (0-3s)
Visual hook (on screen): <the opening shot, scene, or action the viewer sees>
Written hook (on-screen text): <text overlay, verbatim, 3-7 words>
Spoken hook (VO): <the line said aloud, complete and standalone>

## Body
Beat 1 (<time range>): <what is said> | on-screen: <text/b-roll cue>
Beat 2 (<time range>): <what is said> | on-screen: <text/b-roll cue>
Beat 3 (<time range>): <what is said> | on-screen: <text/b-roll cue>
[add beats as the Format requires]

Retention marks: <which device fires at which beat/time>

## CTA (<time range>)
<brand-appropriate close>

## Shotlist
- <beat>: <what is on screen: talking head (only if on_camera_talent names a presenter or founder), b-roll, text card, screen recording>

## Source lineage
Borrowed from:
- Viral Vector: <vector> | from <creator handle>, <source video URL>
- Interest Topic: <topic> | from <creator handle>, <source video URL>
- Format: <format> | from <creator handle>, <source video URL>
Decoded in: <decode record id(s)>
```

**Shotlist rule for `on_camera_talent`:** Check the brand profile before speccing shots. The canonical no-talent value is `none`. If `on_camera_talent` is `none` or otherwise clearly indicates no on-camera presenter, every shotlist entry must use b-roll, text cards, screen recordings, or voiceover-over-visuals. Talking-head shots are not permitted. Treat the field as "has talent" only when it names a specific person or role. If `on_camera_talent` names a presenter or the founder, the shotlist may use them by name.

**Source lineage rule:** Every script ends with a filled Source lineage block. Each line names the element borrowed and traces it to the creator handle and source video URL from the Decode Record. If a borrowed element traces to more than one source video, list each on its own line. The block is never blank or omitted.

---

## Part 3: Optional scene block

Add this block only when the downstream producer reads `scene-contract/v1`
(for example AI Video Kit). It restates the body's causal story as structured
data so cast identity, triggers, payoffs and sound cues survive storyboard and
generation without being re-derived from prose. Field names match the
downstream contract exactly; do not rename them.

```json
"scene": {
  "schema": "scene-contract/v1",
  "cast": [
    {"id": "OWNER_01", "description": "shop owner, apron, gray hoodie", "presence": "onscreen"},
    {"id": "CUSTOMER_02", "description": "regular customer, red jacket", "presence": "onscreen"},
    {"id": "DELIVERY_VOICE", "description": "courier heard through the phone speaker", "presence": "phone_voice"}
  ],
  "sound_cues": [
    {"id": "PHONE_BUZZ", "source": "phone_speaker", "layer": "sfx", "recognizable_as": "an incoming call"}
  ],
  "events": [
    {"id": "phone_buzzes", "beat_id": "B02", "kind": "sound", "cue": "PHONE_BUZZ"},
    {"id": "owner_answers", "beat_id": "B02", "kind": "reaction", "performer": "OWNER_01",
     "visibility": "visible", "action": "picks up the phone off the counter", "after": ["phone_buzzes"], "once": true},
    {"id": "delivery_wrong_address", "beat_id": "B03", "kind": "line", "performer": "DELIVERY_VOICE",
     "visibility": "offscreen", "line": "This address doesn't exist.", "after": ["owner_answers"]},
    {"id": "customer_corrects", "beat_id": "B04", "kind": "line", "performer": "CUSTOMER_02",
     "visibility": "visible", "line": "That's because I'm standing right here.", "after": ["delivery_wrong_address"],
     "signature": true},
    {"id": "owner_laughs", "beat_id": "B05", "kind": "consequence", "performer": "OWNER_01",
     "visibility": "visible", "action": "laughs and waves the customer over", "after": ["customer_corrects"],
     "pays_off": "owner_answers"}
  ]
}
```

**Worked example (generic, non-client):** a corner shop owner's phone buzzes
(trigger), he answers it on camera (reaction), an offscreen courier voice says
the delivery address does not exist (consequence and new information), the
regular customer standing at the counter delivers the visible signature line
"That's because I'm standing right here" (the provable on-camera performance),
and the owner laughs and waves her over (consequence that pays off the earlier
"answers the phone" setup). The scene ends on that beat; there is no CTA,
because the format is a native comic moment, not a demo-and-offer ad.

| Field | Values and rules |
|---|---|
| `cast[].presence` | `onscreen`, `offscreen_voice`, `phone_voice`, `offscreen_narration`. IDs are stable across hook, body, shotlist and lineage. Never use "man"/"woman" as an identity. |
| `sound_cues[]` | `source`: `phone_speaker`, `music_bed`, `native_voice`, `sfx`, `narration`. `layer`: `music`, `phone_voice`, `sfx`, `dialogue`, `narration`. `recognizable_as` states what the viewer must hear it as. |
| `events[].kind` | `line` (needs `line`), `action`, `reaction`, `consequence` (need `action` or `line`), `sound` (needs `cue`). |
| `events[].visibility` | `visible`: the performer must be seen doing it. `offscreen`: heard, not seen (phone voices, narration). A visible event needs an `onscreen` performer; an offscreen performer cannot have a visible event. |
| `events[].after` | Trigger/prerequisite event IDs. Order matters: the trigger must resolve before the event it leads to. |
| `events[].once` | The action happens once, after its trigger. A repeat or an early start is a defect, not a beat. |
| `events[].pays_off` | The setup event this beat rewards. The setup must come from an earlier beat. |
| `events[].signature` | Marks the one performance that must be provably delivered (exact performer, visible or offscreen, exact line or action) for this beat to count as complete. |

Do not force every beat into this schema. Use it for the beats where identity,
trigger order, payoff or sound actually matter to whether the scene makes
sense; a plain establishing shot does not need an event record.
