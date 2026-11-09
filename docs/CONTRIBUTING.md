# Contributing Guide

Guidelines and standard workflows for contributing to `richardzuikov.com`.

---

## 1. Development Principles

- **Design First**: Every visual change must align with `design/DESIGN.md`. If a requirement is ambiguous, check `design/refs/` or ask for clarification.
- **Isolated Worktrees**: Because multiple engineers and autonomous agents work in parallel on this repository, never perform active development directly on the default branch or main checkout. Use dedicated Git worktrees.
- **Strict File Ownership**: Only edit files within your assigned task scope. Do not reformat or clean up unrelated files.
- **Review Loop (§10)**: Every UI change requires visual verification at **1440×900** (Desktop) and **390×844** (Mobile). Inspect against design references before opening a PR.

---

## 2. Git Worktree Workflow

Create an isolated worktree for every feature, fix, or chore:

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Create isolated worktree branching from target branch (e.g. feat/atlus-menu)
git worktree add ../rz-my-feature -b feat/my-feature origin/feat/atlus-menu
cd ../rz-my-feature

# 3. Symlink node_modules or run npm ci
npm ci
```

### Branch Naming Conventions

- `feat/<feature-name>`: New UI components, stage modules, animations.
- `fix/<bug-name>`: Bug fixes, visual regressions, alignment adjustments.
- `chore/<chore-name>`: Asset imports, dependency updates, CI workflows, tooling.
- `docs/<doc-name>`: Documentation, design reviews, task ledger updates.

---

## 3. Local Verification Checklist

Before committing or pushing, verify that your changes pass all local quality gates:

```bash
# 1. Build project for production
npm run build

# 2. Run EXIF privacy scanner (ensures no camera GPS coordinates leak into git)
npm run test:security

# 3. Run Playwright E2E test suite
npm run test:e2e

# 4. (Optional) Run local Lighthouse CI audit
npm run lhci
```

---

## 4. Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(bonfire): add conical tip and ribbed grip to soldering iron`
- `fix(menu): align … overlay close button with viewport border`
- `chore(ci): add playwright e2e tests and github actions`
- `docs(agents): define worktree rules and review loops`

---

## 5. Pull Request Protocol

1. Push your branch to `origin`:
   ```bash
   git push -u origin feat/my-feature
   ```
2. Open a Pull Request targeting `feat/atlus-menu` (or `main` when integrating major releases).
3. Fill out `.github/pull_request_template.md` completely.
4. Attach screenshots at **1440×900** and **390×844**.
5. Ensure all GitHub Actions checks (CI, Security, E2E, Lighthouse) pass green.
6. **Never merge your own PR** unless explicitly instructed by the repository owner.
