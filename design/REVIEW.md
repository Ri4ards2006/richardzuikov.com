# Atlus Menu & Cinematic Stage — Design Review (feat/atlus-menu)

**Date**: 2026-11-09  
**Reviewer**: AntiGravity (Jarvis Fleet Design Reviewer)  
**Target Branch**: `feat/atlus-menu`  
**Reference Specs**: `design/DESIGN.md` (Design Bible §0–§11) & Storyboard Cards 01–05  
**Audit Viewports**: Desktop 1440×900, Mobile 390×844 (Playwright headless Chromium)

---

## 1. Intro Stage — Card 01 Preload & Paper Tear (0.0s – 0.9s)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 1.1 | `src/components/stage/IntroOverlay.jsx:16` | 3–4 lines typed mono telemetry log (`probing i2c bus …`, `mounting /dev/portfolio`, `flashing firmware ████ 100%`) per DESIGN.md §7 Card 01 | Static single-line string `{loading}` with no typing animation, telemetry steps, or diagnostic messaging | **P1** |
| 1.2 | `src/components/stage/IntroOverlay.jsx:11-14` & `src/pages/Stage.jsx:96-104` | Diagonal paper tear reveals name plate "RICHARD ZUIKOV" on halftone texture before shattering into Voronoi fragments | Tear splits straight into dark 3D canvas; no intermediate name plate plane or halftone title reveal exists | **P1** |
| 1.3 | `src/components/stage/IntroOverlay.jsx:4-7` | Diagonal hand-torn paper split across viewport with ragged edge, debris, and ink fibres | `TEAR` coordinates oscillate around X=50% (`[50, 46, 53, 47, 51...]`), producing a vertical seam down the center rather than a diagonal slash | **P2** |
| 1.4 | `src/pages/Stage.jsx:16,96` & `src/css/style.scss:470` | Real asset preloader driven by `THREE.LoadingManager` + font/texture loaders (min 0.6s, otherwise real asset load progress) | Fixed timeout `BOOT_MS = 800` coupled to an arbitrary CSS keyframe bar (`animation: bar 800ms`), disconnected from real asset loading | **P2** |
| 1.5 | `src/components/stage/IntroOverlay.jsx:18` | Skip button styled with sharp slab inversion and keyboard cue ("PRESS ANY KEY OR CLICK TO SKIP") | Minimal text label `text-ash-400` without slab styling or keypress indicator | **P3** |

---

## 2. Intro Stage — Card 02 Shatter & Dive (0.9s – 2.2s)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 2.1 | `src/components/stage/scene.js:419-421` | Extruded 3D Voronoi geometry (`ExtrudeGeometry`, depth ≈ 0.04) mapped with texture UVs from name plate | Flat 2D `ShapeGeometry` using untextured `MeshBasicMaterial` (`side: DoubleSide, depthWrite: false`) with zero extrusion depth | **P1** |
| 2.2 | `src/components/stage/scene.js:428-431, 574-578` & `src/pages/Stage.jsx:79` | Five prominent Voronoi fragments decelerate sharply at 1.8s and snap directly into the 5 menu slab coordinates before cross-fading to DOM slabs | Shards translate toward arbitrary random offset (`-viewW * 0.3 + (Math.random() - 0.5) * 1.6`) and vanish abruptly on dive end | **P1** |
| 2.3 | `src/components/stage/scene.js:410-435` | Camera dives through reflective ink mirror plane with surface ripple displacement and 3D ink droplets passing the lens | Dark background plane without reflections, surface ripples, or passing ink droplets during camera dive | **P2** |
| 2.4 | `src/components/stage/scene.js:1` | Dynamic monochrome chromatic aberration and motion blur scaled to camera velocity during dive | No post-processing pipeline (`EffectComposer` / custom shaders) active in `scene.js` | **P3** |
| 2.5 | `src/components/stage/scene.js:429` | Camera roll: 12° Dutch tilt that levels out smoothly as camera reaches menu stage (`z 15 → 5`) | Camera tilt is static or abruptly leveled without easeOutCubic angular damping | **P3** |

---

## 3. Hero Stage & Atlus Menu (Card 03)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 3.1 | `src/css/style.scss:376-379` & `src/pages/Stage.jsx:183` | Paper wedge shoots out behind active item within 120ms (`cubic-bezier(.2,.9,.1,1)`) upon hover/focus with item inversion | Hover only toggles `background: rgb(var(--ash-100))`; shooting wedge polygon / pseudo-element is absent | **P1** |
| 3.2 | `src/pages/Stage.jsx:186-194` | Monospace index numbers `01`–`05` adjacent to slabs; large background echo watermark text (e.g. `03 STACK`) on active item | Only plain menu strings are rendered; index numerals and background echo watermark are missing | **P1** |
| 3.3 | `src/pages/Stage.jsx:171-205` | Full HUD: top-left `STATUS: AVAILABLE · FLENSBURG`, top-right slanted chips (GitHub/LinkedIn/CV/Mail), bottom-centre `SCROLL TO DESCEND` with `<TraceStar/>` | Only top-left `<h1>` and quick-read link exist; status chip, top-right chips, and scroll prompt with TraceStar missing | **P1** |
| 3.4 | `src/css/style.scss:365` | `rotateY(-18deg)`, `rotateZ(-6deg ... -10deg)` with parallelogram cuts 6–14° (DESIGN.md §4, §7) | `transform: rotateY(calc(16deg + var(--mx, 0) * 5deg)) skewY(-3deg);` — positive 16° Y-rotation, 0° Z-rotation, -3° skew | **P2** |
| 3.5 | `src/components/stage/scene.js:178-195` | 3-layer portrait: (1) splatter + HUD rings, (2) figure, (3) brush strokes with 0.5/1.5/3% mouse parallax, 12 fps boil, 1.0→1.012 breathing | Single flat mesh with 1-pass halftone shader; no concentric HUD rings, no layered stroke parallax, and no 12 fps stroke boil | **P2** |

---

## 4. Descent & Manga Panels (Card 04)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 4.1 | `src/pages/Stage.jsx:210` & `src/css/style.scss:390-405` | Section entry headlines styled as P5-inspired ransom-note typography ("WHO AM I", "WHERE I'M HEADING") with rotated mixed font tiles | Standard single-element Anton headline (`heading-skew font-anton uppercase text-5xl...`) with uniform tracking | **P1** |
| 4.2 | `src/css/style.scss:373` | Snappy 120–220ms transitions with `cubic-bezier(.2,.9,.1,1)` and 2–4px overshoot (DESIGN.md §5) | `translate 320ms cubic-bezier(0.16, 1, 0.3, 1)` and `opacity 260ms`, exceeding 220ms limit with no overshoot | **P2** |
| 4.3 | `src/css/style.scss:395` | Manga panels styled with 3px paper borders, gutters, and sharp asymmetric cuts (DESIGN.md §7 Card 04) | Border defined as `border: 2px solid rgb(var(--ash-100));` (2px instead of 3px) | **P3** |
| 4.4 | `src/components/stage/scene.js` & `src/pages/Stage.jsx` | Dynamic radial white speedlines triggered during rapid camera scroll on the rail | No speedline mesh, canvas burst, or CSS speedline overlay bound to scroll velocity | **P3** |
| 4.5 | `src/css/style.scss:394` | Halftone dot pattern across manga panels using sharp screentone dots | Pattern uses soft radial gradient fallback (`radial-gradient(circle, ...)`) rather than sharp binary halftone mask | **P3** |

---

## 5. Arcana Tarot Cards (Work Section)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 5.1 | `src/pages/Stage.jsx:231-245` & `src/components/stage/scene.js:386-399` | Clicking a tarot card flips it in 3D (front: halftone art, Roman numeral, title; back: specs, hardware tags, repo link) | Card slots are wrapped in standard `<a>` tags with `target="_blank"`, navigating immediately away with zero 3D flip interaction | **P1** |
| 5.2 | `src/components/stage/scene.js:386-399, 483-489` | Entering section deals cards onto table (fly in, slam, bounce, dust puff) with scroll progress fanning them | Cards are statically locked to DOM slot bounding rects; no dealing trajectory, slam bounce, or particle puff | **P2** |
| 5.3 | `src/components/stage/scene.js:598-600` | Hover triggers 3D tilt plus animated diagonal silver sheen sweep across card face | Hover only modifies `card.lift` and ±2° tilt; silver sheen sweep shader is absent | **P2** |
| 5.4 | `src/components/stage/scene.js:120-176 (drawCard)` | Card decorative frame drawn as crisp vector SVG overlay (DESIGN.md §7 Card 04: "Frame drawn as SVG, no image") | Entire card frame and borders are rasterized into a 512×878 HTML canvas bitmap | **P3** |
| 5.5 | `src/pages/Stage.jsx:248-251` | Subdomain link `rack.richardzuikov.com` styled as an Atlus inventory link with slanted chip framing | Standard text hyperlink with minimal arrow glyph | **P3** |

---

## 6. Information Architecture & Missing Sections (Skill & Record)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 6.1 | `src/pages/Stage.jsx:225-254` | Home stage includes `id="skill"` with 3D-tilted ranked list, category mini-vignettes (asm scroll, rack LEDs, scope trace), and detail pane | Section is completely missing from `Stage.jsx`; visitor jumps from `#arcana` straight to `#bonfire` | **P1** |
| 6.2 | `src/pages/Stage.jsx:225-254` | Home stage includes `id="record"` with calendar-flipping Anton year numerals and Souls-style KEY ITEMS certificate inventory grid | Section is completely missing from `Stage.jsx`; career history and certifications are absent from the landing stage | **P1** |
| 6.3 | `src/pages/Stage.jsx:18, 188-193` | Menu click / Enter smoothly flies camera to target section on home stage (DESIGN.md §0, §6) | `SCROLL_TARGETS` only maps `{ work, contact }`; STACK and CAREER trigger `<Link>` route changes to subpages, fragmenting the single-camera flow | **P1** |
| 6.4 | `src/pages/Stage.jsx` & `src/App.jsx` | Fixed top-right `…` button appearing past hero to open full-screen monochrome MENU overlay with language/theme toggles | Floating menu button is missing during scroll descent; visitor has no global navigation past hero | **P2** |
| 6.5 | `src/pages/Stage.jsx:173` | Status chips and breadcrumbs responsive to German/English localization | Role subtitle uses raw string without uppercase slab framing | **P3** |

---

## 7. Bonfire Rest Site (Abyss / Contact)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 7.1 | `src/components/stage/scene.js:214, 218` & `design/ASSETS.md` | Stone floor textured with Poly Haven CC0 PBR maps (diffuse, roughness, normal), logged in `design/ASSETS.md` | Floor consists of untextured flat-shaded gray boxes (`color: 0x4a4a48`); no PBR maps or `design/ASSETS.md` exist | **P1** |
| 7.2 | `src/pages/Stage.jsx:261-276` | Souls-style text list with ASCII prompt markers: `> SEND MAIL`, `> COPY MAIL`, `> CV (PDF)`, `> GITHUB`, `> LINKEDIN` with `--glow` hover | Modern web list with Lucide SVG icons (`<Mail>`, `<Copy>`, `<Download>`) instead of souls-like prompt markers | **P2** |
| 7.3 | `src/pages/Stage.jsx:254-279` | Cinzel banner "CONNECTION KINDLED" displayed on first arrival at bonfire per session | Banner is missing; only standard static section heading is shown | **P2** |
| 7.4 | `src/components/stage/scene.js:213-244` | Ring of displaced low-poly icosahedron stones and charred PCB fragments with glowing emissive trace borders | Debris is plain untextured black boxes; circular stone perimeter around ash mound is missing | **P2** |
| 7.5 | `src/pages/Stage.jsx:279` | Legal footer (Impressum / Datenschutz) positioned below bonfire, plain and readable | No footer rendered at the bottom of Stage.jsx; legal pages are unreachable from home stage | **P3** |

---

## 8. Visual Identity, Textures & Design Tokens

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 8.1 | `src/pages/Impressum.jsx:34` | Zero chromatic hues anywhere outside bonfire zone; remove `#FFB000` completely (DESIGN.md §2) | Hardcoded `hover:decoration-[#FFB000]` remains in link hover decoration | **P1** |
| 8.2 | `src/components/` & `src/pages/Stage.jsx` | Shared `<TraceStar/>` SVG component (asymmetric 4-point PCB compass star) used as bullet, scroll cue, and loader | `<TraceStar/>` is completely missing from codebase | **P2** |
| 8.3 | `src/App.jsx` & `src/css/tokens.css` | Canvas-generated animated film grain over entire viewport at ~8% opacity | Film grain canvas overlay is not attached to the viewport root | **P2** |
| 8.4 | `src/css/tokens.css` | Explicit tokens `--bone: #cfccc5`, `--paper: #f4f4f0`, `--ember: #ff6a00`, `--flame: #ff9a2e`, `--glow: #ffd180` | Tokens mapped to generic `--ash-*` and `--ember-hot/gold` ramp; `--bone` and `--flame` missing | **P3** |
| 8.5 | `src/css/style.scss` | Strict `border-radius: 0` everywhere in the experience | Minor border-radius traces exist in generic UI utility classes | **P3** |

---

## 9. Responsive & Viewport Behavior (1440×900 vs 390×844)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| 9.1 | `src/css/style.scss:358, 504` | Menu slabs scale cleanly on mobile (390px width) without horizontal overflow or text clipping | `clamp(2.75rem, 7vw, 4.75rem)` + `padding: 0.15rem 3rem 0.15rem 1rem` causes longer words (`WERDEGANG`) to touch screen edges | **P1** |
| 9.2 | `src/components/stage/scene.js:416, 447` | Mobile < 768px strictly steps down to 12 fragments, no reflector, DPR 1.0, and simplified bonfire | DPR cap remains at 1.5 on mobile; memory and shader workload on low-end mobile devices can induce frame drops | **P2** |
| 9.3 | `src/components/stage/scene.js:450-465` | Mobile touch interaction provides scroll damping and gyro/touch tilt in place of mouse coordinates | Slabs and 3D camera rely exclusively on pointer mousemove; mobile stage feels static without gyroscope/touch interaction | **P2** |
| 9.4 | `src/pages/Stage.jsx:228` | Tarot card grid on mobile stacks gracefully as single-column or carousel | Tarot cards compress to 3 tiny columns on narrow viewports unless media query explicitly switches layout | **P2** |
| 9.5 | `src/components/stage/IntroOverlay.jsx:17` | Preloader bar width scales relative to mobile viewport (`max-w-[70vw]`) | Bar has fixed `w-56` (224px); on narrow screens with low DPI it dominates viewport center | **P3** |

---

## Architecture & Scalability Roadmap ("Feinste vom Feinsten")

To evolve this cinematic experience into a scalable, high-performance portfolio engine without code regressions:

1. **State Machine Driven Stage Loop (`XState` or lightweight reducer)**:
   - Transition phases (`boot` → `tear` → `dive` → `hero` → `descent` → `bonfire`) should be managed via an explicit deterministic state machine rather than dispersed `setTimeout` promises.
2. **Unified Camera Rail System**:
   - Tie Lenis smooth-scroll directly to the Three.js camera position vector using normalized scroll progress `[0, 1]`. Slabs, manga panels, tarot cards, and bonfire should expose 3D anchor matrices that the camera interpolates between.
3. **Asset Bundle Streaming**:
   - Bundle Poly Haven CC0 stone textures and 3D assets into a pre-compressed `.ktx2` / Basis Universal format. Lazy load textures during the Card 01 boot telemetry sequence so load times remain under 400ms on 4G connections.
4. **Subdomain Architecture Alignment**:
   - Deep subdomains (`rack.richardzuikov.com`, `lab.richardzuikov.com`, `auth.richardzuikov.com`) should share the identical monochrome token layer and `<TraceStar/>` favicon/font assets via an npm package or shared Git submodule.
