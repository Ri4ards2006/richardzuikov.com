# Phased Implementation Roadmap & Engineering Plan
**richardzuikov.com — Editorial Systems Portfolio**
*Version: 2.0.0 · Role: Principal Design Technologist & Senior Frontend Architect*

---

## 1. Phased Execution Matrix

The evolution of `richardzuikov.com` follows a 3-phase engineering progression aimed at achieving uncompromising Swiss-minimalist aesthetics, deterministic performance, and zero maintenance friction.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENGINEERING TIMELINE                            │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: CORE REFINEMENT & SYSTEM FOUNDATIONS (Weeks 1 - 2)            │
│ • Universal DE/EN Localization Engine                                  │
│ • Deterministic Warm Dark & Gallery Light Token Polish                 │
│ • Certificate Inspector Modal Integration                              │
│ • Removal of Heavy Runtime Bundles from Critical Root                  │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: SPATIAL TYPOGRAPHY & SCHEMA MIGRATION (Weeks 3 - 4)           │
│ • Decoupling Content to Zod-Validated Static Datasets                  │
│ • Spatial Grid Alignment & Fluid clamp() Typography Refinement         │
│ • Dual-Domain External Project Preview Showcase                        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: EDGE GOVERNANCE, VERIFICATION & HARDENING (Weeks 5 - 6)       │
│ • Lighthouse CI Integration (100/100 Enforcement)                      │
│ • Edge Caching Headers & CSP Lockdown (vercel.json)                    │
│ • Cross-Engine Testing (WebKit, Gecko, Blink)                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Core Refinement & Foundation

**Objective**: Establish rock-solid baseline systems (theming, translation, credential telemetry) and trim runtime overhead.

| Task ID | Component / Area | Action Items | Success Criteria |
| :--- | :--- | :--- | :--- |
| **P1.1** | `use-language.jsx` | Migrate to centralized dictionary store (`src/data/dictionaries/*.json`). Synchronize with `<html>` lang attribute and `storage` events. | Zero hardcoded bilingual ternary cascades in presentation JSX. |
| **P1.2** | `use-theme.jsx` | Standardize color tokens on Warm Stone Dark (`#0c0a09` / `#1c1917`) and Gallery Slate (`#f8fafc` / `#ffffff`). Embed inline anti-FOUC script in `index.html`. | 0ms theme flicker on cold browser reloads. |
| **P1.3** | `CertificateModal.jsx` | Implement accessible keyboard-navigable inspector modal for professional certifications (AZ-900, Red Hat, IBM, Google). | WCAG 2.1 AA compliant modal with focus trap and verification links. |
| **P1.4** | Bundle Diet | Segregate 3D sandboxes and unnecessary heavy libraries from main bundle into lazy chunks / external subdomains. | Initial JS bundle transfer $\le 45\text{ KB}$ gzip. |

---

## 3. Phase 2: Content Architecture & Spatial Typography

**Objective**: Decouple static data from view templates and refine layout negative space.

| Task ID | Component / Area | Action Items | Success Criteria |
| :--- | :--- | :--- | :--- |
| **P2.1** | `src/data/` | Migrate project lists, hardware logs, and career timeline into JSON files validated against Zod schemas. | TypeScript/Zod build-time validation ensuring schema compliance. |
| **P2.2** | Spatial Scale | Apply fluid typography `clamp()` scale to headings and body text. Enforce 8px/4px baseline rhythm across all views. | Zero layout breakage between 360px and 2560px resolutions. |
| **P2.3** | `ProjectCard.jsx` | Implement editorial dual-domain cards linking external 3D sandboxes via static WebP previews and outbound launch buttons. | Clear visual boundary between core portfolio and external WebGL apps. |
| **P2.4** | `Impressum.jsx` | Maintain legal compliance with § 5 DDG & § 18 MStV alongside anti-bot obfuscation for email and address. | Pass automated privacy and legal disclosures review. |

---

## 4. Phase 3: Edge Governance & Quality Verification

**Objective**: Automate performance regression testing and enforce strict security headers.

| Task ID | Component / Area | Action Items | Success Criteria |
| :--- | :--- | :--- | :--- |
| **P3.1** | `vercel.json` | Configure immutable asset caching (`max-age=31536000`), stale-while-revalidate for HTML, and strict CSP policies. | Security grade **A+** on securityheaders.com. |
| **P3.2** | Lighthouse CI | Configure `.lighthouserc.json` and GitHub Actions workflow enforcing 100/100 in Performance, Accessibility, Best Practices, and SEO. | Automated pull-request gate rejecting regressions. |
| **P3.3** | Cross-Engine Testing | Verify typography rendering, transitions, and theme swaps across Safari iOS, macOS WebKit, Firefox Gecko, and Chrome Blink. | Zero visual artifacts or scroll-jank across target devices. |

---

## 5. Verification & Quality Gates

Run these concrete command routines to verify compliance with architectural standards:

```bash
# 1. Validate clean build without warnings
npm run build

# 2. Check bundle size output (ensure gzip chunks remain < 50 KB)
npx vite-bundle-visualizer

# 3. Execute local Lighthouse CI audit
npx lhci autorun --config=./.lighthouserc.json

# 4. Lint and check schema integrity
npm test
```
