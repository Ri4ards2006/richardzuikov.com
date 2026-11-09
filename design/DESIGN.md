# RZ — Design Bible (source of truth)

Read this file completely before every task on the home experience.
If a request conflicts with this file, stop and ask. Do not "tone things down" on your own — boldness is a requirement here.

---

## 0. Concept

The site is the **pause menu of Richard's save file**.
A first-time visitor gets a short cinematic intro, lands on an Atlus-style menu stage, and then either
**selects a menu item** (the camera flies to that section) or **scrolls** — the camera descends through the
sections, deeper and darker, until it reaches the only warm light on the whole site: the **bonfire** (contact).

- Above: cold, monochrome manga-ink world (Persona 5 / Persona 3 Reload / Metaphor: ReFantazio structure).
- Bottom: the quiet Dark-Souls world.
- `/quick` stays as the plain, fast recruiter version (linked from the HUD). Because it exists, the main
  experience does not need to compromise.

---

## 1. References

- `design/storyboard/card-01.png … card-05.png` — **binding** storyboard (composition, timing, camera).
  The character drawn in card 03 is a placeholder for Richard's own ink portrait.
- `design/refs/` — **local only, gitignored** (game screenshots are third-party IP): P3R menu, P5 menu,
  Metaphor menu, Dark Souls title screen, DS3 web layout, Richard's old menu overlay. Style reference only.
- Never copy assets, fonts, wording, logos, music or code from the games or from the GitHub portfolios
  `RohitPoul/Person-3-Reload-Potfolio` / `GiaVinh19/darkest-souls-portfolio` (no license).
- Already good — keep as the baseline and level up, do not throw away:
  `/work` arcana cards, `/stack` ranked list, `/contact` "REST HERE, TRAVELLER" typography and slab buttons.

---

## 2. Palette

```
--ink-0  #050505   abyss / page background
--ink-1  #0d0d0d
--ink-2  #121212   charcoal surfaces
--ink-3  #1e1e1e
--ash-1  #3a3a3a   lines, inactive
--ash-2  #6b6b6b
--ash-3  #8a8a8a   minimum for secondary text on dark
--bone   #cfccc5
--paper  #f4f4f0   inversion slabs, primary text
```

Rules
- **No hue anywhere except inside the bonfire zone.** Remove `#FFB000` and every amber / pink / rose / red token from the codebase.
- Accent = **inversion** (paper slab + ink text), halftone, ink splatter, white speedlines.
- No soft UI gradients. Tonal changes are screentone/halftone or hard edges. Soft light only for fog, water light and the fire.

Warm zone (only inside §7 Card 05, fading in from scroll 55 %):
```
--ember  #ff6a00
--flame  #ff9a2e
--glow   #ffd180   hover text in the bonfire menu only
```

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Menu slabs, headlines, HUD titles | **Anton** | caps, slanted via transform, tight tracking |
| Story / serif moments | **Cinzel** | bonfire, section epigraphs, KEY ITEMS titles — the bridge between Metaphor and Souls |
| Data, HUD labels, boot log | existing mono | |
| Body | existing sans | max 68ch, min 16px |

Ransom-note treatment (P5): max 1–2 words per screen (e.g. "WHO AM I"). Letters in mixed fonts/sizes on small
paper/ink boxes, slight rotation from a fixed seed (stable between renders).

---

## 4. Shape & texture vocabulary

- **Slab** — parallelogram / asymmetric quad, angles 6–14°. `border-radius: 0` everywhere in the experience.
- **Wedge** — sharp paper triangle that shoots out behind the active item (120 ms).
- **Shards** — Voronoi fragments (3D in WebGL, polygon `clip-path` in CSS).
- **Ink** — splatters and brush strokes, generated in code (noise-displaced paths), framing the portrait and impact moments.
- **Screentone** — halftone dot overlay; cross-hatching for the deepest shadows.
- **Speedlines** — radial white lines, only on impact moments.
- **HUD rings** — thin concentric circles + crosshair ticks around the portrait.
- **TraceStar** (signature glyph, replaces P5 stars) — asymmetric 4-point compass star built from PCB traces:
  one long north point, traces with 45° bends, via dots at the ends. One SVG component `<TraceStar/>` used as
  bullet, separator, loader, scroll cue, favicon variant.
- **Grain** — subtle animated film grain over everything (canvas-generated, ~8 % opacity).

---

## 5. Motion rules

- **Snap, don't glide.** UI transitions 120–220 ms, `cubic-bezier(.2,.9,.1,1)` with 2–4 px overshoot.
- **Impact frames** at key moments: max 2-frame invert (never a longer full-screen white flash — photosensitivity), speedlines, 2° camera nudge.
- **Boil** — hand-drawn elements (ink strokes, splatters) cycle 3 variants at 12 fps.
- **One camera.** All 3D is seen through one camera; scroll = camera rail; damping `y += (target − y)·(1 − e^(−γΔt))`.
- **Idle life** — every screen has something slowly moving (dust, screentone particles, breathing portrait, drifting shards). Nothing fully static.
- **prefers-reduced-motion** — no intro, no camera moves, no boil/parallax, instant state changes, static stills per section.

---

## 6. Information architecture

Home `/` = one page: one fixed WebGL canvas behind, HTML sections on top.

| # | id | Menu item | Screen | Content |
|---|---|---|---|---|
| 00 | `intro` | – | Card 01–02 | preload → tear → shatter → dive |
| 01 | `stage` | – | Card 03 | menu stage, portrait, HUD |
| 02 | `who` | ABOUT | STATUS | who I am (3–4 sentences), ink portrait detail, optional stat hexagon |
| 03 | `heading` | ABOUT | HEADING | where I'm heading (2027 goal, focus areas) |
| 04 | `arcana` | WORK | ARCANA | 3 featured tarot cards; "ALL PROJECTS →" `/lab` |
| 05 | `skill` | STACK | SKILL | condensed ranked list + vignettes; "FULL INDEX →" `/stack` |
| 06 | `record` | CAREER | RECORD | calendar timeline + KEY ITEMS (certificates); "FULL RECORD →" `/career` |
| 07 | `bonfire` | CONTACT | BONFIRE | Card 05 |

- Menu click / Enter → camera flies to the section (Lenis `scrollTo` driving the camera rail).
- Deep pages `/about /work /stack /career /contact` stay as full screens in the same vocabulary.
- **Global nav:** once scrolled past the stage, a fixed top-right `…` button opens the full-screen MENU overlay
  (Richard's original overlay with the vertical "MENU" letters — restyled monochrome, slab items, shard transition).
  Language + theme toggles live there.
- **HUD (stage only):** top-left status chip `STATUS: AVAILABLE · FLENSBURG`; top-right GitHub / LinkedIn / CV / Mail
  as slanted chips; bottom-right control hints + `QUICK READ →`; bottom-centre `SCROLL TO DESCEND` with TraceStar.

---

## 7. Storyboard spec (binding)

### Card 01 — Preload & tear (0 – 0.9 s)
- The bar is a **real preloader** (three.js LoadingManager + fonts + textures + 3D chunk). Minimum 0.6 s, otherwise real load time. This is what makes the intro worth having: it hides the 3D loading.
- Boot log above the bar, mono, 3–4 lines typed fast, dry and personal (translation keys, editable), e.g.
  `probing i2c bus … 3 projects found` · `mounting /dev/portfolio` · `flashing firmware ████ 100%`.
- At 100 %: the plate **tears diagonally** like paper (ragged edge, debris, ink fibres) and reveals "RICHARD ZUIKOV" on halftone. No electric flash.
- Once per session. Any click/key skips. Repeat visits in the same session start at the stage.

### Card 02 — Shatter & dive (0.9 – 2.2 s)
- Name plate = plane textured with the rendered name, split into 24–40 Voronoi cells (`d3-delaunay`), each extruded (`ExtrudeGeometry`, depth ≈ 0.04) with matching UVs.
- Fragments get a radial impulse from the tear line + angular velocity. Simple custom physics per fragment
  (velocity, gravity, linear + angular drag). No physics engine, no web workers — 40 bodies don't need them.
- Camera: 12° dutch tilt, z 15 → 5 (easeOutCubic), dives through a dark reflective **ink mirror** plane with ripple + ink droplets passing the lens. Monochrome chromatic aberration + motion blur proportional to camera speed.
- Five large fragments decelerate hard (damping jumps at 1.8 s) and snap into the 5 menu slab positions; then cross-fade WebGL slabs → HTML slabs at identical screen positions (crisp text, accessible).

### Card 03 — Hero stage (idle + hover)
- **Left:** 5 slabs as a real HTML `<nav>` with CSS 3D (`perspective: 900px`, `rotateY(-18deg)`, `rotateZ(-6…-10deg)`), each its own size and offset, mono numbers 01–05 beside them.
- **Hover / focus / arrow keys:** paper wedge shoots out behind the item (120 ms), item inverts, 2° camera nudge, speedlines + tiny debris at the slab edge, large echo text ("03 STACK").
- **Right:** Richard's ink portrait in 3 layers — (1) splatter + HUD rings, (2) figure, (3) foreground brush strokes. Parallax opposite to the mouse (0.5 / 1.5 / 3 %), boil on strokes, breathing scale 1 → 1.012.
  Ink treatment in a shader: threshold to 2–3 tones + halftone in mid-tones + darkened edges.
- **Background:** replace the soft caustics with **hard ink water**: caustics posterized to 3 tones + screentone + floating screentone dust.
- First wheel/scroll on the stage starts the descent. Arrow keys navigate the menu.

### Card 04 — Descent (scroll)
- Fixed canvas, camera rail y 0 → −60. HTML content sits in **slanted manga panels** (3 px paper borders, gutters, angled cuts) that pass at different depths (parallax). Speedlines on fast scroll.
- **who / heading:** panels with ransom-note headline "WHO AM I" / "WHERE I'M HEADING", short text, ink portrait detail.
- **arcana:** entering the section deals the 3 cards onto a table (fly in, slam, small bounce, dust puff). Scroll progress rotates the fan. Hover = 3D tilt + silver sheen sweep. Click flips (front: halftone image, roman numeral, title; back: specs, tags, repo link). Frame drawn as SVG, no image.
- **skill:** list tilted in 3D; active item = asymmetric paper slab. Right panel: animated monochrome mini vignette per category — Low-level: source → asm → hex scrolling; Systems: rack with blinking LEDs; Hardware: oscilloscope trace; Web: browser wireframe assembling itself. The empty space below is filled by a detail panel for the selected item.
- **record:** years as big Anton numerals that **flip like a calendar** while scrolling; each role slides in as a slanted bar with rank pips. **KEY ITEMS:** certificates as a Souls-style inventory grid (square tiles, generic line icons — no brand logos). Selected tile → right panel: title (Cinzel), issuer, date, one dry flavor-text line (editable), verify link only when it points at that exact credential.
- 55 – 80 %: panels fade, darkness grows, ash particles shift colour into embers.

### Card 05 — Bonfire (80 – 100 %)
- Camera lands low-angle (pitch ≈ +8°) on a stone floor (Poly Haven CC0 PBR texture, committed, source logged in `design/ASSETS.md`).
- **Bonfire built procedurally in R3F** (no external model needed):
  - ring of low-poly stones (icosahedrons with noise displacement),
  - pile of charred PCB fragments (thin boxes, canvas-generated trace textures, emissive glowing edges),
  - **soldering iron** stuck in diagonally (`LatheGeometry` profile: tip, barrel, grip; cable = `TubeGeometry` along a CatmullRom curve),
  - flames = 2–3 crossed billboards with an fbm flame shader (additive),
  - 120 instanced embers rising with sine drift,
  - PointLight `#ff6600`, flicker `Φ(t) = base + A1·sin(ω1t) + A2·sin(ω2t) + A3·noise(4t)`,
  - selective bloom on the fire only, vignette.
- **UI left:** Cinzel "REST HERE, TRAVELLER" (translation key), Souls-style list with selection marker:
  `> SEND MAIL` · `> COPY MAIL` · `> CV (PDF)` · `> GITHUB` · `> LINKEDIN`. Hover ash-grey → `--glow`.
- First arrival per session: Cinzel line "CONNECTION KINDLED" (keep).
- Footer with Impressum / Datenschutz below the bonfire, plain and readable.

---

## 8. Tech

- React 18 + `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap` (+ ScrollTrigger), `lenis`, `d3-delaunay`.
- **One `<Canvas>` for the whole home.** No second WebGL context — port `CausticsBackground` into it.
- The 3D chunk is lazy-loaded while the boot log runs.
- **Fallbacks:** no WebGL → static stills per section + full HTML content. Reduced motion → §5.
  Mobile < 768 px: 12 fragments, no reflector, DPR 1, portrait 2 layers, simplified bonfire without bloom.
- **Accessibility:** every interactive element is real HTML (nav, buttons, links). WebGL is decoration. Visible focus, AA contrast, "skip intro" button.
- **Budgets:** `/quick` Lighthouse mobile perf ≥ 95. `/` mobile ≥ 70, desktop ≥ 85. No long task > 200 ms after the intro.
  60 fps desktop, 30 fps mobile. 3D chunk ≤ 400 KB gzip.

---

## 9. Assets

- Portrait: drop photos into `src/assets/portraits/raw/` → `npm run portraits`. Layer split via manual masks; optional depth map generated locally.
- Textures: Poly Haven CC0 only, logged in `design/ASSETS.md`. Everything else is generated in code.
- Never: game assets, brand logos for certificates, copyrighted music. No sound for now.

---

## 10. Review loop (mandatory for every task)

1. `npm run build && npx vite preview`.
2. Playwright screenshots at 1440×900 and 390×844; for animations an 6-frame strip at fixed timestamps.
3. Compare against `design/storyboard/` and `design/refs/`. Write down 3 concrete weaknesses
   (e.g. "slabs too flat: 4° instead of 10°", "portrait reads as photo, not ink") and fix them. Repeat at least twice.
4. Then commit (conventional commits), push, and report: what changed, screenshot paths, preview URL, open issues.

## 11. Definition of done ("it kicks")

- Within 3 s a first-time visitor has seen motion, depth and the name, and understands they can click or scroll.
- Every screen has at least: one 3D/depth element, one ink/screentone texture, one idle motion, one slab/shard shape.
- Nothing looks like a default component: no rounded cards, no default shadows, no plain bullet lists.
---

## §12 Implementation notes

Factual state of the build. The rules above win over anything noted here.

**Files**
- Home: `src/pages/Stage.jsx` (DOM), `src/components/stage/scene.js` (three.js), `src/components/stage/IntroOverlay.jsx`.
- Tokens: `src/css/tokens.css`, exposed through `tailwind.config.cjs`. Stage styles: `src/css/style.scss`.
- Menu data and selection memory: `src/lib/atlus.js`. Route transition: `src/hooks/use-wipe-location.js`.
- Tarot data: `src/data/featured-projects.js`. Portraits: `src/data/portraits.js`, `scripts/portraits.sh`.
- Generated textures: `src/lib/noise-textures.js`. Quick read: `src/pages/Quick.jsx`, `src/components/home/`.

**Chunks** (gzip, 2026-11-09): initial JS 76.6 KB; `scene` (three.js) 148.4 KB, within the 400 KB budget; `/about`, `/work`, `/stack`, `/career`, `/lab`, `/impressum` load lazily.

**Decisions**
- The home uses plain `three` with one renderer, not R3F (see TASKS.md for the §8 gap).
- WebGL objects are placed over measured DOM anchors, so text and links stay real HTML.
- All shaders compile with `renderer.compileAsync` before the render loop starts; the first shatter frame used to block for 1.1 s.
- The render loop idles at 30 fps without input and is capped at 30 fps below 768 px; it stops while the tab is hidden.
- Tarot images load near the viewport and are downscaled with `createImageBitmap`.
- `Stage.jsx` stays in the initial bundle: lazy-loading it moved its startup work behind First Contentful Paint and raised Total Blocking Time.
- `/contact` redirects to `/#bonfire` by owner decision, which differs from §6. `src/pages/Contact.jsx` and `FogGate.jsx` are kept unrouted until that is settled.
