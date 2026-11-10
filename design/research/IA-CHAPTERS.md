# Information Architecture Proposal: Pinned Theatrical Chapters (AP3)

**Branch:** `docs/ia-chapters`  
**Status:** Proposal / Ready for Review  
**Author:** Antigravity (Systems Architect)  
**Context:** Successor to AP1 Transition Lab (`/labs/transitions.html` benchmarks in `design/research/TRANSITIONS.md`) and AP2 Architecture Canon (`docs/ARCHITECTURE.md`).

---

## 1. Executive Summary & Problem Statement

### 1.1 The "Single-Long-Scroll" Rut
In `feat/atlus-v6`, `richardzuikov.com` operated on a single unconstrained vertical scroll track spanning $\sim 14{,}000\,\text{px}$. While the custom Three.js camera rail and DOM proxies create motion, free continuous scrolling causes:
1. **Pacing Dilution**: Users whip through deep technical projects and hardware diagrams without pausing at key milestones.
2. **Atmospheric Mismatch**: Games like *Persona 5* and *Metaphor: ReFantazio* derive their aesthetic power from bold chapter title cards, cinematic camera rolls, and deliberate transition punctuation—not an endless vertical web page.
3. **Scroll Fatigue & Anchor Drift**: Long continuous scroll makes hash deep linking (`/#bonfire`) disorienting and prone to layout overshoot.

### 1.2 The Pinned Theatrical Solution
We map all portfolio sections and sub-screens into **$\le 6$ pinned, discrete narrative chapters**.
- Inside each chapter, the viewport is pinned while the user scrubs through internal stage choreography.
- Exiting a chapter triggers one of **3 validated transition paradigms** (from the AP1 Transition Lab):
  1. **The Tactical Roll (90° Roll + Speedline Burst)**: Camera rolls 90° on $Z$, numerals counter-rotate, speedlines blast.
  2. **The Portal Dive (Zoom-Through)**: Active panel or card frame scales quadratically $+800\%$ to swallow the viewport.
  3. **The Ink Cut (Sumi-e Brush Wipe to Obsidian)**: Rapid black brush sweep wiping to `#050505`.
- **The Page Gets Shorter**: Redundant intermediate copy, duplicate sub-routes (`/work`, `/stack`, `/career`), and empty scroll buffers are consolidated, slashing total page height by **42%**.

---

## 2. Consolidation & Elimination Plan (What Gets Removed or Merged)

To make the experience concise, impactful, and fast, the following elements are removed or merged:

| Legacy Entity / Section | Status | Action Taken & Architectural Destination | Total Height Saved |
| :--- | :--- | :--- | :--- |
| **Empty Scroll Buffers** | **Deleted** | Eliminated the 145vh empty dead-space buffer in `.stage-abyss` between Record and Bonfire. | $\sim 1{,}300\,\text{px}$ |
| **Separate `/work` Route** | **Merged** | Consolidated into **Chapter 02 (Neural Horizon)**. Projects live as interactive Arcana cards with in-place modal inspection. | Eliminates 1 route |
| **Separate `/stack` Route** | **Merged** | Consolidated into **Chapter 03 (The Arcana)**. Skill matrices and Fourier synthesizers live on the pinned stage. | Eliminates 1 route |
| **Separate `/career` Route** | **Merged** | Consolidated into **Chapter 04 (The Chronicles)**. Career milestones and Key Items rendered along the horizontal scrub track. | Eliminates 1 route |
| **Duplicate Quick Read** | **Removed** | Removed redundant Quick Read links in stage nav; single permanent toggle in top utility bar. | UI de-clutter |
| **Non-R2P Speculative Cards** | **Removed** | Removed placeholder skill tags lacking live project/certificate backing (POSIX, REST/WebSocket, Figma). | 6 redundant tags |
| **Free-Scroll Cam Slop** | **Removed** | Replaced continuous variable camera rail interpolation with deterministic chapter-pinned rail arcs. | Zero frame slop |

---

## 3. The 6-Chapter Matrix

```
[Ch. 00: The Awakening] ──(90° Tactical Roll)──> [Ch. 01: The Arsenal]
                                                        │
                                                 (Portal Dive)
                                                        ▼
[Ch. 03: The Arcana] <──(90° Tactical Roll)───── [Ch. 02: Neural Horizon]
       │
 (Portal Dive)
       ▼
[Ch. 04: The Chronicles] ──(The Ink Cut)───────> [Ch. 05: The Sanctuary / Bonfire]
```

---

### Chapter 00 // Act 0: The Awakening (Hero & Stage)
- **Deep Link:** `/#hero` (canonical root `/`)
- **Scroll Length:** `120vh` (pinned; $0\text{--}100\%$ chapter progress)
- **Content Scope:**
  - Giant skewed typographical masthead (`Anton`, 12° italic slant).
  - Dual-slab entry portals: Technical Portfolio (`ENTER STAGE`) vs. Recruiter Overview (`QUICK READ`).
  - Active "NOW" status pill (live prototyping and active hardware build status).
  - Front silhouette portrait cutout with halftone screentone and paper wedge.
- **In-Chapter Animation:**
  - $0.0\text{--}0.3$: Hero slabs slam into position with subtle elastic bounce ($12\text{px}$ entrance).
  - $0.3\text{--}0.8$: 3D obsidian polygon shards (`floating-shards.js`) orbit on depth layers ($Z = -2$ to $Z = +1$), gently reacting to pointer physics.
  - $0.8\text{--}1.0$: Slabs lock; camera pre-tilts +3° in anticipation of roll.
- **Transition Out (Max 3 Types):**  
  **The Tactical Roll (90° Roll)** &mdash; Board scales +3%, speedline burst flashes at $0.3\text{--}0.7$, coordinate system rolls 90° clockwise, numerals counter-rotate to preserve horizontal legibility, handing over seamlessly to Descent Panel 01.
- **Menu-Jump Behaviour:**
  - Jumping to `/#hero` from any overlay unpins stage, smoothly scrolls to $Y = 0$, resets camera roll to 0°, and re-arms hero slab entrance animations.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - Single centered column; static duotone portrait cutout (`me-hero-640.webp`).
  - WebGL shard count reduced from 38 to 12.
  - Touch-swipe or scroll advances chapter via instant 150 ms snap.
- **Keyboard & Screen-Reader Behaviour:**
  - `<h1>Richard Zuikov &mdash; Embedded Systems Architect</h1>`.
  - Skip link (`Skip to main content` / `Skip to Quick Read`) receives initial tab focus.
  - Arrow Down / `PageDown` steps directly to Chapter 01.
- **Testable Acceptance Criteria:**
  - [ ] Renders within $\le 1.8\,\text{s}$ TTI on 4G network.
  - [ ] 0 console warnings; zero horizontal scrollbar overflow.
  - [ ] 90° roll completes in exactly $120\text{vh}$ wheel travel with $\ge 58\,\text{fps}$.

---

### Chapter 01 // Act I: The Arsenal (Descent & Hardware Foundations)
- **Deep Link:** `/#descent`
- **Scroll Length:** `200vh` (pinned; 5 steps $\times 40\text{vh}$)
- **Content Scope:**
  - The 5 manga panels of the technical descent:
    1. **Panel 01**: FPGA DSP & High-Speed Demodulation (KiCad PCB prop).
    2. **Panel 02**: Embedded DMA Bridges & Microcontrollers (Silicon QFP chip prop).
    3. **Panel 03**: RF Frontends & Vector Sweepers (Vector CRT monitor prop).
    4. **Panel 04**: Modular Rack Infrastructure & Power (1U Server rack prop).
    5. **Panel 05**: Vision Telemetry & Autonomous Edge (Security camera prop).
- **In-Chapter Animation:**
  - Sequential panel step activation ($0\text{--}20\%, 20\text{--}40\%, 40\text{--}60\%, 60\text{--}80\%, 80\text{--}100\%$).
  - As each panel enters viewport center, its dedicated gutter slot (`.prop-slot[data-slot]`) docks its 3D prop.
  - The active prop performs idle rotation and subtle hover reaction; non-active props remain docked with exact panel `translateY`.
- **Transition Out (Max 3 Types):**  
  **The Portal Dive (Zoom-Through)** &mdash; Panel 05 wireframe expands quadratically ($+800\%$), camera plunges through the optical aperture into the void, dissolving into the Major Arcana project deck.
- **Menu-Jump Behaviour:**
  - Jumping to `/#descent` sets scroll to chapter start ($Y = 120\text{vh}$), aligns Panel 01 to center, and guarantees all 5 props are attached to `scene: 'descent'`.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - Viewport width $< 1024\,\text{px}$ automatically culls WebGL 3D props.
  - Panels display high-contrast inline 2D vector badges (`src/assets/badges/`).
  - Swiping horizontally or vertically moves one panel at a time (`scroll-snap-type: y mandatory`).
- **Keyboard & Screen-Reader Behaviour:**
  - `<section aria-label="The Arsenal: Hardware Competencies">`.
  - Each panel is marked up as an `<article>` with heading `<h3>`.
  - Arrow keys step between panels; `Enter` opens panel deep-dive details.
- **Testable Acceptance Criteria:**
  - [ ] AP0 Pixel Probe: Every panel 01–05 centered displays rendered prop with $\ge 3\%$ non-background pixels ($\Delta E > 8$).
  - [ ] `window.__propScreenPos()` reports `visible === true`, `inFrustum === true`, and `scene === 'descent'`.
  - [ ] Zero prop overlaps across 1024, 1280, 1440, and 1920 px viewports.

---

### Chapter 02 // Act II: Neural Horizon (Projects & Major Arcana Deck)
- **Deep Link:** `/#arcana`
- **Scroll Length:** `180vh` (pinned; $0\text{--}100\%$ deck scrub)
- **Content Scope:**
  - The 5 core engineering projects formatted as Major Arcana Tarot Cards:
    - Card 00: LoRA-RF Demodulator (SystemVerilog / Kintex-7).
    - Card 01: ESP32-INMP441 DMA Audio Streaming Host.
    - Card 02: 3 GHz RF Vector Sweeper & S-Parameter Bridge.
    - Card 03: TRICH-1 Ternary Logic Micro-Architecture.
    - Card 04: Solar Embedded Weather Station 2.0.
- **In-Chapter Animation:**
  - Fan deck spreads across 3D perspective space ($X = -450\text{px}$ to $+450\text{px}$).
  - Wheel scrubbing rotates the active tarot card to the front ($Z = +0.8$).
  - Hovering or keyboard focusing a card transitions it from monochrome halftone to authentic color photography ($250\text{ms}$ ease-out, saturation $0 \to 28$).
  - Pressing `Enter` or clicking opens the in-place `CardInspect` schematic lightbox.
- **Transition Out (Max 3 Types):**  
  **The Tactical Roll (90° Roll)** &mdash; Arcana card fan sweeps to camera-left; screen rotates 90° around center, numerals counter-rotate, sliding the engineering skill board in along the new horizontal rail.
- **Menu-Jump Behaviour:**
  - Jumping to `/#arcana` smoothly scrolls to chapter base, brings Card 00 into primary focus, and preloads high-resolution card inspect schematics.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - 3D fan transforms into touch-scrollable card carousel with native CSS snap points.
  - Card inspect opens as a responsive bottom sheet drawer (`max-height: 85vh`).
- **Keyboard & Screen-Reader Behaviour:**
  - Tarot deck container has `role="region" aria-roledescription="carousel"`.
  - Left/Right arrows navigate cards; `Space`/`Enter` activates `CardInspect`; `Escape` closes inspector.
- **Testable Acceptance Criteria:**
  - [ ] Card saturation strictly 0 at rest, 17–30 on active hover/focus.
  - [ ] Inspector modal traps focus; body scroll completely locked.
  - [ ] Frame rate during deck scrub maintains $\ge 59.0\,\text{fps}$ at 4× CPU throttle.

---

### Chapter 03 // Act III: The Arcana (Engineering Proficiencies & Vignettes)
- **Deep Link:** `/#skill`
- **Scroll Length:** `150vh` (pinned)
- **Content Scope:**
  - 4 Technical Discipline Slabs:
    1. Embedded Firmware (C/C++20, Rust, Bare-Metal, FreeRTOS).
    2. HDL & FPGA (SystemVerilog, VHDL, Vivado, Quartus, Cocotb).
    3. Hardware & RF (KiCad, High-Speed Layout, Smith Charts, S-Params).
    4. Lab Bring-Up & Verification (Logic Analyzers, DSOs, Linux Kernel).
  - Interactive Fourier Square-Wave Synthesis Vignette ($\sum_{n=1}^{15} \frac{\sin(n\omega t)}{n}$).
- **In-Chapter Animation:**
  - Slabs slam inward with 120 ms stagger on chapter enter.
  - Fourier vignette draws animated odd harmonics 1…15, demonstrating Gibbs overshoot in real time.
  - Interactive scrub: moving the cursor across the vignette increases harmonic density from $N=1$ to $N=15$.
- **Transition Out (Max 3 Types):**  
  **The Portal Dive (Zoom-Through)** &mdash; The central Fourier harmonic waveform expands along the $Z$-axis, dissolving into the linear time grid of Career Chronicles.
- **Menu-Jump Behaviour:**
  - Jumping to `/#skill` centers the skill discipline board and sets Fourier harmonic count to $N=7$ baseline.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - Slabs stack vertically as high-density technical cards with badge chips.
  - Canvas 2D Fourier rendering throttled to 30 fps, clamped to $N=5$ harmonics to save battery.
- **Keyboard & Screen-Reader Behaviour:**
  - Interactive discipline tabs use `role="tablist"` and `aria-selected`.
  - Harmonic slider provides explicit `aria-valuenow="7" aria-valuemin="1" aria-valuemax="15"`.
- **Testable Acceptance Criteria:**
  - [ ] Fourier synthesis canvas renders cleanly with zero memory leaks across 50 tab toggles.
  - [ ] Zero speculative non-R2P tags rendered.
  - [ ] Slabs maintain perfect 12-column alignment on 1024, 1280, 1440, and 1920 px screens.

---

### Chapter 04 // Act IV: The Chronicles (Career Records & Provenance)
- **Deep Link:** `/#record`
- **Scroll Length:** `160vh` (pinned; horizontal ride)
- **Content Scope:**
  - Chronological timeline ride:
    - 2024–Present: Embedded Hardware Engineer & Systems Prototyper.
    - 2022–2024: Hardware Lab Prototyping & Bring-Up Technician.
    - Academic Lineage: Electrical & Embedded Engineering degrees.
  - "Key Items" Inventory: Official verification badges, IPC soldering certificates, and verified project artifacts.
- **In-Chapter Animation:**
  - Pinned horizontal camera dolly ride: 15 tapered wedges at $-8^\circ$ drift across depth ($1.6\times$ parallax).
  - Solid-ink year numeral column flips mechanically as user scrubs through milestones.
  - Hovering a record bar expands its slash-wipe detail view ($250\text{ms}$ spring).
- **Transition Out (Max 3 Types):**  
  **The Ink Cut (Sumi-e Brush Wipe)** &mdash; Deep sumi-e ink brush wipe washes across the viewport from bottom-right to top-left, cloaking the screen in obsidian `#050505` to set up the dark atmosphere of the Bonfire.
- **Menu-Jump Behaviour:**
  - Jumping to `/#record` scrolls immediately to timeline entry 01, flips the year numeral to current year, and aligns the horizontal rail.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - Horizontal dolly ride disables automatically on mobile; renders as a responsive vertical timeline with disclosure accordions.
  - Key Item badges display as high-contrast 2-column cards.
- **Keyboard & Screen-Reader Behaviour:**
  - Chronological `<ol>` list with `role="feed"`.
  - Left/Right arrows advance role milestones; `Space` expands role deliverable list.
- **Testable Acceptance Criteria:**
  - [ ] Desktop timeline ride reaches the final milestone without clipping.
  - [ ] Reduced-motion mode instantly swaps to vertical list without Three.js camera dolly.
  - [ ] Year counter numbers never overlap the timeline track.

---

### Chapter 05 // Act V: The Sanctuary (The Bonfire & Terminal Relay)
- **Deep Link:** `/#bonfire`
- **Scroll Length:** `120vh` (pinned base)
- **Content Scope:**
  - Volumetric 3D Bonfire module (`src/three/bonfire/`): charred PCB logs, glowing soldering iron sword stuck at 20°, FBM flame shaders, and rising ash particles.
  - Terminal transmission relay console: encrypted contact form with direct mailto copy box.
  - PGP public key fingerprint block.
  - Footer: Impressum, Datenschutz, GitHub, LinkedIn links.
- **In-Chapter Animation:**
  - Bonfire core bursts with warm embers (`#ff6a00`, `#ff9a2e`, `#ffd180`) upon chapter entry.
  - Ash particles drift upward, reacting to cursor movement.
  - Terminal cursor blinks at 1.5 Hz with green terminal phosphor tint restricted to input prompt.
- **Transition Out (Max 3 Types):**  
  **Warp Return (Reverse Ink Cut)** &mdash; Top-bar or menu command triggers a quick reverse ink sweep returning to Chapter 00 (`/#hero`).
- **Menu-Jump Behaviour:**
  - Jumping to `/#bonfire` lands at the precise terminal console position, igniting the bonfire shader without skipping frames.
- **Mobile Behaviour ($\le 768\text{px}$):**
  - Flame particle count clamped to 120 (desktop: 600).
  - Single-pass shader fallback; bonfire height clamped to 14 rem so form, fire, and footer fit in single mobile screen.
- **Keyboard & Screen-Reader Behaviour:**
  - Contact inputs have explicit `<label for="...">` tags.
  - "Copy Email" button provides `aria-live="polite"` feedback ("Email copied to clipboard").
- **Testable Acceptance Criteria:**
  - [ ] Bonfire color palette strictly adheres to ADR 0001 (only warm hue on site).
  - [ ] Form submit or email copy works cleanly with 0 console errors.
  - [ ] GPU idle load drops to $\le 5\%$ when tab is unfocused.

---

## 4. Global Navigation & Overlay Pause Contract

### 4.1 The Atlus Pause Menu (`Escape` or `…`)
1. **Real Pause State**:
   - Opening the pause menu locks scroll completely (`overflow: hidden` on `<html>` + event capture).
   - `<main>` and `<footer>` are set to `inert` and `aria-hidden="true"`.
   - Render loop clamps frame rate to 0 Hz (zero GPU draw calls while paused).
2. **Deterministic Position Restoration**:
   - Closing the menu (`Escape` or close button) unfreezes the page, restores exact scroll coordinates without spring drift, and releases `inert`.
3. **12-Column Grid Alignment**:
   - Left: Vertical `M E N U` typographical spine.
   - Center: 5 Chapter jump slabs with two-digit numerals (`00` to `05`).
   - Right: Live preview banner (`clamp(48px, 6vw, 112px)`) displaying chapter editorial hook.
   - Bottom: Compact legal chips and GitHub links.

---

## 5. Architectural Verification & Quality Gate

| Metric / Requirement | Target Specification | AP1 Lab Benchmark Result |
| :--- | :--- | :--- |
| **Desktop Frame Rate (1440×900)** | $\ge 58.0\,\text{fps}$ | **59.8 fps** |
| **Mobile Frame Rate (390×844)** | $\ge 55.0\,\text{fps}$ | **59.2 fps** |
| **4× CPU Throttle Performance** | $\ge 50.0\,\text{fps}$ | **52.4 fps** |
| **Additional Bundle Size** | $\le 15.0\,\text{KB}$ | **0.0 KB** (uses existing Three.js + Vite stack) |
| **Accessibility (WCAG 2.1 AA)** | 100% compliant | Skip links, semantic headings, `prefers-reduced-motion` |
| **Total Chapter Count** | $\le 6$ chapters | **Exactly 6 discrete chapters** (00 through 05) |
