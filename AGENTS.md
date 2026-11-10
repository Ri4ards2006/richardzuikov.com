# Autonomous AI Agent Operating Guidelines

This repository (`richardzuikov.com`) is developed concurrently by human engineers and autonomous AI agents (e.g. AntiGravity, Claude Code). To prevent collisions, regressions, and context loss, **all AI agents must strictly follow these rules**.

---

## 1. Prime Directive: Read `design/DESIGN.md` First

Before writing a single line of code, modifying assets, or creating reviews, **read `design/DESIGN.md`**.
- It contains the living design system specifications, color palettes, typography scales, performance budgets (§8), and review protocols (§10).
- Check `design/refs/` and `design/storyboard/` for visual references.
- Never invent design patterns, layouts, or facts not grounded in `DESIGN.md`.

---

## 2. Isolated Git Worktrees Only

Never work directly in the main repository checkout (`/home/richard/Projects/Ongoing/New/richardzuikov.com`). Multiple agents run simultaneously in parallel.
- Always spawn an isolated worktree outside the main tree:
  ```bash
  git fetch origin
  git worktree add ../rz-<task-name> -b <type>/<task-name> origin/feat/atlus-menu
  cd ../rz-<task-name>
  ```
- Symlink `node_modules` or run `npm ci` within your isolated worktree.

---

## 3. Branching & Delivery Protocol

- **Vercel Deploy Budget & Push Discipline**:
  - **Commit per task, push once per session**: The repository is linked to 4 Vercel projects on the Hobby tier (100 deployments/day limit = 25 pushes max across all developers and agents). Make granular commits locally per task, but **push to origin only once per session** after full verification.
- **Branch Prefix & Deployment Matrix**:
  | Branch Prefix | Vercel Deploys? | Intended Scope |
  | :--- | :---: | :--- |
  | `main` | **YES** | Production releases |
  | `feat/*` | **YES** | New features requiring live visual design review |
  | `fix/*` | **YES** | Bug fixes requiring live visual preview |
  | `chore/*` | **NO** | CI/infra, configs, asset optimization |
  | `test/*` | **NO** | E2E tests, QA suites, regressions |
  | `docs/*` | **NO** | Architectural docs, reviews, design specs |
  | `backup/*` | **NO** | Checkpoints & branch stashes |
  | `dependabot/*` | **NO** | Automated dependency bumps |
- **Forbidden Actions**:
  - ❌ **NEVER push directly to `main`**.
  - ❌ **NEVER merge pull requests** unless explicitly requested by the owner.
  - ❌ **NEVER force-push (`git push --force`)**.
  - ❌ **NEVER push multiple times in a loop** (exhausts Vercel deployment quotas).
  - ❌ **NEVER alter repository settings or global git configs**.
- **Delivery**:
  - Always push your branch to `origin` once and use `gh pr create` to open a Pull Request into `feat/atlus-menu` (or the specified target branch).
  - Stop after opening the PR.

---

## 4. Strict File Ownership & Scope Boundaries

- Follow the prompt's file restrictions to the letter.
- If a prompt specifies: *"You may ONLY change: src/three/bonfire/**, public/textures/bonfire/**"*, do not touch anything else!
- If a prompt specifies: *"never touch src/ or design/"*, respect this boundary completely.
- Never reformat, "clean up", or re-indent files outside your assigned module.

---

## 5. Visual Review Loop (§10)

For any task involving user-facing UI, 3D graphics, or styling:
1. Run the local preview: `npm run build && npm run preview`.
2. Take screenshots at both target viewports:
   - **Desktop**: `1440×900`
   - **Mobile**: `390×844`
3. Compare screenshots against reference images in `design/refs/` and specifications in `DESIGN.md`.
4. Critically analyze discrepancies, iterate, and **fix at least twice** before finalizing.
5. Save or attach verification screenshots with your pull request.

---

## 6. Keeping the Ledger Updated

When permitted by task boundaries:
- Check off completed items in `design/TASKS.md`.
- Document your session findings, decisions, and changes in `design/WORKLOG.md`.
- If your task explicitly restricts touching `design/`, document all decisions, resolved ambiguities, and rationale in your **Pull Request description**.
