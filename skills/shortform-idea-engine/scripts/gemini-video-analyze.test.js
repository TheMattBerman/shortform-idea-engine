import { test } from "node:test";
import assert from "node:assert";
import { analyzeVideo } from "./gemini-video-analyze.js";

test("throws when videoUrl is missing", async () => {
  await assert.rejects(
    () => analyzeVideo({ prompt: "describe", apiKey: "k" }),
    /videoUrl is required/
  );
});

test("throws when prompt is missing", async () => {
  await assert.rejects(
    () => analyzeVideo({ videoUrl: "https://x/v.mp4", apiKey: "k" }),
    /prompt is required/
  );
});

test("throws when apiKey is missing", async () => {
  await assert.rejects(
    () => analyzeVideo({ videoUrl: "https://x/v.mp4", prompt: "describe" }),
    /apiKey is required/
  );
});

test("returns message content on a successful response", async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: "analysis text" } }],
    }),
  });
  const out = await analyzeVideo({
    videoUrl: "https://x/v.mp4",
    prompt: "describe",
    apiKey: "k",
    fetchImpl: mockFetch,
  });
  assert.strictEqual(out, "analysis text");
});

test("throws with status and body on a non-ok response", async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 429,
    text: async () => "rate limited",
  });
  await assert.rejects(
    () =>
      analyzeVideo({
        videoUrl: "https://x/v.mp4",
        prompt: "describe",
        apiKey: "k",
        fetchImpl: mockFetch,
      }),
    /OpenRouter HTTP 429: rate limited/
  );
});

test("throws when the response has no content", async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => ({ choices: [] }),
  });
  await assert.rejects(
    () =>
      analyzeVideo({
        videoUrl: "https://x/v.mp4",
        prompt: "describe",
        apiKey: "k",
        fetchImpl: mockFetch,
      }),
    /no content/
  );
});
