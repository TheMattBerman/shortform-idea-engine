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

import { readFileSync } from "node:fs";
import { join } from "node:path";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

// Resolve OPENROUTER_API_KEY: prefer the process env, fall back to a .env file
// in `dir`. Zero-dependency, minimal .env parsing (KEY=value lines).
export function loadEnvKey(dir = process.cwd(), env = process.env) {
  if (env.OPENROUTER_API_KEY) return env.OPENROUTER_API_KEY;
  let text;
  try {
    text = readFileSync(join(dir, ".env"), "utf8");
  } catch {
    return undefined;
  }
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq).trim() === "OPENROUTER_API_KEY") {
      return trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

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
    apiKey: loadEnvKey(),
  })
    .then((out) => console.log(out))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
