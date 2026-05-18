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

test("loadEnvKey reads OPENROUTER_API_KEY from a .env file when the env var is unset", async () => {
  const { loadEnvKey } = await import("./gemini-video-analyze.js");
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sfie-"));
  fs.writeFileSync(path.join(dir, ".env"), 'OPENROUTER_API_KEY=from-dotenv\nOTHER=x\n');
  const key = loadEnvKey(dir, {});
  assert.strictEqual(key, "from-dotenv");
});

test("loadEnvKey prefers an already-set env var over the .env file", async () => {
  const { loadEnvKey } = await import("./gemini-video-analyze.js");
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sfie-"));
  fs.writeFileSync(path.join(dir, ".env"), 'OPENROUTER_API_KEY=from-dotenv\n');
  const key = loadEnvKey(dir, { OPENROUTER_API_KEY: "from-env" });
  assert.strictEqual(key, "from-env");
});

test("loadEnvKey returns undefined when neither source has the key", async () => {
  const { loadEnvKey } = await import("./gemini-video-analyze.js");
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sfie-"));
  const key = loadEnvKey(dir, {});
  assert.strictEqual(key, undefined);
});
