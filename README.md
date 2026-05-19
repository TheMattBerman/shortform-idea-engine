# Short-Form Idea Engine

<p>
  <img src="https://img.shields.io/badge/Codex-plugin-0F766E?style=for-the-badge" alt="Codex Plugin" />
  <img src="https://img.shields.io/badge/Claude%20Code-plugin-6D28D9?style=for-the-badge" alt="Claude Code Plugin" />
  <img src="https://img.shields.io/badge/Agent-ready-F43F5E?style=for-the-badge" alt="Agent Ready" />
</p>

**An agent-native idea engine that turns competitor short-form videos into ranked, brand-fit video ideas and production-ready scripts.**

Built for Codex, Claude Code, OpenClaw-style workflows, and any agent that can read `SKILL.md` skill folders.

**Built by Matthew Berman.**

---

**Discover -> Decode -> Remix -> Rank -> Approve -> Script -> Log**

Short-Form Idea Engine automates the short-form research loop most teams still run by hand:

- **Find outliers** - Search by niche keyword or competitor handles and surface videos outperforming the creator's baseline
- **Collect receipts** - Pull transcripts, cover frames, post metadata, and raw API responses for traceability
- **Decode what works** - Extract the visual hook, written hook, spoken hook, Viral Vector, Interest Topic, and Format
- **Run a deep pass** - Analyze the strongest outliers for pacing, cut rhythm, visual retention devices, and narrative mechanics
- **Remix for the brand** - Turn borrowed mechanisms into ideas that fit your pillars, audience, proof, and anti-topics
- **Rank the slate** - Score every idea on viral potential and brand fit before anything gets scripted
- **Write the scripts** - Generate production-ready scripts only after explicit operator approval

The result: a repeatable short-form ideation system with receipts, source lineage, ranked choices, and scripts you can actually hand to a creator or editor.

---

## Why This Exists

Most short-form teams do not have an idea shortage.

They have a **pattern extraction problem**.

Competitor videos are full of useful signal, but teams usually copy the surface:

- the exact topic
- the same first line
- the same editing style
- the same promise
- the same bait

That creates derivative content and weak brand fit.

Short-Form Idea Engine does something different. It decodes the mechanism underneath the outlier, then remixes that mechanism against your brand profile. The goal is not to clone the competitor. The goal is to understand why the video worked and turn that into a new idea your brand can credibly own.

Not a prompt dump.
Not a swipe-file folder.
Not a generic script generator.

**A short-form creative operator that turns market proof into brand-fit scripts.**

---

## The 10-Second Mental Model

| Layer | Question |
|---|---|
| **Intake** | What niche, competitors, brand profile, and run folder are we using? |
| **Discovery** | Which videos are outperforming baseline? |
| **Receipts** | What transcript, cover frame, and metadata back each outlier? |
| **Decode** | What hook, format, vector, and interest topic made it work? |
| **Deep Pass** | What visual and retention mechanics are hiding in the best clips? |
| **Ideate** | How can we remix the mechanism without copying the surface? |
| **Rank** | Which ideas have the strongest viral potential and brand fit? |
| **Approve** | Which ideas does the operator actually want scripted? |
| **Script** | What should the creator say, show, and cut to? |
| **Log** | Can every claim and output trace back to raw evidence? |

The approval gate is intentional. The engine can generate a slate, but it does not script everything by default.

---

## What It Does

```text
[Discover] -> [Decode] -> [Remix] -> [Rank]
 Outliers      Hooks       Brand fit  Scored slate

[Approve]  -> [Script] -> [Log]
 Human gate   Production  Receipts
```

Every run is artifact-backed. The engine writes a local run folder with:

- `00-intake.md` - mode, inputs, key availability, run settings, and any overrides
- `01-decodes/` - one Decode Record per outlier video
- `02-ideas.md` - ranked idea table with viral potential, brand fit, combined score, and source lineage
- `03-scripts/` - one production-ready script per approved idea
- `raw/` - raw API responses used for traceability

That makes the workflow inspectable. If an idea feels weak, you can inspect the source videos. If a script borrows a hook mechanic, you can trace it back. If an API response changes, the raw receipt is still there.

---

## What Makes This Different

1. **Outlier-first discovery** - The engine starts from videos that appear to be beating the creator's baseline, not random inspiration.
2. **Mechanism before imitation** - It decodes why the video works before writing new ideas.
3. **Brand fit is a score, not a vibe** - Ideas are ranked against brand pillars, audience, credibility, and anti-topics.
4. **Approval before scripting** - The operator chooses which ideas deserve production polish.
5. **Source lineage is required** - Scripts include the borrowed elements and original source references.
6. **Agent-native packaging** - Works as a native Codex plugin, a Claude Code plugin, or direct `SKILL.md` folders.

---

## The Pipeline

### 1. Intake

The orchestrator confirms:

- run mode: keyword or handles
- brand profile path, or whether to build one
- run slug and output folder
- available API keys
- which stages can run before any paid API call happens

### 2. Discovery

Keyword mode uses `virlo` to search direct, indirect, and adjacent competitor rings. It reuses an existing matching Comet when available and fires a fresh Orbit only when no matching Comet exists.

Handle mode uses `scrape` to analyze specific competitor accounts through ScrapeCreators.

### 3. Receipts

The engine collects transcripts, cover frames, post metadata, and raw API responses for every selected outlier.

### 4. Decode

Each outlier goes through `video-decoder` and receives a filled Decode Record:

- visual hook
- written hook
- spoken hook
- root
- Viral Vector
- Interest Topic
- Format

### 5. Deep Pass

For the top 5 to 8 outliers by magnitude, the engine can run Gemini visual analysis through OpenRouter to inspect pacing, cuts, framing, visual retention devices, and beat structure.

### 6. Ideate And Rank

The engine generates 10 to 15 remixed ideas, filters against anti-topics, then ranks each idea by:

- viral potential
- brand fit
- combined score
- source-video lineage

### 7. Approve

The orchestrator presents the ranked table and waits for explicit selection. Nothing is scripted until the operator chooses which ideas to proceed with.

### 8. Script And Log

For each approved idea, `script-writer` creates:

- three-hook block: visual, written, and spoken
- beat-by-beat body
- retention marks
- CTA
- shot list
- source lineage block

The final log checks run-folder completeness and confirms factual claims trace back to raw receipts.

---

## Skills

| Skill | What It Does |
|---|---|
| `shortform-idea-engine` | Orchestrates the full discovery-to-script pipeline |
| `video-decoder` | Decodes one video into hooks, format, vector, topic, and root mechanism |
| `script-writer` | Writes production-ready short-form scripts from approved ideas |
| `virlo` | Finds keyword-based outliers across competitor rings through the Virlo API |
| `scrape` | Pulls posts, transcripts, cover frames, and ad creatives through ScrapeCreators |
| `brand-profiler` | Builds or extracts a brand profile from an interview or existing document |

---

## Quick Start

### 1. Choose An Install Path

Native Codex plugin:

```text
.codex-plugin/plugin.json
```

Claude Code plugin:

```bash
claude --plugin-dir ~/Documents/Github/shortform-idea-engine
```

Direct Codex skills install:

```bash
./install.sh codex
```

Any other `SKILL.md` agent:

```bash
./install.sh --dir /path/to/agent/skills
```

See [docs/install.md](docs/install.md) for full install details and host requirements.

### 2. Set Up API Keys

See [docs/setup.md](docs/setup.md) for required keys, costs, and graceful-degradation behavior.

The engine can use:

- Virlo for keyword outlier discovery
- ScrapeCreators for transcripts, posts, cover frames, and ads
- OpenRouter for Gemini visual analysis

### 3. Prepare A Brand Profile

Use `brand-profiler` when you need to build a brand profile from scratch. The orchestrator can also offer to build one at startup if none exists.

### 4. Start A Run

Claude Code namespaced invocation:

```text
/shortform-idea-engine:shortform-idea-engine
```

Codex or direct skills invocation:

```text
Use the shortform-idea-engine skill.
```

The orchestrator will ask for mode, inputs, brand profile, run slug, and output folder. It checks key availability before spending credits.

---

## Example Use Cases

### Creator-led brand

Analyze the top 20 competitor clips in a niche, decode which hook patterns keep showing up, and produce a ranked slate of new founder-led scripts.

### B2B SaaS

Turn competitor education clips into brand-fit scripts that preserve credibility, avoid hype, and tie every idea back to a real product belief or customer pain.

### Agency workflow

Run the engine during client research, show the ranked idea table for approval, then hand selected scripts to creators, editors, or media buyers.

### Content refresh

Use the same brand profile over time so new competitor signal becomes fresh scripts without resetting voice and positioning each run.

---

## Host Requirements

The host agent needs to be able to:

- run shell commands
- read and write files
- resolve sibling skills by name
- make outbound web requests

An agent missing outbound web requests can still read and edit the kit, but live discovery and visual analysis will not complete.

---

## Project Structure

```text
.
|-- .claude-plugin/
|   `-- plugin.json
|-- .codex-plugin/
|   `-- plugin.json
|-- docs/
|   |-- install.md
|   `-- setup.md
|-- skills/
|   |-- brand-profiler/
|   |-- scrape/
|   |-- script-writer/
|   |-- shortform-idea-engine/
|   |-- video-decoder/
|   `-- virlo/
|-- AGENTS.md
|-- install.sh
`-- README.md
```

---

## Honest Limits

- Keyword discovery depends on Virlo availability and coverage.
- Transcript and cover-frame quality depend on ScrapeCreators responses.
- Deep visual analysis requires an OpenRouter key with access to Gemini visual models.
- The engine ranks and scripts ideas, but the operator still decides what is on-brand enough to produce.
- The kit produces production-ready scripts, not final edited videos.

---

## The Principle

Great short-form work does not come from copying the winning post.

It comes from understanding the mechanism, filtering it through a real brand, and producing a new idea with enough proof, tension, and specificity to stand on its own.
