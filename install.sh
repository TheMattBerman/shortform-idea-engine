#!/usr/bin/env bash
# install.sh - install the Short-Form Idea Engine skills into an agent's skills directory.
# Usage:
#   ./install.sh codex            install into ~/.codex/skills/
#   ./install.sh claude           install into ~/.claude/skills/
#   ./install.sh --dir <path>     install into an explicit skills directory
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO_DIR/skills"

usage() {
  echo "Usage: ./install.sh [codex|claude|--dir <path>]"
  echo "  codex         install into ~/.codex/skills/"
  echo "  claude        install into ~/.claude/skills/"
  echo "  --dir <path>  install into an explicit skills directory"
}

case "${1:-}" in
  codex)  DEST="$HOME/.codex/skills" ;;
  claude) DEST="$HOME/.claude/skills" ;;
  --dir)
    DEST="${2:-}"
    if [ -z "$DEST" ]; then
      echo "Error: --dir requires a path."
      usage
      exit 1
    fi
    ;;
  *)
    usage
    exit 1
    ;;
esac

mkdir -p "$DEST"
for skill in "$SRC"/*/; do
  name="$(basename "$skill")"
  rm -rf "$DEST/$name"
  cp -R "${skill%/}" "$DEST/$name"
done

echo "Installed Short-Form Idea Engine skills into $DEST:"
ls -1 "$DEST"
echo
echo "Restart your agent to pick up the new skills."
