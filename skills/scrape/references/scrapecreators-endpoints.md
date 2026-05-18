# ScrapeCreators API Reference

Complete endpoint documentation for the ScrapeCreators API.

## Base Configuration

| Setting | Value |
|---------|-------|
| Base URL | `https://api.scrapecreators.com` |
| Auth Header | `x-api-key: YOUR_API_KEY` |
| Response Format | JSON |
| Rate Limits | None (credit-based) |

## Authentication

All requests require the `x-api-key` header:

```bash
curl -s "https://api.scrapecreators.com/v1/..." \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

---

## YouTube Endpoints

### Video Transcript
Get the transcript/captions from a YouTube video.

| | |
|---|---|
| **Endpoint** | `GET /v1/youtube/video/transcript` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Full YouTube video URL |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/youtube/video/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response Schema:**
```json
{
  "transcript": [
    {
      "text": "Segment text here",
      "startMs": 0,
      "endMs": 5000,
      "startTimeText": "0:00"
    }
  ],
  "transcript_only_text": "Full transcript as plain text..."
}
```

**Notes:**
- Only works for videos with captions (auto-generated or manual)
- Videos without audio or with disabled transcripts will return empty

---

## TikTok Endpoints

### Profile
Get TikTok user profile information.

| | |
|---|---|
| **Endpoint** | `GET /v1/tiktok/profile` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes | TikTok username (without @) |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/tiktok/profile?handle=garyvee" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response includes:** username, display name, bio, follower/following counts, verified status, profile image URL.

---

### Profile Videos
Get videos from a TikTok profile.

| | |
|---|---|
| **Endpoint** | `GET /v1/tiktok/profile/videos` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes | TikTok username |
| `cursor` | No | Pagination cursor from previous response |
| `sort_by` | No | `popular` for top videos (default: recent) |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/tiktok/profile/videos?handle=garyvee&sort_by=popular" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response includes:** array of videos with id, description, stats (views, likes, comments, shares), thumbnail URL, video URL.

---

### Video Info
Get details for a specific TikTok video.

| | |
|---|---|
| **Endpoint** | `GET /v1/tiktok/video` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `url` | Yes | TikTok video URL |

---

### Video Transcript
Get transcript from a TikTok video.

| | |
|---|---|
| **Endpoint** | `GET /v1/tiktok/transcript` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `url` | Yes | TikTok video URL |

---

## Instagram Endpoints

### Profile
Get Instagram profile information.

| | |
|---|---|
| **Endpoint** | `GET /v1/instagram/profile` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes* | Instagram username |
| `user_id` | Yes* | Instagram user ID (faster) |

*One of `handle` or `user_id` required.

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/instagram/profile?handle=alexhormozi" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response includes:** username, full name, bio, follower/following counts, post count, profile pic URL, external URL.

---

### Profile Posts
Get posts from an Instagram profile.

| | |
|---|---|
| **Endpoint** | `GET /v1/instagram/profile/posts` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes* | Instagram username |
| `user_id` | Yes* | Instagram user ID (faster) |
| `cursor` | No | Pagination cursor |

**Response includes:** array of posts with id, caption, media URLs, like count, comment count, timestamp.

---

### Profile Reels
Get reels from an Instagram profile.

| | |
|---|---|
| **Endpoint** | `GET /v1/instagram/profile/reels` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes* | Instagram username |
| `user_id` | Yes* | Instagram user ID |
| `cursor` | No | Pagination cursor |

---

### Post/Reel Transcript
Get AI-generated transcript from Instagram video content.

| | |
|---|---|
| **Endpoint** | `GET /v1/instagram/post/transcript` |
| **Credits** | 1+ |
| **Time** | 10-30 seconds (AI processing) |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Instagram post/reel URL |

---

## Twitter/X Endpoints

### Profile
Get Twitter profile information.

| | |
|---|---|
| **Endpoint** | `GET /v1/twitter/profile` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `handle` | Yes | Twitter username (without @) |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/twitter/profile?handle=elonmusk" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response includes:** username, display name, bio, follower/following counts, verified status, profile image, banner image.

**Limitation:** Twitter only shows ~100 most recent tweets publicly.

---

## Meta Ad Library Endpoints

### Company Ads
Get ads for a specific company/brand.

| | |
|---|---|
| **Endpoint** | `GET /v1/facebook/adLibrary/company/ads` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `companyName` | Yes | Facebook Page name |
| `country` | No | Country code (e.g., "US") |
| `trim` | No | `true` for smaller response |
| `cursor` | No | Pagination cursor |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/facebook/adLibrary/company/ads?companyName=lululemon&country=US&trim=true" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

**Response Schema:**
```json
{
  "results": [
    {
      "ad_archive_id": "123456789",
      "end_date": 1704067200,
      "is_active": true,
      "page_id": "12345",
      "page_name": "lululemon",
      "snapshot": {
        "body": { "text": "Ad copy here..." },
        "cards": [
          {
            "cta_text": "Shop Now",
            "link_url": "https://...",
            "original_image_url": "https://...",
            "title": "Headline"
          }
        ]
      }
    }
  ],
  "searchResultsCount": 150,
  "cursor": "next_page_cursor..."
}
```

---

### Search Ads
Search ads by keyword across the Ad Library.

| | |
|---|---|
| **Endpoint** | `GET /v1/facebook/adLibrary/search/ads` |
| **Credits** | 1 |

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `query` | Yes | Search keyword |
| `country` | No | Country code |
| `ad_type` | No | Filter by ad type |
| `status` | No | `active` or `inactive` |
| `start_date` | No | Filter by start date |
| `end_date` | No | Filter by end date |
| `cursor` | No | Pagination cursor |

**Example Request:**
```bash
curl -s "https://api.scrapecreators.com/v1/facebook/adLibrary/search/ads?query=running%20shoes&country=US" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

---

## Pagination

Most list endpoints support cursor-based pagination:

1. First request returns data + `cursor` field
2. Pass `cursor` to next request for more results
3. Empty/null cursor means no more results

**Example:**
```bash
# First page
curl -s "https://api.scrapecreators.com/v1/tiktok/profile/videos?handle=garyvee" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"

# Response includes: "cursor": "abc123..."

# Next page
curl -s "https://api.scrapecreators.com/v1/tiktok/profile/videos?handle=garyvee&cursor=abc123" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

---

## Credit Costs

| Cost | Endpoints |
|------|-----------|
| **1 credit** | Most endpoints (profile, posts, videos, ads, transcripts) |
| **26 credits** | TikTok Audience Demographics |
| **Variable** | Some bulk/convenience endpoints |

Check endpoint documentation or response headers for exact costs.

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Verify API key |
| 404 | Not Found | Target doesn't exist or is private |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Retry or contact support |

---

## Additional Endpoints

ScrapeCreators also provides endpoints for:

- **LinkedIn**: Profiles, company pages, ad library
- **Reddit**: Subreddits, posts, comments
- **Pinterest**: Boards, pins
- **Threads**: Profiles, posts
- **Facebook**: Pages, posts, comments
- **Bluesky**: Profiles, posts

See full documentation at [docs.scrapecreators.com](https://docs.scrapecreators.com)
