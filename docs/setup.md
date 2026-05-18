# Setup Guide

This kit requires three API keys. One is required to run at all; the other two unlock additional modes and depth.

---

## API Keys

### ScrapeCreators (required)

**What it does:** Pulls post data, transcripts, and cover frames from TikTok, Instagram, and YouTube. Every mode of the engine depends on it.

**Where to get it:** Sign up at [app.scrapecreators.com](https://app.scrapecreators.com). You receive 100 free credits on signup. Most endpoints cost 1 credit per request.

**Cost:** Credit-based. Check your balance at [app.scrapecreators.com](https://app.scrapecreators.com). The notable exception is TikTok Audience Demographics (26 credits); standard post, transcript, and profile calls are 1 credit each.

**If missing:** The engine cannot run. It will stop at Stage 0 and tell you plainly.

---

### Virlo (optional, enables keyword mode)

**What it does:** Discovers outlier short-form creators and videos by niche keyword across TikTok, Instagram, and YouTube. Required for keyword mode. Not required for handles mode.

**Where to get it:** Create an account at [dev.virlo.ai](https://dev.virlo.ai/docs). Keys are prefixed `virlo_tkn_...`.

**Cost:** Prepaid credit balance. Each orbit (keyword discovery job) costs $0.50 and deducts from your balance. Polling and result retrieval are free. A run across three competitor rings costs $1.50. A $5 minimum deposit is required to fund the account.

**If missing:** Keyword mode is disabled. Handles mode still works. The engine reports which modes are available before spending any credits.

---

### OpenRouter (optional, enables deep visual analysis)

**What it does:** Powers the Gemini visual analysis pass (Stage 4) that adds pacing, cut rhythm, and visual style notes to the top decoded videos. Without it, all decodes are shallow (transcript and hook only).

**Where to get it:** Sign up at [openrouter.ai](https://openrouter.ai). Generate an API key from the dashboard.

**Cost:** Per-token usage billed to your OpenRouter balance. The Gemini model used is specified in `scripts/gemini-video-analyze.js`. Check [openrouter.ai/models](https://openrouter.ai/models) for current pricing.

**If missing:** Stage 4 is skipped entirely. All decodes remain shallow. Each idea in the ranked output is flagged "shallow-decoded" in the rationale column.

---

## Providing the Keys

Create a `.env` file in your working directory (the directory you run Claude Code from):

```
OPENROUTER_API_KEY=sk-or-...
VIRLO_API_KEY=virlo_tkn_...
SCRAPECREATORS_API_KEY=...
```

The orchestrator sources this file at Stage 0:

```bash
source .env
```

Key lookup details by skill:

- **`virlo` skill:** reads `$VIRLO_API_KEY` from the environment. Passed via `Authorization: Bearer $VIRLO_API_KEY` on every Virlo API call.
- **`scrape` skill:** reads `$SCRAPECREATORS_API_KEY` from the environment. Passed via the `x-api-key` header on every ScrapeCreators API call.
- **Gemini helper (`scripts/gemini-video-analyze.js`):** reads `$OPENROUTER_API_KEY` from the environment. The orchestrator also passes it inline as `OPENROUTER_API_KEY=<key> node scripts/gemini-video-analyze.js ...` so the variable is available even if not exported.

---

## Graceful Degradation Summary

| Missing key | Effect |
|---|---|
| `SCRAPECREATORS_API_KEY` | Engine stops at Stage 0. Cannot run in any mode. |
| `VIRLO_API_KEY` | Keyword mode disabled. Handles mode works normally. |
| `OPENROUTER_API_KEY` | Stage 4 deep pass skipped. All decodes are shallow. Ideas are flagged "shallow-decoded" in ranked output. |
