# Claude Code Agent Instructions

This repository is governed by the unified AI agent rules defined in **[AGENTS.md](file:///home/richard/Projects/Ongoing/New/rz-ci/AGENTS.md)**.

### Quick Rules for Claude Code:
1. **Always read `design/DESIGN.md` first** before implementing or reviewing code.
2. **Work exclusively in an isolated Git worktree** (`git worktree add ../rz-<name> -b feat/<name> origin/feat/atlus-menu`).
3. **Never touch `src/` or `design/` unless explicitly instructed**.
4. **Never push to `main` and never merge PRs**. Always open a PR against `feat/atlus-menu`.
5. **Follow the §10 visual review loop**: capture screenshots at `1440×900` and `390×844`, verify against `design/refs/`, iterate and fix.
6. Verify quality gates before pushing: `npm run build`, `npm run test:security`, `npm run test:e2e`.

Refer to [AGENTS.md](file:///home/richard/Projects/Ongoing/New/rz-ci/AGENTS.md) and [docs/ARCHITECTURE.md](file:///home/richard/Projects/Ongoing/New/rz-ci/docs/ARCHITECTURE.md) for complete details.
