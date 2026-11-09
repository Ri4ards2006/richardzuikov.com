# Architectural RFC: Modern Feature-Folder Restructuring

This document outlines a modular feature-driven architecture proposal for `src/` to improve maintainability, reduce cross-module coupling, and enable seamless integration of future business-focused offerings (**SERVICES**, client consulting, system architecture packages) without disrupting the existing Atlus stage or Three.js bonfire scene.

> [!IMPORTANT]
> **Zero File Movement Policy**: As instructed, no files have been moved or modified in this PR. This document serves as an architectural blueprint and staged migration roadmap for future milestones.

---

## 1. Current State & Scalability Bottlenecks

Currently, `src/` follows a hybrid layer-based organization:
- `src/components/`: Mixes Atlus manga UI (`atlus/`), Three.js WebGL scene coordination (`stage/`), generic UI modals (`ui/`), and layout wrappers.
- `src/three/bonfire/`: Houses 3D geometries and shaders isolated from the rest of Three.js logic in `src/components/stage/scene.js`.
- `src/data/`: Mixes project showcase entries, hardware tooling, image asset manifests, and career milestones in loose JavaScript files.
- `src/lib/translations.js`: Contains a monolithic bilingual dictionary where UI labels, personal biography, and technical copy are merged together.

### Why Restructure?
As the site expands to include **commercial consulting offerings (SERVICES)**, a client inquiry flow, and interactive hardware demonstrations, a layer-based structure leads to:
1. High risk of merge collisions between concurrent AI agents and human contributors.
2. Incomplete mental models of feature boundaries.
3. Tight coupling between data models and UI presentation layers.

---

## 2. Proposed Feature-Driven Architecture

We propose organizing `src/` by business domain and feature boundaries, cleanly decoupling static content from visual components:

```
src/
├── app/                                # Application root & global shell
│   ├── App.jsx                         # Root router & route definitions
│   ├── Layout.jsx                      # Universal layout shell (header, HUD, footer)
│   ├── routes.jsx                      # Central route configuration table
│   └── providers/                      # Context providers (LanguageProvider, ThemeProvider)
│
├── content/                            # Pure content & domain data models (No JSX)
│   ├── bio.js                          # Personal profile, stats, social links
│   ├── projects.js                     # Featured open-source & client projects
│   ├── career.js                       # Employment timeline, education, milestones
│   ├── stack.js                        # Hardware & software proficiencies
│   ├── services.js                     # [NEW] Commercial services, consulting packages, specs
│   └── locales/                        # Modular i18n dictionaries
│       ├── de/                         # German translations by domain
│       │   ├── common.json
│       │   ├── stage.json
│       │   └── services.json
│       └── en/                         # English translations by domain
│           ├── common.json
│           ├── stage.json
│           └── services.json
│
├── features/                           # Domain-bounded vertical slices
│   │
│   ├── atlus-stage/                    # Interactive Atlus 3D Stage & HUD
│   │   ├── components/                 # Stage DOM overlays, name banner, shard controls
│   │   ├── scene/                      # Three.js canvas, floating shards, ink water, lighting
│   │   └── hooks/                      # Camera and cursor spring physics
│   │
│   ├── bonfire/                        # 3D WebGL Bonfire Resting Haven
│   │   ├── components/                 # Contact list overlay, inspect dialog
│   │   ├── models/                     # Soldering iron, PCB pile, stone ring, ruins
│   │   ├── shaders/                    # Flames GLSL, ember particles, smoke noise
│   │   └── utils/                      # Device tiering & WebGL quality scaling
│   │
│   ├── services/                       # [NEW] Commercial & Consulting Offerings
│   │   ├── components/                 # ServiceCards, ArchitecturePacks, InquiryDialog
│   │   ├── hooks/                      # Form validation & submission hooks
│   │   └── ServicesSection.jsx         # Full-width services showcase panel
│   │
│   ├── projects-deck/                  # Major Arcana Tarot Showcase
│   │   ├── components/                 # ArcanaCard, CardInspectModal, DeckCarousel
│   │   └── hooks/                      # 3D card tilt & touch gestures
│   │
│   ├── career-records/                 # Career & Experience Ledger
│   │   ├── components/                 # RecordBoard, YearFlipper, KeyItemsCertificates
│   │   └── hooks/                      # Timeline scroll trigger animations
│   │
│   └── quick-read/                     # Minimalist Long-Scroll View
│       ├── components/                 # Printable resume sections, executive summary
│       └── QuickView.jsx               # High-accessibility entry point
│
├── shared/                             # Cross-cutting agnostic primitives
│   ├── ui/                             # Pure reusable UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── CardFrame/                  # Reusable manga corner-notch frame
│   │   └── MangaSpeedlines/
│   ├── hooks/                          # General utility hooks
│   │   ├── useMediaQuery.js
│   │   ├── useOutsideClick.js
│   │   └── useScrollPosition.js
│   ├── lib/                            # Helper utilities
│   │   ├── cn.js                       # Tailwind class merging
│   │   ├── sound.js                    # Web Audio SFX dispatcher
│   │   └── math.js                     # Interpolation, clamp, vector utils
│   └── styles/                         # Style system & tokens
│       ├── tokens.css                  # CSS custom properties (colors, typography)
│       └── typography.scss             # Anton & Cinzel font definitions
```

---

## 3. How the Future SERVICES Section Plugs In

With this feature-folder layout, introducing commercial consulting or technical services is completely isolated:

1. **Content Definition (`src/content/services.js`)**:
   ```javascript
   export const SERVICES = [
     {
       id: 'cloud-architecture',
       arcana: 'THE EMPEROR',
       numeral: 'IV',
       titleKey: 'services.cloud.title',
       descriptionKey: 'services.cloud.desc',
       deliverables: ['GCP/AWS IaC Architecture', 'Kubernetes Hardening', 'Cost Optimization'],
     },
     {
       id: 'embedded-hardware',
       arcana: 'THE HIEROPHANT',
       numeral: 'V',
       titleKey: 'services.hardware.title',
       descriptionKey: 'services.hardware.desc',
       deliverables: ['Custom PCB Layouts', 'Firmware Prototyping', 'EMC Pre-Compliance'],
     },
   ];
   ```
2. **Feature Components (`src/features/services/`)**:
   - `ServiceCard.jsx`: Reuses `shared/ui/CardFrame` with Atlus manga styling.
   - `InquiryModal.jsx`: Interactive contact drawer pre-populating chosen service tier.
3. **Menu Integration**:
   - Easily mapped into `src/features/atlus-stage/components/MenuOverlay.jsx` with route `/#services` or `/services`.
   - Zero side-effects on `three/bonfire` or `quick-read`.

---

## 4. Four-Phase Non-Breaking Migration Plan

To maintain continuous deployment stability on Vercel and prevent breaking in-flight agent tasks, migration should proceed across four discrete, isolated pull requests:

### Phase 1: Shared Core & Path Aliases
- Configure Vite path aliases in `vite.config.js`:
  ```javascript
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './src/content'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    }
  }
  ```
- Establish `src/shared/ui/` and `src/shared/lib/` without moving existing components yet.

### Phase 2: Decouple Data & Internationalization
- Create `src/content/` and migrate data modules from `src/data/`.
- Provide re-export shims in `src/data/` (e.g. `export * from '../content/projects';`) so existing imports continue functioning seamlessly.
- Run Playwright E2E suite to guarantee zero regression.

### Phase 3: Vertical Slice Migration (One PR Per Feature)
- **PR 3A**: Move `src/three/bonfire/` into `src/features/bonfire/`. Update Three.js scene imports.
- **PR 3B**: Move `src/components/atlus/` and stage logic into `src/features/atlus-stage/`, `projects-deck/`, and `career-records/`.
- **PR 3C**: Move `src/pages/Quick.jsx` into `src/features/quick-read/`.

### Phase 4: Deprecation Cleanup & Verification
- Remove legacy re-export shims from `src/components/` and `src/data/`.
- Verify full site functionality with Playwright tests (`npm run test:e2e`), bundle size checks (`npm run build`), and visual review loops at 1440×900 and 390×844.
