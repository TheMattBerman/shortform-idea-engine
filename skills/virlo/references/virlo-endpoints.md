# Virlo Endpoints (Mechanics Layer)

Deterministic reference for the calls the `virlo` skill actually makes: keyword discovery to ranked outliers. Nothing else is documented here.

Official docs: https://dev.virlo.ai/docs

---

## Auth

All requests use:

```
Authorization: Bearer $VIRLO_API_KEY
```

Key is read from environment: `$VIRLO_API_KEY` (prefix: `virlo_tkn_...`).

Base URL: `https://api.virlo.ai`

---

## Orbit: Keyword-to-Outliers Flow

Orbit is async. Three phases: submit, poll, retrieve.

### Phase 1: Submit a ring query

```
POST /v1/orbit
Content-Type: application/json
```

**Cost:** $0.50 per submission.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | Human-readable label (e.g. `"direct ring -- ai tools"`) |
| `keywords` | array | Yes | 1-10 keyword strings |
| `time_period` | string | Yes | `today`, `this_week`, `this_month`, `this_year` |
| `platforms` | array | No | Any of `youtube`, `tiktok`, `instagram`; omit for all |
| `min_views` | integer | No | View floor |
| `run_analysis` | boolean | No | Enables AI synthesis field on the job; worth including |
| `intent` | string | No | Freeform goal; improves AI synthesis quality |

**Response:**

```json
{ "orbit_id": "orb_abc123", "status": "queued" }
```

**Example:**

```bash
curl -s -X POST https://api.virlo.ai/v1/orbit \
  -H "Authorization: Bearer $VIRLO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "direct ring -- ai productivity tools",
    "keywords": ["AI productivity tools", "best AI tools 2024"],
    "time_period": "this_month",
    "platforms": ["tiktok", "instagram", "youtube"],
    "min_views": 5000,
    "run_analysis": true,
    "intent": "Find direct competitors beating their own baseline in ai-tools niche"
  }'
```

### Phase 2: Poll status

```
GET /v1/orbit/:orbit_id
```

**Cost:** Free.

Returns the job object. Check `status` field:

- `queued` or `processing`: not ready, poll again.
- `completed`: proceed to retrieval.
- `failed`: terminal state. Do not retry more than twice; the job will not recover on its own. See the stop conditions in `reading-virlo.md` for guidance on narrowing the query and resubmitting.

Poll cadence: start at 10s, back off to 30s. Typical completion: 1-5 minutes.

The poll call returns the full orbit object. When `run_analysis: true` was set on submission, the `analysis` field (AI synthesis markdown) is present in this same response object once the job reaches `completed`. There is no separate endpoint for it.

```bash
curl -s "https://api.virlo.ai/v1/orbit/orb_abc123" \
  -H "Authorization: Bearer $VIRLO_API_KEY" | jq '.status'
```

### Phase 3: Retrieve outliers and videos

Two calls, both free.

**Outlier creators** (primary signal for ring analysis):

```
GET /v1/orbit/:orbit_id/creators/outliers
```

Useful query params:

| Param | Default | Notes |
|---|---|---|
| `order_by` | `outlier_ratio` | Also: `avg_views`, `follower_count`, `weighted_score` |
| `sort` | `desc` | |
| `limit` | 50 | |
| `platform` | all | Filter to one platform |

**Videos** (for content pattern inspection):

```
GET /v1/orbit/:orbit_id/videos
```

Useful query params: `order_by` (`views`, `likes`, `publish_date`), `sort`, `limit`, `page`, `min_views`, `platforms`, `start_date`, `end_date`.

---

## Orbit Concurrency Cap

Virlo caps concurrent orbit submissions at **2 active jobs at a time**.

When running multiple ring queries (direct, indirect, adjacent), submit them **sequentially**: submit one, poll until `completed`, then submit the next. Do not fire all three at once. If a submission returns 429 or a concurrent-jobs error, wait and retry with exponential backoff starting at 15s.

---

## Gotchas

**Concurrency cap is 2 concurrent orbits.** Three ring queries submitted simultaneously will fail or queue-fail on the third. Submit sequentially.

**POST `/v1/tracking/creators` body uses `url`, not `handle`.** This endpoint is outside the discovery flow but appears nearby in docs. If you ever extend to creator tracking, the body key is `url` (full profile URL), not `handle` or `username`.

**HTTP 400 "Failed to create tracked creator" is idempotency, not a schema error.** On the tracking endpoint, this 400 means the creator is already tracked. It is not a bad-request; treat it as a no-op and continue.

**Handle case is not normalized.** `NanoTools` and `nanotools` register as two separate tracked creators. Always normalize to lowercase before submitting any handle to tracking endpoints.

**Virlo runs on a prepaid credit balance.** Each orbit submission costs $0.50 and deducts from the balance; polling and retrieval are free. Running four ring queries costs $2.00. A $5 minimum deposit is required to fund the account. Do not run exploratory rings speculatively.

---

## Error Codes

| Code | Meaning | Action |
|---|---|---|
| 400 | Invalid parameters (or idempotency on tracking) | Check body schema; if tracking, treat as no-op |
| 401 | Missing or invalid bearer token | Re-source env, check key prefix |
| 402 | Insufficient credit balance | Top up via dashboard at dev.virlo.ai |
| 429 | Rate limited or concurrency exceeded | Back off, retry with exponential delay |
