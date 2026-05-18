# Reading Virlo Output (Judgment Layer)

How an operator reads Virlo results. This is not neutral documentation; it is opinion based on what the data actually tells you versus what it appears to tell you.

---

## What Outlier Magnitude Means

Virlo's outlier ratio is the creator's average views on matched videos divided by their follower count. A ratio of 2.0 means the average matched video got twice as many views as the creator has followers. That is the reach floor: content punching at its own weight.

**Default outlier threshold for ring analysis: 3.0.** Below 3.0, a creator is performing near-expectation and is not an outlier worth decoding. At 3.0-6.0, there is a repeatable signal worth examining. Above 6.0, something structural is working well enough to decode carefully.

Note: this is distinct from the decode framework's `outlier_magnitude` field, which the orchestrator computes as a video's views divided by the creator's own recent-posts baseline. The two metrics answer different questions and must not be conflated when both are in use.

When Virlo sorts by `weighted_score`, it is combining outlier ratio with absolute view size. Use `outlier_ratio` for format signal (what made something spread) and `weighted_score` for reach signal (which accounts matter most in the niche).

---

## Which Signals Lie

**Raw view count is not outlier signal.** A video with 2M views from a creator with 4M followers is underperforming. A video with 80K views from a creator with 12K followers is a 6.7x outlier. Always work from ratio, not raw counts. The Virlo UI and response payloads surface raw counts first; ignore them until you have the ratio.

**Follower count is not reach signal.** Large accounts have suppressed organic reach on TikTok and Instagram as platforms favor discovery over subscription. A 50K-follower creator in a niche often has more effective reach per post than a 500K-follower account in the same niche. Look at average views in the response, not follower count.

**`run_analysis: true` summary is a hypothesis, not a verdict.** The AI synthesis in the `analysis` field is a useful starting frame. It has not watched the videos. Treat it as a research brief that primes your decode pass, not as a conclusion.

---

## Ephemeral Spike vs. Repeatable Signal

Before decoding a video as a format winner, ask: is this spike tied to an external event?

Signs of an ephemeral spike (discount it):
- The video posted within 72 hours of a major product launch, news event, or trending sound.
- The creator has one outlier video in the period with the rest performing at baseline.
- The caption or title directly names a trending term that appeared in the same window.

Signs of repeatable signal (act on it):
- Two or more videos from the same creator show outlier ratios in the same time window.
- The hook mechanism and format are consistent across the outlier videos, not unique to the biggest one.
- The Interest Topic is fixed (evergreen) rather than ephemeral.

When in doubt: pull the creator's last 20 posts via the `scrape` skill and check the baseline. One spike without a second point of confirmation is not a pattern.

Note: when virlo is run inside the `shortform-idea-engine` orchestrator, the orchestrator already performs this baseline fetch systematically in Stage 1 for every creator in the ring results. The manual spike-check described here is only needed when virlo is used standalone, outside the orchestrator pipeline.

---

## Ring-by-Ring Reading

The orchestrator submits separate orbit queries for each competitor ring. Each ring has a different job in the analysis.

**Direct ring** (same product category, same audience): highest signal for format competition. Outliers here are formats that your direct competitors have validated. The risk of ignoring them is high. The risk of copying them without differentiation is also high. Use direct ring outliers to confirm format viability, not to copy verbatim.

**Indirect ring** (different product, same audience): the format goldmine. These creators are talking to your audience without competing for your buyer. Outliers here are formats your audience responds to that your direct competitors have not touched yet. This is where structural borrowing has the most upside.

**Adjacent ring** (same product category, different audience): useful for trend-spotting before a format crosses into your primary audience. Low urgency; high value when the same format appears in both adjacent and indirect rings simultaneously. That convergence is a leading indicator.

**Distant ring** (different product, different audience): treat as inspiration, not intelligence. A distant outlier tells you the format has broad appeal; it tells you nothing about whether your audience will respond. Use sparingly. Do not build creative briefs primarily from distant ring data.

---

## Stop Conditions

Do not force ideas from weak data. Stop and report the data quality problem instead.

Stop if:
- Fewer than 5 videos returned across all rings after applying the `min_views` floor. The keyword has no short-form volume. Recommend adjusting keywords or lowering the floor before re-running.
- All returned outliers are from a single creator. One creator dominating a niche is a moat signal, not a format pattern. Note it, do not generalize from it.
- All outlier videos have dates within a 5-day window and topic-match a known news event. The orbit captured a news spike, not a repeatable niche pattern. Re-run with a broader `time_period` or after the spike decays.
- The outlier ratios across the top 10 results are all below 2.5. The niche is saturated or the keywords are too broad. Narrow the keyword set and re-run.
- Orbit returns status `failed`. Do not retry more than twice; the API sometimes fails on ambiguous or very broad keyword sets. Narrow the query and resubmit.

When a stop condition is triggered, output the stop condition name, the data that triggered it, and a specific suggested correction. Do not attempt to generate video ideas from the weak data.
