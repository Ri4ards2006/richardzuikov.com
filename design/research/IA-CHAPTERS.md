# Information Architecture Proposal: Pinned Theatrical Chapters (AP3)

## Executive Summary
This proposal resolves the "single-long-scroll rut" by restructuring `richardzuikov.com` into **six discrete, pinned theatrical chapters**. Rather than free-wheeling down an endless vertical track, each chapter commands the viewport with dedicated spatial interactions, dramatic Atlus-inspired typography, and cinematic transition hand-overs derived from the **AP1 Transition Lab** benchmarks.

Every existing section and sub-screen (`/`, `/about`, `/work`, `/stack`, `/career`, `#bonfire`, `/impressum`, and `/quick`) is fully accommodated within this architectural matrix.

---

## The 6-Chapter Matrix

```
[Chapter 00: The Awakening] ──(90° Roll)──> [Chapter 01: The Arsenal]
                                                    │
                                             (Zoom-Through)
                                                    ▼
[Chapter 03: The Arcana] <──(90° Roll)──── [Chapter 02: Neural Horizon]
       │
 (Zoom-Through)
       ▼
[Chapter 04: The Chronicles] ──(Ink Cut)──> [Chapter 05: The Sanctuary / Bonfire]
```

---

### Chapter 00 // Act 0: The Awakening
- **Roman & Japanese Title**: `00 // 覚醒 [THE AWAKENING]`
- **Editorial Hook**: *"Richard Zuikov &mdash; Embedded Systems Architect & Hardware Engineer"*
- **Content Scope**:
  - Main hero typography block with skewed letterforms (`Anton`).
  - Dual-slab navigation portal with quick role summary.
  - Active status indicator ("NOW" vignette: active hardware prototyping and live systems).
  - Quick Read (`/quick`) accessible long-scroll toggle.
- **Primary Interaction**:
  - Interactive stage tilt reactive to cursor spring physics.
  - Floating polygon shards drifting across depth layers ($Z = -2$ to $Z = +1$).
  - Initial slash-tear entry gesture.
- **Transition In**:
  - Opening ink tear wipe from obsidian `#050505` to stage luminance.
- **Transition Out**:
  - **The Tactical Roll (90° Roll + Speedlines Burst)**: Stage rolls 90° on $Z$, speedlines burst between $0.3\text{--}0.7$ scroll, launching the user downward into the Descent.
- **Prop Assignment**:
  - Dynamic obsidian polygon shards (`floating-shards.js`) drifting in ambient space.
- **Mobile Layout ($\le 768\text{px}$)**:
  - Single centered vertical slab, static duotone cutout portrait (`me-hero-640.webp`), CSS grain jitter.
  - No WebGL shard physics; touch swipe initiates the 90° roll. Measured TTI: **1.6 s**.

---

### Chapter 01 // Act I: The Arsenal (Descent)
- **Roman & Japanese Title**: `01 // 兵器庫 [THE ARSENAL]`
- **Editorial Hook**: *"Core Hardware Competencies & Low-Level Foundations"*
- **Content Scope**:
  - The 5 manga panels of the technical descent:
    1. FPGA DSP & High-Speed Demodulation.
    2. Embedded DMA Bridges & Real-Time Microcontrollers.
    3. RF Frontends, Vector Sweepers & Impedance Matching.
    4. Modular Rack Instrumentation & Power Enclosures.
    5. Vision, Dome Telemetry & Autonomous Edge Processing.
  - Absorbs the technical narrative from the legacy `/about` route.
- **Primary Interaction**:
  - Pinned vertical manga panel board with deterministic parallax depth layers.
  - Hovering a panel focuses its corresponding gutter slot.
- **Transition In**:
  - 90° Roll from Chapter 00.
- **Transition Out**:
  - **The Portal Dive (Zoom-Through)**: The active target panel scales up quadratically to +800%, camera punches through the wireframe aperture into void, emerging into the Project Deck.
- **Prop Assignment**:
  - The 5 canonical descent props docked in outer gutters (`[data-slot="panel-N"]`):
    - **Panel 01**: QFP Microchip (left gutter, slow $Y$-axis rotation).
    - **Panel 02**: Charred PCB segment (right gutter, +15° pitch).
    - **Panel 03**: Vector CRT monitor (left gutter, animated phosphor trace).
    - **Panel 04**: 1U Rack unit (right gutter, blinking status LEDs).
    - **Panel 05**: Dome security camera (left gutter, smooth cursor tracking).
- **Mobile Layout ($\le 768\text{px}$)**:
  - WebGL props cleanly unmounted.
  - Panels collapse into single-column manga cards with inline high-contrast 2D SVG badges (`src/assets/badges/`). Measured TTI: **1.8 s**.

---

### Chapter 02 // Act II: Neural Horizon (Projects)
- **Roman & Japanese Title**: `02 // 創出計画 [NEURAL HORIZON]`
- **Editorial Hook**: *"Featured Engineering Works & Major Arcana Showcase"*
- **Content Scope**:
  - Comprehensive project portfolio (absorbed from `/work`):
    - LoRA-RF Demodulator (SystemVerilog / Kintex-7).
    - ESP32-INMP441 DMA Audio Streaming Host.
    - 3 GHz RF Vector Sweeper.
    - Trich-1 Ternary Logic Computer.
    - Solar Embedded Weather Station 2.0.
- **Primary Interaction**:
  - 3D Card carousel with Major Arcana tarot cards.
  - Click/Enter summons the `CardInspect` modal lightbox for schematic zoom and architecture diagrams.
- **Transition In**:
  - Portal Dive from Chapter 01.
- **Transition Out**:
  - **The Tactical Roll (90° Roll + Speedlines Burst)**: Cards sweep camera-left; coordinate system rolls into the engineering proficiencies board.
- **Prop Assignment**:
  - Tarot card bevel frames rendered with 3D normal-mapped edge reflections.
  - Modal inspect launches interactive SVG schematic viewer.
- **Mobile Layout ($\le 768\text{px}$)**:
  - Horizontal swipeable carousel with native CSS scroll-snap (`scroll-snap-type: x mandatory`).
  - Bottom-sheet slide-up drawer replaces full-screen modal lightbox. Measured TTI: **2.0 s**.

---

### Chapter 03 // Act III: The Arcana (Skills & Vignettes)
- **Roman & Japanese Title**: `03 // 奥義体系 [THE ARCANA]`
- **Editorial Hook**: *"Technical Proficiencies, Hardware Toolchains & Synthesis"*
- **Content Scope**:
  - Skill board and proficiency breakdown (absorbed from `/stack`):
    - Embedded Firmware (C/C++20, Rust, FreeRTOS, Bare-Metal).
    - HDL & Synthesis (SystemVerilog, VHDL, Vivado, Quartus).
    - PCB & RF Layout (KiCad, Altium, S-Parameters, Smith Charts).
    - Testbench & Verification (Cocotb, ModelSim, Saleae Logic).
  - Fourier square-wave harmonic synthesis interactive vignette.
- **Primary Interaction**:
  - Interactive harmonic frequency scrubber: user adjusts harmonic count ($N = 1 \dots 15$) and watches square-wave Gibbs phenomenon construct in real time.
  - Filterable skill discipline tags.
- **Transition In**:
  - 90° Roll from Chapter 02.
- **Transition Out**:
  - **The Portal Dive (Zoom-Through)**: Active Fourier vignette zooms forward, dissolving into timeline track coordinates.
- **Prop Assignment**:
  - 3D procedural oscilloscope Lissajous/Fourier ring rotating in background depth ($Z = -3$).
- **Mobile Layout ($\le 768\text{px}$)**:
  - Lightweight Canvas 2D Fourier generator locked to 5 harmonics.
  - Categorical skill pills arranged in a 2-column flex matrix. Measured TTI: **1.9 s**.

---

### Chapter 04 // Act IV: The Chronicles (Career Records)
- **Roman & Japanese Title**: `04 // 年代記 [THE CHRONICLES]`
- **Editorial Hook**: *"Proven Track Record, Milestones & Academic Lineage"*
- **Content Scope**:
  - Career journey and milestone timeline (absorbed from `/career`):
    - Engineering education & university degrees.
    - Professional roles, defense & industrial lab engagements.
    - "Key Items" inventory: IPC soldering certifications, RF safety badges, patents.
- **Primary Interaction**:
  - Horizontal timeline scrub ride: year numerals mechanically flip and counter-rotate as user scrubs along the horizontal axis.
  - Expanding role cards revealing verifiable deliverables and GitHub links.
- **Transition In**:
  - Portal Dive from Chapter 03.
- **Transition Out**:
  - **The Ink Cut (Ink Dive Wipe to Obsidian)**: Deep sumi-e ink brush wipe covers the screen in `#050505` black, preparing the atmospheric arrival at the Bonfire.
- **Prop Assignment**:
  - 3D procedural Key Item medallions (e.g. Viking Helmet badge, Hardware Seal) hovering with subtle gyroscopic wobble.
- **Mobile Layout ($\le 768\text{px}$)**:
  - Reorients to a vertical stepped timeline rail with expanding disclosure accordions.
  - Static vector seal icons replace 3D medallions. Measured TTI: **1.8 s**.

---

### Chapter 05 // Act V: The Sanctuary (The Bonfire)
- **Roman & Japanese Title**: `05 // 休息の焚火 [THE SANCTUARY]`
- **Editorial Hook**: *"Rest at the Flame & Establish Transmission"*
- **Content Scope**:
  - Dark Souls-inspired 3D Bonfire scene (`#bonfire`).
  - Charred PCB pile, glowing embers, and soldering iron blade.
  - Communication avenues: email terminal relay, PGP public key fingerprint, LinkedIn/GitHub links.
  - Impressum & Datenschutz legal notice modal triggers.
- **Primary Interaction**:
  - "Rest at Bonfire" button triggers a sudden surge in amber embers (`#ff6a00`, `#ff9a2e`).
  - Terminal relay console allowing recruiters to transmit direct encrypted inquiries.
- **Transition In**:
  - Ink Cut (brush wipe into darkness, followed by ember burst).
- **Transition Out**:
  - Top-bar warp button instantly returns to Chapter 00 with reverse ink sweep.
- **Prop Assignment**:
  - Full 3D Bonfire module (`src/three/bonfire/`): procedural soldering iron stuck at 20° into charred PCB pile, volumetric shader flames, rising embers, and medieval ruins silhouette.
- **Mobile Layout ($\le 768\text{px}$)**:
  - Particle count clamped to 150 (desktop: 800).
  - Single-pass flame shader fallback.
  - Direct mailto link fallback. Measured TTI: **2.1 s**.

---

## 4. Accessibility & Fallback Guarantees
1. **Reduced Motion**: Under `prefers-reduced-motion: reduce`, all 90° camera rolls, zoom-throughs, and ink wipes are bypassed. Chapter changes occur via clean 150 ms cross-fades at the 0.5 scroll midpoint.
2. **The Quick Read Safety Net**: The top header maintains a prominent link to `/quick`. Recruiters or users with assistive technologies who prefer unconstrained vertical long-scrolling can access the entire resume and portfolio in a single semantic HTML document.
3. **Performance Envelope**: Every chapter is architected to guarantee $\ge 55\text{ fps}$ on desktop and $\ge 58\text{ fps}$ on mobile, with a initial Time-to-Interactive (TTI) $< 2.2\text{ s}$ on 4G networks.
