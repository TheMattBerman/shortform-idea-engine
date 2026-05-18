// gemini-video-analyze.js
// Zero-dependency OpenRouter -> Gemini Flash video-analysis helper.
// Requires Node 18+ (built-in fetch).
//
// Library use:  import { analyzeVideo } from "./gemini-video-analyze.js";
// CLI use:      OPENROUTER_API_KEY=... node gemini-video-analyze.js <videoUrl> <prompt...>
//
// Note: google/gemini-3-flash is not yet publicly available on OpenRouter.
// The current model slug is google/gemini-3-flash-preview (as of 2026-05-18).
// Confirmed via OpenRouter /api/v1/models endpoint.
// The video_url content-part shape is confirmed by OpenRouter docs:
//   { type: "video_url", video_url: { url } }

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

export async function analyzeVideo({ videoUrl, prompt, apiKey, fetchImpl = fetch }) {
  if (!videoUrl) throw new Error("videoUrl is required");
  if (!prompt) throw new Error("prompt is required");
  if (!apiKey) throw new Error("apiKey is required");

  const body = {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "video_url", video_url: { url: videoUrl } },
        ],
      },
    ],
  };

  const res = await fetchImpl(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no content");
  return content;
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , videoUrl, ...promptParts] = process.argv;
  analyzeVideo({
    videoUrl,
    prompt: promptParts.join(" "),
    apiKey: process.env.OPENROUTER_API_KEY,
  })
    .then((out) => console.log(out))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
