# richardzuikov.com

Personal portfolio and interactive digital stage of **Richard Zuikov** — Cloud & Systems Engineer, Open-Source Builder, and Hardware Enthusiast.

The site blends high-energy **Persona 5 / Atlus Neo-Pop manga aesthetic** (slanted UI slabs, screentone shading, dynamic camera cuts, high-contrast typography) with a real-time **Three.js WebGL Dark Souls bonfire** resting place.

---

## 🚀 Overview

- **Aesthetic**: Neo-pop manga meets dark fantasy minimalism. Sharp geometric angles, speedlines, bold Anton & Cinzel typography, and an interactive 3D WebGL stage.
- **Bilingual**: Complete German (DE) and English (EN) localization with instant language switching.
- **Theming**: Dark mode by default with light mode fallback and high contrast compliance.
- **Dual Experience**:
  - **The Stage (`/`)**: Full interactive Atlus navigation stage featuring floating 3D geometric shards and a real-time 3D resting bonfire (`#bonfire`).
  - **Quick Read (`/quick`)**: Fast, linear, high-accessibility long-scroll view optimized for recruiters and mobile bandwidth.

---

## 🛠️ Tech Stack

- **Core**: React 18, React Router v6
- **Build & Tooling**: Vite 5 (`@vitejs/plugin-react`), PostCSS, Sass
- **3D Graphics & Shaders**: Three.js (raw WebGL scene with custom shaders, particles, and render loop)
- **Styling**: Tailwind CSS 3, Sass (`src/css/style.scss`), CSS Variables
- **Typography**: `@fontsource/anton`, `@fontsource/cinzel`
- **Animations**: Framer Motion, custom CSS keyframes & transforms
- **Testing & Quality**: Playwright (Chromium E2E), Lighthouse CI (`@lhci/cli`), Gitleaks, EXIF GPS Scanner

---

## 💻 Local Development

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm 9+

### Quick Start

```bash
# Install dependencies
npm ci

# Start local dev server
npm run dev
# -> http://localhost:5173

# Build for production
npm run build

# Preview production build locally
npm run preview
# -> http://localhost:4173
```

### Additional Scripts

- `npm run test:e2e`: Run headless Playwright E2E verification suite.
- `npm run test:security`: Run EXIF GPS privacy scan across `src/assets/` and `public/`.
- `npm run lhci`: Run Lighthouse CI performance and accessibility audits.
- `npm run portraits`: Fetch and optimize raw portrait assets into responsive web formats.

---

## 🚢 Deployment (Vercel)

The repository is configured for automated continuous deployment via **Vercel**:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 20.x
- `.npmrc` sets `legacy-peer-deps=true` to ensure seamless dependency resolution in CI/CD.

---

## 📂 Repository Layout

```
.
├── .github/
│   ├── workflows/             # CI, security, e2e, and lighthouse GitHub Actions
│   ├── scripts/               # Custom CI checks (EXIF GPS validator)
│   ├── dependabot.yml         # Dependabot weekly dependency updates
│   └── pull_request_template.md # PR guidelines and review checklist
├── design/                    # Design specifications & system assets
│   ├── DESIGN.md              # Living master design specification (Atlus & Bonfire)
│   ├── TASKS.md               # Active task tracker and milestone backlog
│   ├── WORKLOG.md             # Chronological engineering log
│   ├── ASSETS.md              # Texture and model attribution log
│   └── assets-src/            # Hand-crafted SVG assets, icons & sheet.html
├── docs/                      # Architectural and engineering documentation
│   ├── ARCHITECTURE.md        # Technical architecture, routes, stage & Three.js scene
│   ├── CONTRIBUTING.md        # Contribution guidelines & git worktree workflow
│   └── STRUCTURE-PROPOSAL.md  # Proposed future feature-folder restructuring
├── public/                    # Static assets served as-is (textures, models, CV PDF)
│   └── textures/bonfire/      # PBR textures for 3D bonfire scene
├── src/
│   ├── assets/                # App images, portraits, and media
│   ├── components/            # UI components (Atlus stage, cards, overlays, modals)
│   │   ├── atlus/             # Atlus manga UI (SkillBoard, RecordBoard, KeyItems)
│   │   ├── stage/             # Three.js viewport integration & shatter mechanics
│   │   └── ui/                # Shared reusable UI primitives
│   ├── css/                   # Sass stylesheets and Tailwind integration
│   ├── data/                  # Static data models (projects, skills, career, portraits)
│   ├── hooks/                 # Custom React hooks (i18n, theme, enter triggers)
│   ├── lib/                   # Utilities, translations, sound, and noise generators
│   ├── pages/                 # Route views (Stage, Quick, Stack, Career, Impressum)
│   └── three/bonfire/         # Three.js 3D bonfire scene, shaders, embers & iron
├── tests/                     # Playwright E2E test suites
├── AGENTS.md                  # Autonomous agent instructions and worktree rules
├── CLAUDE.md                  # Claude Code pointer to AGENTS.md
├── lighthouserc.json          # Lighthouse CI audit configuration
└── playwright.config.js       # Playwright E2E configuration
```

---

## 📐 Design & System References

For all design choices, tokens, animations, and aesthetic guidelines, consult:

- [design/DESIGN.md](file:///home/richard/Projects/Ongoing/New/rz-ci/design/DESIGN.md) — Master design document & aesthetic rules.
- [design/TASKS.md](file:///home/richard/Projects/Ongoing/New/rz-ci/design/TASKS.md) — Task list and implementation status.
- [design/WORKLOG.md](file:///home/richard/Projects/Ongoing/New/rz-ci/design/WORKLOG.md) — Daily development log.
- [docs/ARCHITECTURE.md](file:///home/richard/Projects/Ongoing/New/rz-ci/docs/ARCHITECTURE.md) — Architectural overview of components and shaders.
- [AGENTS.md](file:///home/richard/Projects/Ongoing/New/rz-ci/AGENTS.md) — Guidelines for autonomous AI agents.
