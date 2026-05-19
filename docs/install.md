# Installation Guide

This guide covers the three ways to run the Short-Form Idea Engine: as a Claude Code plugin, on Codex CLI, and on any other agent that loads SKILL.md-format skill folders.

After installing, complete the API key setup in [docs/setup.md](setup.md) before running the pipeline.

---

## Claude Code (plugin)

Run Claude Code from any directory and point it at the repo:

```bash
claude --plugin-dir ~/Documents/Github/shortform-idea-engine
```

Skills are namespaced under the plugin directory name. Invoke the orchestrator with:

```
/shortform-idea-engine:shortform-idea-engine
```

No copy step is needed. Claude Code reads the skills directly from the repo directory.

---

## Codex CLI

Run the install script from the repo root:

```bash
./install.sh codex
```

This copies the six skill folders into `~/.codex/skills/`. Then restart Codex. The skills are available by name without a namespace prefix once Codex picks them up.

---

## Any other agent

Run the install script with the `--dir` flag, passing the path to that agent's skills directory:

```bash
./install.sh --dir /path/to/agent/skills
```

The script copies each of the six skill folders into the target directory and prints a confirmation list. Restart the agent afterward to pick up the new skills.

---

## Host requirements

The skills assume the host agent can do the following:

- **Run shell commands (bash).** Several pipeline stages invoke bash scripts and Node.js helpers bundled in the repo.
- **Read and write files.** The pipeline writes Decode Records, ranked idea tables, scripts, and raw API responses to a run folder.
- **Invoke sibling skills by name.** The orchestrator calls `video-decoder`, `script-writer`, `virlo`, `scrape`, and `brand-profiler` by name during the pipeline. The host must resolve these within the same install.
- **Make outbound web requests.** The pipeline calls three external APIs: Virlo (keyword discovery), ScrapeCreators (transcripts and cover frames), and OpenRouter (Gemini visual analysis). The host must be able to reach these endpoints.

An agent missing any of these capabilities cannot run the full pipeline. Agents that lack outbound web requests can still read and modify the skill files, but no live run will complete.
