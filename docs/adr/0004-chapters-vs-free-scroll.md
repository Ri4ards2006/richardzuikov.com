# 4. Pinned Discrete Chapters vs. Continuous Free-Scroll

Date: 2026-11-10

## Status
Proposed

## Context
The current portfolio operates on a single, continuous, free-wheeling vertical scroll rail from `/` (Hero) through Descent, Projects, Skills, Records, down to the Bonfire.
While functional, user feedback and design reviews indicate that free continuous scrolling creates:
1. **The "Single-Long-Scroll Rut"**: Sections blend together into an endless vertical stack without distinct thematic identity or dramatic punctuation.
2. **Spatial Disorientation**: Users scroll past dense technical projects without pausing to absorb the architecture.
3. **Missed Atlus Persona Tone**: Games like *Persona 5* and *Metaphor: ReFantazio* thrive on bold chapter title slabs, dramatic camera cuts, and theatrical transition pauses.

In Action Package 1 (AP1), we implemented an isolated transition playground (`/labs/transitions.html`) and benchmarked four scroll-scrubbed transition paradigms at 60 fps (documented in `design/research/TRANSITIONS.md`).

## Decision (Proposal)
Migrate the portfolio architecture from a free unconstrained scroll into **5 to 6 pinned, discrete narrative chapters**:

### The 6 Proposed Chapters
1. **Chapter 00: Act I &mdash; The Forge (Hero & Introduction)**
   - Character introduction, title block, and interactive stage slabs.
2. **Chapter 01: The Arsenal (Embedded Hardware & Descent)**
   - FPGA demodulators, hardware instruments, and the 5 interactive 3D manga panels.
3. **Chapter 02: Neural Horizon (Projects & Firmware Deck)**
   - Major Arcana tarot cards, schematic inspections, and low-level system designs.
4. **Chapter 03: The Arcana (Engineering Proficiencies)**
   - Interactive skill matrices, Fourier frequency vignettes, and verification frameworks.
5. **Chapter 04: The Chronicles (Career Records & Provenance)**
   - Timeline records, role milestones, and verifiable GitHub/academic artifacts.
6. **Chapter 05: The Sanctuary (The Bonfire & Comms)**
   - The dark souls bonfire with glowing soldering iron, terminal relay, and direct contact avenues.

### Structural Mechanics
- **Pinned Stage During Exploration**: While exploring a chapter, the viewport is pinned, allowing horizontal scrubbing, modal card inspections, or vertical panel reading.
- **Theatrical Transitions Between Chapters**:
  - Hand-off between Chapter 01 and 02 uses **The Tactical Roll** (90° camera roll + speedline burst).
  - Transition into deep-dive schematics uses **The Portal Dive** (quadratic zoom-through).
  - Landing at the Bonfire uses **The Ink Cut** (sumi-e brush wipe to obsidian).

## Consequences
- **Positive**:
  - Unlocks authentic Atlus theatrical pacing.
  - Eliminates scroll fatigue and anchor overshoot.
  - Benchmarked at **59.2–60.0 fps** on mobile and desktop with zero extra bundle dependencies.
- **Negative**:
  - Requires updating the navigation router and keyboard navigation logic (`PageUp`/`PageDown`, arrow keys) to step through chapters.
  - Quick Read (`/quick`) must remain available as the fallback long-scroll resume document for users who prefer unconstrained scrolling.
