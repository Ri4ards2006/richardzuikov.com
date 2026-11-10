# Deployment & Vercel Quota Management

This document defines the deployment architecture, branch filtering policies, and quota preservation guidelines for `richardzuikov.com`.

---

## 1. Context & Quota Budget

The project is hosted on the **Vercel Hobby Plan**, which imposes a strict platform limit:
- **Daily Deployment Quota**: **100 deployments / 24-hour rolling window** per account.
- **Multi-Project Linked Architecture**: Currently, **4 distinct Vercel project configurations** are linked to this repository. Consequently, every triggered git push consumes **4 deployments simultaneously** (1 per project).
- **Effective Daily Limit**: Without branch filtering, the repository is limited to a maximum of **25 git pushes per day** across all developers, autonomous agents, and bots before encountering HTTP 429 (`api-deployments-free-per-day`).

---

## 2. Vercel Git Deployment Configuration (`vercel.json`)

To preserve the daily quota for actual feature reviews and production releases, automatic deployments are controlled via `git.deploymentEnabled` in `vercel.json`.

```json
{
  "git": {
    "deploymentEnabled": {
      "dependabot/*": false,
      "dependabot/**": false,
      "test/*": false,
      "test/**": false,
      "chore/*": false,
      "chore/**": false,
      "backup/*": false,
      "backup/**": false,
      "docs/*": false,
      "docs/**": false
    }
  }
}
```

### How Vercel Evaluates `git.deploymentEnabled`

1. **Default Unmatched Behavior**:
   - Any branch that is **not explicitly matched** by a pattern defaults to `true` (deployments are enabled).
   - Therefore, release and feature branches (`main`, `feat/*`, `fix/*`) automatically deploy without needing explicit whitelist entries.

2. **Pattern Matching Engine**:
   - Vercel uses `minimatch` for branch pattern matching.
   - We specify both `prefix/*` (single path segment, e.g. `test/e2e-v6`) and `prefix/**` (nested path segments, e.g. `dependabot/npm_and_yarn/playwright`) to ensure exhaustive matching.

3. **Overlapping Rules & Evaluation Precedence**:
   - According to Vercel's Git configuration specification: **If a branch matches multiple rules where at least one rule evaluates to `true`, a deployment WILL trigger.**
   - *Critical Rule*: Never add wildcard `true` rules (e.g. `"feat/*": true` or `"*": true`), as any overlapping match would override a `false` rule and trigger an unwanted deployment. Only specify the branches that should be suppressed (`false`).

4. **First-Push Commit Context**:
   - Vercel parses `vercel.json` from the incoming commit of the branch being pushed. Branch filtering rules take effect immediately on any branch that includes this configuration.

---

## 3. Branch Prefix Deployment Matrix

| Branch Pattern | Deployment Enabled? | Target Environment | Purpose |
| :--- | :---: | :--- | :--- |
| `main` | **YES** | Production | Live production site |
| `feat/*` | **YES** | Preview | Feature branches & UI stage review |
| `fix/*` | **YES** | Preview | Bug fixes requiring visual confirmation |
| `chore/*` | **NO** | *None* (CI only) | CI/infra, asset imports, build tooling |
| `test/*` | **NO** | *None* (CI only) | E2E suites, QA audits, regressions |
| `docs/*` | **NO** | *None* (CI only) | Architectural docs, reviews, design specs |
| `backup/*` | **NO** | *None* | Stash points & historical checkpoints |
| `dependabot/*` | **NO** | *None* (CI only) | Automated dependency updates |

---

## 4. Operating Guidelines for Autonomous AI Agents

All autonomous AI agents (AntiGravity, Claude Code, etc.) must adhere to these policies:

1. **Commit Per Task, Push Once Per Session**:
   - Create granular, atomic git commits locally as tasks are finished.
   - **Do NOT push after each individual commit.** Push to `origin` exactly once per turn/session when the work is complete and verified locally.
2. **Select the Correct Branch Prefix**:
   - Use `test/*`, `chore/*`, or `docs/*` for non-UI changes to bypass Vercel previews.
   - Only use `feat/*` or `fix/*` when visual Vercel deployment preview is genuinely necessary for human design review.
3. **Verify Locally First**:
   - Run `npm run build`, `npm run test:security`, and `npm run test:e2e` in your isolated worktree before pushing.
