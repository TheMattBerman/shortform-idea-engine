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
```

**Shotlist rule for `on_camera_talent`:** Check the brand profile before speccing shots. The canonical no-talent value is `none`. If `on_camera_talent` is `none` or otherwise clearly indicates no on-camera presenter, every shotlist entry must use b-roll, text cards, screen recordings, or voiceover-over-visuals. Talking-head shots are not permitted. Treat the field as "has talent" only when it names a specific person or role. If `on_camera_talent` names a presenter or the founder, the shotlist may use them by name.
