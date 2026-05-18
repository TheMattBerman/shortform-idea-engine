# Reading ScrapeCreators Output

Operator judgment layer for ScrapeCreators data. Use this alongside `scrapecreators-endpoints.md` (mechanics) to decide what the data actually tells you.

---

## Transcript Reliability by Platform

### YouTube
Most reliable. YouTube captions exist on the majority of videos with speech, either as manually uploaded SRT files or auto-generated captions from YouTube's own speech-to-text. Expect a transcript on any video over ~60 seconds that has spoken audio. An empty transcript means the creator explicitly disabled captions, the video has no speech (music, nature footage, silent demo), or it is private/age-gated. Empty is informative: no speech means the hook and retention are entirely visual, which matters for your analysis.

### TikTok
Moderately reliable. ScrapeCreators generates TikTok transcripts via speech-to-text on the fly, so the result depends on audio quality, accent, and video length. Short clips under 15 seconds often return empty or a single fragmented sentence. Background music layered over speech produces noisy, partial output. Expect gaps in slang-heavy or fast-paced delivery. A transcript with gaps is still useful for hook identification: the first 2-3 lines are usually the cleanest because creators pause there for the hook.

### Instagram
Least reliable of the three. The `/v2/instagram/media/transcript` endpoint runs AI transcription, which takes 10-30 seconds per request. Reels under 10 seconds frequently return empty. Caption-style videos where text is overlaid but there is no voiceover will always return empty. When a transcript is present it is usually accurate enough to pull hooks, but treat timing data as approximate. Empty transcript on Instagram does not mean the content is low-value: a lot of high-performing Reels are visual or music-driven with no speech.

### What an Empty Transcript Means (Across Platforms)
Do not discard the video. Empty transcript tells you: the hook is visual or sound-design-driven, the creator is relying on pattern interrupts, captions, or text overlays rather than speech. Use the video URL to pass directly to Gemini for visual analysis instead.

---

## Cover Frames

### YouTube
YouTube thumbnails are always available via the standard CDN pattern. No authentication needed, no API call required:

- Standard quality (always available): `https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg`
- High resolution (available on most modern uploads): `https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg`

Use `maxresdefault.jpg` first. If it returns a 404 or a black placeholder, fall back to `hqdefault.jpg`. The video ID is the `v=` parameter in any YouTube URL.

### TikTok
The profile videos endpoint (`GET /v3/tiktok/profile/videos`) and the video info endpoint (`GET /v2/tiktok/video`) both include a thumbnail URL field in the response. Extract it directly from the response JSON. Do not try to construct it from the video ID.

### Instagram
The profile posts (`GET /v2/instagram/user/posts`) and profile reels (`GET /v1/instagram/user/reels`) responses include media URLs. The first image in the media array for a video post is the cover frame. For Reels specifically, the cover frame is the poster image Instagram renders before playback.

---

## Resolving a Direct Media URL for Video

The orchestrator needs a direct video URL (not a platform page URL) to pass to Gemini for visual analysis.

### TikTok
Use `GET /v2/tiktok/video` with the post URL. The response includes a direct CDN media URL for the video file. This is the URL to pass to Gemini.

Critical: TikTok CDN URLs expire. They are valid for a short window after fetching (typically minutes to a few hours). Fetch the media URL and pass it to Gemini in the same run. Do not store CDN URLs for later reuse.

### YouTube
Pass the YouTube watch URL directly to Gemini. YouTube URLs do not expire. No resolution step needed.

### Instagram
The profile posts and reels responses include media URLs. For video posts, the video URL is in the response. Same expiry caveat as TikTok: use Instagram media URLs promptly within the same run.

---

## Public Comments: Directional vs. Reliable

ScrapeCreators exposes public comments for TikTok (`GET /v1/tiktok/video/comments`) and YouTube (`GET /v1/youtube/video/comments`). Both are documented in `scrapecreators-endpoints.md`. The signal quality depends on what you are trying to learn.

**Use comments as directional signal for:**
- Identifying the specific claim or moment that resonated (people quote the line they react to)
- Spotting objections ("but what about..." comments cluster around the weakest point)
- Reading emotional tone: whether the audience is entertained, skeptical, or inspired

**Do not treat comments as reliable for:**
- Demographic inference: who comments is not who watches
- Counting sentiment: bots, reply chains, and brand accounts inflate positive ratios
- Trend validation: viral comment threads are often driven by a single pinned response or creator reply, not organic opinion

A video with few comments but very high saves (TikTok bookmark data from the video info endpoint) is often more valuable as a swipe-file reference than a high-comment video: saves mean people intend to use the content, comments mean it provoked a reaction. Both are useful, but saves signal practical utility.

For ad creative research via the Meta Ad Library endpoints, comments are not available. The primary proxy for performance is the `is_active` field in the response: an ad still marked active is being funded right now, which is the strongest single signal the data can give you. The response schema does not expose a `start_date`, so you cannot compute exact run duration from a single API call. To estimate how long an ad has been running, you need repeated scrapes over time and comparison of which ad IDs persist across runs. The directional principle still holds: an ad that appears active across multiple scrapes spaced days or weeks apart is almost certainly profitable. A single active snapshot is a weak signal; persistence across scrapes is a strong one.
