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

```
# Script: <idea title>

Brand: <brand name>
Borrowed from: VV <viral vector> | IT <interest topic> | Format <format>
Target length: <seconds>

## Hook (0-3s)
Written hook (on-screen text): <text overlay, verbatim>
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
- <beat>: <what is on screen: talking head (only if on_camera_talent is set), b-roll, text card, screen recording>
```

**Shotlist rule for `on_camera_talent`:** Check the brand profile before speccing shots. If `on_camera_talent` is `none` or the brand is faceless, every shotlist entry must use b-roll, text cards, screen recordings, or voiceover-over-visuals. Talking-head shots are not permitted. If `on_camera_talent` names a presenter or the founder, the shotlist may use them by name.
