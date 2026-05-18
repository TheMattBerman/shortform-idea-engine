# Ranking Rubric

Reference for the `shortform-idea-engine` skill. Use this document when scoring remixed ideas and building the gate table.

---

## Viral potential (1-10)

Score on five sub-factors, then average them into a single `viral_potential` score (0.5 precision is fine).

| Sub-factor | What to evaluate |
|---|---|
| Viral Vector strength | How potent and transferable is the borrowed VV? A counterintuitive claim or curiosity gap scores higher than a generic listicle opener. 5 = the VV is clear and has worked in at least one adjacent niche, but has not been tested widely enough to call it dominant. |
| Outlier magnitude | How strong is the evidence that this Viral Vector works? Measured by how far above baseline the source video(s) performed. A 10x+ outlier is high-confidence evidence; a 2x outlier is low-confidence. 5 = the source video outperformed channel baseline by roughly 4-6x, giving moderate confidence the VV is transferable. |
| Format repeatability | Has this format produced multiple winners across creators, or is it a one-hit anomaly? 5 = the format has won for two or three creators but has not yet become a saturated convention. |
| Topic freshness | Is the topic undersaturated or already flooding feeds? Fresher scores higher. 5 = the topic is active but not saturated, visible in feeds but not dominant. |
| Hook strength | How hard does the proposed hook hit in the first 2-3 seconds? Rate the written or spoken hook on its own. 5 = the hook creates clear curiosity or stakes but does not yet feel urgent or surprising enough to stop a fast scroll. |

A score of 1 means the idea is unlikely to outperform baseline. A score of 10 means all five sub-factors are exceptional.

---

## Brand fit (1-10)

Score on four sub-factors, then average them into a single `brand_fit` score.

| Sub-factor | What to evaluate |
|---|---|
| Voice match | Does the idea's tone, register, and delivery style match the brand's voice profile? 5 = the tone is mostly compatible but would need minor adaptation to feel native. |
| Audience match | Is this content for the brand's stated audience, not a tangential one? 5 = the idea serves the core audience but leans toward one segment rather than the full audience profile. |
| Content-pillar match | Does the idea sit inside at least one of the brand's declared content pillars? 5 = the idea fits a pillar loosely but would need a clear angle adjustment to sit squarely within it. |
| Authentic credibility | Can the brand make this claim or tell this story with genuine first-hand authority? 5 = the brand has relevant experience but would need to cite external support to make the claim fully credible. |

A score of 1 means the idea clashes with the brand on most dimensions. A score of 10 means the idea could only have come from this brand.

---

## Anti-topic hard gate

Before scoring, check the idea against the brand profile's `anti_topics` list.

If the idea touches any anti-topic, it is **disqualified**. Remove it from the ranked table entirely. Do not assign scores. Note the disqualification with `DQ: anti-topic` in the idea log.

This gate fires regardless of how strong the viral potential score is. A 10-viral idea on an anti-topic is still dropped.

---

## Combined score

```
combined = viral_potential * (brand_fit / 10)
```

Brand fit acts as a 0.1 to 1.0 multiplier. A perfect on-brand idea preserves the full viral potential score; a weak brand fit erodes it. This means a strong on-brand idea always outranks a strong off-brand one at the same viral potential level.

Worked example:

- Idea A: viral 10, brand fit 4 -> combined = 10 * (4/10) = **4.0**
- Idea B: viral 7, brand fit 9 -> combined = 7 * (9/10) = **6.3**
- Idea B wins.

Round combined scores to one decimal place. When two ideas share the same combined score, the one with the higher `viral_potential` ranks first.

---

## Gate table format

The gate table presents all ideas that survive the anti-topic gate. The orchestrator typically generates 10 to 15 ideas per run. The user reviews the table and selects which ideas proceed to scripting (default: the top 3 to 5).

Present the ranked idea table at the approval gate. Sort by `combined` descending. Use this exact column order:

```
# | idea | root | borrowed VV/IT/Format | viral | brand fit | combined | one-line rationale
```

- `#`: rank (1 = highest combined score)
- `idea`: short name for the remixed concept (3-8 words)
- `root`: the video root the idea was derived from (e.g. `Non-fiction > Tech + demo > demo`)
- `borrowed VV/IT/Format`: which of the three extractables was borrowed and its label from the Decode Record
- `viral`: the viral potential score
- `brand fit`: the brand fit score
- `combined`: the combined score
- `one-line rationale`: one sentence explaining why this idea wins or is risky

Disqualified ideas are not shown in the ranked table. They are always appended below the ranked table in `02-ideas.md` in a clearly labelled "Disqualified (anti-topic)" section. Each entry lists the idea and the specific anti-topic it touched.
