# Design Review: PR #9 (Bonfire v3)

- **Target PR**: `#9` (`feat/bonfire-v3` → `feat/atlus-menu`)
- **Review Date**: 2026-11-09
- **Review Artifacts**:
  - `design/assets-src/bonfire-v3-1440-full.png` (Desktop full section)
  - `design/assets-src/bonfire-v3-1440-closeup.png` (Desktop close-up crop)
  - `design/assets-src/bonfire-v3-390-full.png` (Mobile full section)
  - `design/assets-src/bonfire-v3-390-closeup.png` (Mobile close-up crop)

---

## Executive Verdict

### 1. Does the soldering iron instantly read as a soldering iron?
**YES.** The v3 redesign resolves the previous "fencing foil / skewer" issue:
- **Defining Anatomy**: The 6-sided hex retaining nut (`radius 0.048, height 0.065`) and the flanged finger-guard disc (`radius 0.148`) between the barrel and grip break the continuous cylindrical silhouette, establishing an unambiguous Hakko/Pinecil/Weller tool profile.
- **Proportions**: Scaled down (`scale: 0.72`) relative to the bonfire fuel pile. Total length ~1.2 units (realistic 30 cm hand tool stuck into a 1.2 m stone hearth) rather than the previous 3.05 unit spear.
- **Planted Angle**: Firmly planted at ~20° from vertical (`0.35 rad`) into the charred PCB and glowing coal mound.
- **Cable Compliance**: Strictly zero cable, terminating cleanly with a molded strain-relief socket cap.
- **Silhouette Test**: Black-on-white rendering confirms the tip, collar, nut, guard disc, and ribbed grip register distinctly.

### 2. Does the scene look precise rather than blocky?
**YES.** The bonfire has transitioned from a blocky prototype to a precise, atmospheric Dark Souls / Atlus set-piece:
- **Tighter Core & Layered Tongues**: A dual-plane incandescent white-gold core (`vec3(1.0, 0.99, 0.92)`) anchors the flame base, surrounded by multi-tier domain-warped FBM quads producing curling, aerodynamic flame licks rather than a generic billowy blob.
- **Atmospheric Heat Haze**: A subtle transparent refraction shimmer directly above the flames (`y: 1.45 to 2.4`) conveys intense rising convective heat.
- **Dynamic Embers & PCB Veins**: Sparks feature chaotic high-frequency twinkling (`uTime * 38.0`) and spiraling vortex drift; the PCB atlas includes incandescent solder pads and cracked thermal veins synchronized with light flicker.
- **Depth & Background Ruins**: Low-poly medieval ruins (broken watchtower, crumbling gothic arches, stepped curtain walls) emerge on the right against distance fog, while the left background remains pitch-dark (mean RGB ~19) for AAA contrast under *"REST HERE, TRAVELLER"*.

---

## Concrete Findings (Max 8)

| # | Where | Expected | Actual | Priority |
|---|---|---|---|---|
| **01** | `src/three/bonfire/iron.js`<br>Soldering Iron Grip | Ribbed rubber grip should catch subtle rim highlight from the fire PointLight | Grip material roughness is 0.88 with low metalness; against distant dark ruins, the ribbed texture is primarily visible via silhouette rather than surface lighting | **P3** (Polish) |
| **02** | `src/three/bonfire/flames.js`<br>Flame Core Placement | Flame core should emerge directly out of the charred PCB coal bed | Dual core quads sit at `y: 0.20`, perfectly seated inside the glowing ash depression without ground clipping | **Pass** |
| **03** | `src/three/bonfire/ruins.js`<br>Left Background Void | Background behind *"REST HERE, TRAVELLER"* typography must stay dark to maintain WCAG AAA contrast | Left background (`x < 0`) has mean RGB ~19 with no architectural structures, ensuring >12:1 contrast against `#f4f4f0` text | **Pass** |
| **04** | `src/three/bonfire/ruins.js`<br>Distant Architecture | Medieval ruins on the right should evoke a crumbled Dark Souls sanctuary without exceeding polygon budgets | Low-poly merged geometry featuring an 8-sided jagged watchtower, gothic arch, and stepped curtain wall; vertex-color depth fade smoothly dissolves distant vertices into abyss fog | **Pass** |
| **05** | `src/three/bonfire/particles.js`<br>Sparks & Embers | Sparks should flicker erratically rather than fade linearly | High-frequency sinusoidal sparkle modulation (`sin(uTime * 38.0 + vSeed * 73.1)`) and occasional burst pops create authentic rosin/flux fire pops | **Pass** |
| **06** | `src/three/bonfire/flames.js`<br>Heat Haze on Mobile | Transparent heat haze quad could cause fillrate penalty on low-end mobile GPUs | Heat haze quad is conditionally disabled on mobile (`if (!q.small)`), eliminating transparent overdraw on mobile devices | **Pass** |
| **07** | `src/three/bonfire/index.js`<br>Floor Slabs Grid | Floor paving slabs should cover the view without redundant off-screen instances | Desktop instanced slabs run 11×8 (88 instances); mobile dynamically clamps to 7×6 (42 instances), cutting draw overhead by >50% | **Pass** |
| **08** | `src/three/bonfire/ruins.js`<br>Bottom-Left Stone Wall | Foreground framing wall on bottom-left should ground the frame without occluding the email copy box | Low ruined stone wall courses run from `x: -3.4, z: 1.4` to `x: -1.6, z: 0.4` at height `y: 0.24`, sitting comfortably below the contact menu links | **Pass** |

---

## Recommendation

**PR #9 is fully approved for merge into `feat/atlus-menu`**.
- All requirements of `DESIGN.md` §7 Card 05 and §13 owner decisions are satisfied.
- Performance remains within the ≤3 ms/frame budget (~0.002 ms CPU frame update).
- The visual identity successfully marries Atlus high-contrast manga structure with Dark Souls bonfire atmosphere.
