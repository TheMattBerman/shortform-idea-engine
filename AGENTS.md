# Short-Form Idea Engine

A skill suite that turns competitor short-form videos into ranked, brand-fit video ideas and production-ready scripts.

---

## Bundled Skills

| Skill | Role |
|---|---|
| `shortform-idea-engine` | Orchestrator: runs the full discovery-to-script pipeline (Stage 0 through Stage 8 plus a user approval gate). |
| `video-decoder` | Decodes one short-form video into a filled Decode Record (visual hook, written hook, spoken hook, Viral Vector, Interest Topic, Format). |
| `script-writer` | Writes one production-ready script from an approved idea and brand profile. |
| `virlo` | Keyword-based outlier discovery across competitor rings via the Virlo API. |
| `scrape` | Pulls posts, transcripts, cover frames, and ad creatives from TikTok, Instagram, and YouTube via ScrapeCreators. |
| `brand-profiler` | Builds or extracts a brand profile conforming to the kit schema, through a guided interview or from an existing brand document. |

---

## Entry Point

Run the orchestrator skill to execute the full pipeline:

```
/shortform-idea-engine:shortform-idea-engine
```

The orchestrator calls `virlo`, `scrape`, `video-decoder`, and `script-writer` automatically. `video-decoder` and `script-writer` are also usable standalone (outside the orchestrator).

---

## Further Reading

- `docs/install.md`: install paths and plugin setup.
- `docs/setup.md`: required API keys, costs, and graceful-degradation behavior.

## Packaging

- Claude Code plugin manifest: `.claude-plugin/plugin.json`.
- Codex plugin manifest: `.codex-plugin/plugin.json`.
- Direct skill install fallback: `./install.sh codex` copies the six skill folders into `~/.codex/skills/`.
