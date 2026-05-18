---
name: scrape
description: "Pull content from ScrapeCreators API for analysis, swipe files, or automation input. Supports YouTube transcripts, social media posts, ad creatives, and profile data. Triggers on: scrape transcript, scrape posts, scrape ads, scrape profile, get transcript, pull ads, grab posts."
---

# Scrape

Pull content from social platforms via ScrapeCreators API.

## Invocation

```
/scrape [type] [target]
```

### Types

| Type | Target | Example |
|------|--------|---------|
| `transcript` | YouTube URL | `/scrape transcript https://youtube.com/watch?v=abc123` |
| `posts` | handle + platform | `/scrape posts @garyvee tiktok` |
| `ads` | brand name or URL | `/scrape ads lululemon` |
| `profile` | handle + platform | `/scrape profile @alexhormozi instagram` |

### Supported Platforms
- **transcript**: YouTube only
- **posts/profile**: TikTok, Instagram, Twitter/X
- **ads**: Meta Ad Library (Facebook/Instagram ads)

## Arguments

| Flag | Description | Default |
|------|-------------|---------|
| `--raw` | Output raw JSON instead of formatted markdown | false |
| `--analyze` | Run through relevant analysis skill after scraping | false |
| `--limit [n]` | Number of items to fetch | 10 |
| `--output [path]` | Override default output location | (see routing) |
| `--newsletter` | Route transcripts to `08-newsletter/research/` | false |

## Output Routing

| Type | Default Location | Notes |
|------|-----------------|-------|
| Transcripts | `03-resources/` | `--newsletter` sends to `08-newsletter/research/` |
| Posts | `09-swipe-files/hooks/` | Organized by platform |
| Ads | `09-swipe-files/ads/` | Organized by brand |
| Profiles | `03-resources/` | Creator research |

## Workflow

### 1. Load API Key
```bash
source 04-claude-code/config/.env
```

Verify `SCRAPECREATORS_API_KEY` is set before proceeding.

### 2. Make API Request

All requests use curl with the `x-api-key` header:

```bash
curl -s "https://api.scrapecreators.com/v1/[endpoint]" \
  -H "x-api-key: $SCRAPECREATORS_API_KEY"
```

See **references/scrapecreators-endpoints.md** for full endpoint documentation.

### 3. Parse Response

Extract relevant fields from JSON response based on content type.

### 4. Format Output

Unless `--raw` is specified, format as markdown with frontmatter.

### 5. Save to Location

Save to appropriate directory based on routing rules (or `--output` override).

### 6. Optional Analysis

If `--analyze` flag is present:
- Posts → run through hook analysis
- Ads → run through `/image-breakdown`
- Transcripts → summarize key points

---

## Output Formats

### Transcript Output

```markdown
---
source: youtube
video_url: https://youtube.com/watch?v=abc123
title: "Video Title Here"
channel: Channel Name
scraped: 2025-01-15
---

# Transcript: Video Title Here

[00:00] First segment of transcript text here...

[00:15] Next segment continues...

[01:30] And so on with timestamps...
```

### Posts Output

```markdown
---
platform: tiktok
handle: @username
post_id: 1234567890
scraped: 2025-01-15
views: 1.2M
likes: 150K
comments: 3.2K
---

# Post by @username

[Post caption/content here]

## Media
![Video Thumbnail](thumbnail_url)

## Hook Analysis
- Opening line: "..."
- Hook type: curiosity/controversy/value/etc
```

### Ads Output

```markdown
---
brand: lululemon
platform: meta
ad_id: 123456789
status: active
start_date: 2025-01-01
scraped: 2025-01-15
---

# Ad: lululemon

## Copy
[Primary ad text/body copy]

## Headline
[Ad headline if present]

## Creative
![Ad Creative](image_url)

## CTA
Shop Now → https://lululemon.com/landing

## Targeting Notes
- Country: US
- Category: [if available]
```

### Profile Output

```markdown
---
platform: instagram
handle: @alexhormozi
user_id: 123456789
scraped: 2025-01-15
---

# Profile: @alexhormozi

## Bio
[Bio text here]

## Stats
- Followers: 2.5M
- Following: 150
- Posts: 1,200

## Links
- Website: https://...

## Recent Content Themes
[If --analyze: brief analysis of content patterns]
```

---

## Examples

### Get YouTube Transcript
```
/scrape transcript https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Get TikTok Posts with Analysis
```
/scrape posts @garyvee tiktok --limit 20 --analyze
```

### Pull Competitor Ads
```
/scrape ads "gymshark" --limit 50
```

### Research Creator Profile
```
/scrape profile @alexhormozi instagram --analyze
```

### Get Transcript for Newsletter Research
```
/scrape transcript https://youtube.com/watch?v=abc123 --newsletter
```

---

## Setup

### Getting Your API Key

1. Go to [app.scrapecreators.com](https://app.scrapecreators.com)
2. Sign up for an account (100 free credits to start)
3. Copy your API key from the dashboard

### Configure Environment

1. Copy the example config:
   ```bash
   cp 04-claude-code/config/.env.example 04-claude-code/config/.env
   ```

2. Add your API key:
   ```
   SCRAPECREATORS_API_KEY=your_actual_key_here
   ```

3. Verify setup:
   ```bash
   source 04-claude-code/config/.env && echo "Key loaded: ${SCRAPECREATORS_API_KEY:0:10}..."
   ```

---

## API Reference

Load **references/scrapecreators-endpoints.md** for complete endpoint documentation including:
- All available endpoints
- Request parameters
- Response schemas
- Credit costs
- Pagination handling

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/missing API key | Check `.env` file |
| 404 Not Found | Invalid handle/URL | Verify target exists |
| 429 Rate Limited | Too many requests | Wait and retry |
| Empty response | Private account or no content | Try different target |

---

## Credits & Costs

Most ScrapeCreators endpoints cost **1 credit per request**. Notable exceptions:
- Audience demographics: 26 credits
- Some bulk endpoints may vary

Check your balance at [app.scrapecreators.com](https://app.scrapecreators.com).

---

## Integration with Other Skills

| Skill | Integration |
|-------|-------------|
| `/ad-teardown` | Use scraped ads as input |
| `/image-breakdown` | Analyze ad creatives |
| `/positioning-angles` | Research competitor positioning |
| `/content-atomizer` | Repurpose scraped transcripts |
| `/direct-response-copy` | Swipe file reference |
