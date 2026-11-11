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
- **Rest state is monochrome. Color appears only (a) in the bonfire and (b) as the real color of real photos while the user interacts with them. UI chrome, text, frames and backgrounds never get color.** (v6)
  - Works / arcana cards: photo grayscale at rest → original colour on hover / focus, 250 ms ease-out; nothing else changes (no glow, frame stays monochrome). Touch: the centred deck card and the card in the inspect view are in colour. Reduced motion: instant.
  - Portraits of Richard (v7, Richard's call): the black-and-white cut-out at rest → the real colour photo on hover / focus and for the whole stage → about turn, 300 ms ease-out cross-fade. Touch: colour on tap or while the portrait's centre sits in the middle 20 % of the viewport. Reduced motion: instant swap. Same rule as the cards; no tint, no glow, plain ink behind (§18 "Portraits").
  - Earned certificate badges on the KEY ITEMS back are shown unmodified, in their own colours (§7).
- No hue in UI tokens: remove `#FFB000` and every amber / pink / rose / red token from the codebase.
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
| 01 | `stage` | – | Card 03 | menu stage, front-facing portrait, HUD |
| 02 | `about` | ABOUT | ABOUT | who I am, what I do, what I'm into; side-profile portrait (see §13) |
| 03 | `descent` | – | FROM PIN TO PACKET | 5 panels at different depths with line illustrations and one 3D prop each (see §15) |
| 03b | `now` | – | NOW / IN PROGRESS | 3 slanted quest-log panels: TRICH-1, home-lab cluster, apprenticeship (see §15) |
| 04 | `heading` | ABOUT | HEADING | where I'm heading (2027 goal, focus areas) |
| 05 | `arcana` | WORK | ARCANA | 3 featured cards + browsable deck of all projects; both open the inspect view (see §14) |
| 06 | `skill` | STACK | SKILL | condensed list with "used for / where" tags, no ratings + vignettes; "FULL INDEX →" `/stack` |
| 07 | `record` | CAREER | RECORD | camera yaws 90°, pinned horizontal timeline ride (see §15); "FULL RECORD →" `/career` |
| 08 | `bonfire` | CONTACT | BONFIRE | Card 05 |

- Menu click / Enter → camera flies to the section (Lenis `scrollTo` driving the camera rail) and lands on its resting state. CONTACT goes to the very end of the rail.
- Deep pages `/about /work /stack /career /contact` stay as full screens in the same vocabulary. `/lab` redirects to `/#arcana`.
- **Global nav:** a fixed top-right `…` button, always visible on home and deep pages, opens the full-screen Atlus-style MENU overlay
  (Richard's original overlay with the vertical "MENU" letters — restyled monochrome, slab items, shard transition).
  It holds the sections, Quick Read, DE/EN, theme, GitHub / LinkedIn / Mail, Impressum and Datenschutz.
- **HUD (stage only):** bottom-right control hints + small `QUICK READ →` link; bottom-centre `SCROLL TO DESCEND` with TraceStar.
  No status chip. The top-right corner belongs to the `…` button and the name block.
- **Numbering:** sections, menu items and panels use one format, mono `01 /`.

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
- **Name:** big angled Anton block "RICHARD / ZUIKOV" top-right (Persona style), small role line underneath. No name or role line above the menu.
- **Left:** 5 slabs as a real HTML `<nav>` with CSS 3D (`perspective: 900px`, `rotateY(-18deg)`, `rotateZ(-6…-10deg)`), up to ~120 px on desktop, each its own size and offset, mono numbers `01 /`–`05 /` beside them.
- **Hover / focus / arrow keys:** paper wedge shoots out behind the item (120 ms), item inverts, 2° camera nudge, speedlines + tiny debris at the slab edge, large echo text ("03 STACK").
- **Right:** Richard's front-facing ink portrait in 3 layers — (1) splatter + HUD rings, (2) figure, (3) foreground brush strokes. Parallax opposite to the mouse (0.5 / 1.5 / 3 %), boil on strokes, breathing scale 1 → 1.012. No diagonal line across the portrait.
  Ink treatment in a shader: threshold to 2–3 tones + halftone in mid-tones + darkened edges.
- **Background:** **hard ink water** instead of the halftone ellipse band: caustics posterized to 3 tones + screentone + floating screentone dust.
- **Floating shards:** 30–40 flat-shaded grey 3D shards with depth fade, slow rotation, pushed away by the cursor and springing back. They continue into the descent (see Card 04).
- First wheel/scroll on the stage starts the descent. Arrow keys navigate the menu.

### Card 04 — Descent (scroll)
- Fixed canvas, camera rail y 0 → −60. HTML content sits in **slanted manga panels** (3 px paper borders, gutters, angled cuts) that pass at different depths (parallax). Speedlines on fast scroll.
- **about:** directly after the stage. Who I am, what I do, what I'm into, from translation keys. Side-profile portrait with a softer treatment than the stage (high-contrast grayscale, fine screentone only in the shadows). Stage → About it turns ~90° on Y toward the viewer and moves forward/larger, leaving 5–6 delayed monochrome ghost copies that fade out. Leaving About it dissolves into halftone dots. Side-profile placeholder silhouette until the real photo exists.
- **descent ("From Register to Network"):** no dot-grid or KiCad-paper background anywhere. Five panels: 01 Register-Level Architecture · 02 Hardware & PCB · 03 Why C++ & Go · 04 Cluster & Infrastructure · 05 Lab & Development Path. Different depths with parallax and entrance motion (slide + slight rotation + slam), each with a small animated monochrome line illustration (register bits flipping, SCK/MOSI waveform, code typing, node graph with pods and heartbeat, trace pulse). 2–3 sentences each. 2–3 slow-rotating low-poly monochrome 3D props sit beside their panels, never in front of text.
- **heading:** panel with ransom-note headline "WHERE I'M HEADING", short text.
- **arcana:** game-card style with roman numerals, no occult symbols, no slogan headlines. Entering the section deals the 3 cards onto a table (fly in, slam, small bounce, dust puff). Scroll progress rotates the fan. Hover = 3D tilt + silver sheen sweep. Click opens the inspect view (see §14). Front: high-contrast grayscale image with very fine screentone, object recognisable, roman numeral centred at the top, title. Frame drawn as SVG, no image. Below: a browsable deck of all projects (data from Lab) as smaller cards in a fan/carousel (drag, wheel, arrow keys); a click on the selected card opens the same inspect view. Rack Configurator is one card in the deck.
- **skill:** no ratings; each item shows short "used for / where" tags. List tilted in 3D; active item = asymmetric paper slab. Right panel: animated monochrome mini vignette per category — Low-level: source → asm → hex scrolling; Systems: rack with blinking LEDs; Hardware: oscilloscope trace; Web: browser wireframe assembling itself. The empty space below is filled by a detail panel for the selected item.
- **record:** years as big Anton numerals that **flip like a calendar** while scrolling; each role slides in as a slanted bar with a roman rank. **KEY ITEMS:** certificates as a Souls-style inventory grid. Front: the exam code as the emblem (AZ-900, CCNA, CKA …) in Anton inside the frame plus one small generic line glyph. Flip / inspect back: the **official earned badge**, shown unmodified and in colour (§2), linked to its verification URL only when that URL points at that exact credential; files come from Richard as `src/assets/badges/<id>.png` (never scraped or redrawn), until then the back keeps the line icon. Earned badges are allowed on the back only; **no standalone company logos anywhere.** Selected tile → right panel: title (Cinzel), issuer, date, one dry flavor-text line (editable).
- One continuous particle story: stage shards continue into the descent, thin out and turn into rising ash, which becomes embers at the bonfire.
- 55 – 80 %: panels fade, darkness grows, ash particles shift colour into embers.

### Card 05 — Bonfire (80 – 100 %)
- Camera lands low-angle (pitch ≈ +8°) on a stone floor (Poly Haven CC0 PBR texture, committed, source logged in `design/ASSETS.md`).
- **Bonfire built procedurally in `src/three/bonfire/`** (no external model needed):
  - ring of varied low-poly stones (icosahedrons with noise displacement),
  - pile of charred PCB fragments (thin boxes, canvas-generated trace textures, glowing traces and edges), a few logs,
  - clearly recognisable **soldering iron** stuck diagonally into the pile, no cable at all (conical chrome tip, thin shaft, heat-sink sleeve, ribbed rubber grip),
  - flames = layered crossed billboards with an fbm flame shader (additive), sparks, thin smoke,
  - 120 instanced embers rising with sine drift,
  - PointLight `#ff6600` flickering on stones and floor, `Φ(t) = base + A1·sin(ω1t) + A2·sin(ω2t) + A3·noise(4t)`,
  - selective bloom on the fire only, vignette.
- **UI left:** Cinzel "REST HERE, TRAVELLER" (translation key), Souls-style list with selection marker:
  `> SEND MAIL` · `> CV (PDF)` · `> GITHUB` · `> LINKEDIN`. Hover ash-grey → `--glow`.
  Small copy box next to the displayed email; it turns into a checkmark for 2 s.
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
- Never: game assets, standalone company / brand logos, copyrighted music. No sound for now. Exception: a certificate's official earned badge on the KEY ITEMS back, unmodified (§7).

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
- Bonfire: `src/three/bonfire/index.js` (`createBonfire({ emberCount, getLayout })` → `mount(scene, camera)`, `update(dt, progress)`, `dispose()`) and `ContactList.jsx`. Import `ContactList.jsx` directly so three.js stays out of the initial bundle. Shared helpers: `src/three/utils.js`.
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

---

## §13 Changelog v2

Owner decisions of 2026-11-09. §6 and §7 are updated to match; open work is in TASKS.md. Restore point: tag `checkpoint-atlus-v1`.

**Global**
- One numbering format, mono `01 /`, for sections, menu items and panels. Roman numerals remain only where these decisions name them: game cards and role ranks.
- `…` button top-right, always visible, opens the full-screen menu overlay: sections, Quick Read, DE/EN, theme, GitHub / LinkedIn / Mail.
- Missing facts are TODO translation keys, hidden in production. Never invent facts.

**Stage**
- Removed: "STATUS: AVAILABLE…" chip, diagonal white line across the portrait, name/role line above the menu, QUICK READ under the menu.
- Name: big angled Anton block "RICHARD / ZUIKOV" top-right, small role line underneath.
- Menu slabs ~1.5× larger, up to ~120 px on desktop; wedge, inversion and echo text stay.
- QUICK READ: inside the global menu and as a small HUD link bottom-right.
- 40–60 floating 3D shards (flat-shaded greys, slow rotation), pushed by the cursor, springing back. Hard ink-water replaces the halftone ellipse band. Reference: `design/refs/lovable/stage.png`.

**About** (new, directly after the stage)
- Who I am, what I do, what I'm into, from translations.
- Portrait in side profile (reference `design/refs/pose-profile.jpg`). Stage → About: turns ~90° on Y toward the viewer, moves forward/larger, leaves 5–6 delayed monochrome ghost copies. Leaving About: dissolves into halftone dots. Placeholder silhouette until the real photo exists.

**Descent** ("From Register to Network")
- No dot-grid / KiCad paper background anywhere.
- Panels at different depths with parallax and entrance motion (slide + slight rotation + slam), each with a small animated monochrome line illustration. Text 2–3 sentences each, as TODO keys for Richard.

**Arcana**
- Images: no coarse pixel halftone; high-contrast grayscale with a very fine screentone, object recognisable.
- "ALL PROJECTS" no longer leads to `/lab`: browsable deck of all projects below the 3 featured cards (fan/carousel; drag, wheel, arrow keys; selected card lifts and flips to specs + repo link). Rack Configurator is one card. `/lab` redirects to `/#arcana`.
- Game-card style with roman numerals, no occult symbols. No slogan headlines or ad copy.

**Skill**
- No "not rated" column and no ratings. Short "used for / where" tags instead.

**Record**
- Visual rework, reference `design/refs/lovable/career.png`: big year numerals flipping on scroll, slanted role bars with roman rank, KEY ITEMS grid + item description panel.
- Data fix: the entry "IT Specialist in System Integration" is wrong and gets replaced. The replacement title, company and period are still open (TASKS.md, Needs the owner). No other entries change.

**Bonfire** (owner: antigravity)
- No cable. Recognisable soldering iron: conical chrome tip, thin shaft, heat-sink sleeve, ribbed rubber grip, stuck diagonally into the pile.
- More detailed campfire: varied stones, charred PCB pile with glowing traces, a few logs, layered flame shader, sparks, thin smoke, flickering light on stones and floor. Reference: `design/refs/lovable/bonfire.png`.
- Contact list: SEND MAIL · CV (PDF) · GITHUB · LINKEDIN. "Copy email" leaves the list and becomes a small copy box next to the displayed email, checkmark for 2 s.

---

## §14 Changelog v3

Owner decisions of 2026-11-09. §6 and §7 are updated to match; open work is in TASKS.md. Restore point: tag `checkpoint-atlus-v2`. Bonfire work happens in another agent's PR; `src/three/bonfire/` is off limits here.

**Nav**
- CONTACT (stage menu and global menu) scrolls to the very end of the rail: bonfire fully landed, not the mid-zoom. Every menu target lands on its section's resting state.
- Global `…` button top-right on every screen (home + deep pages) opens the full-screen Atlus menu overlay: sections, Quick Read, DE/EN, theme, GitHub / LinkedIn / Mail, Impressum, Datenschutz.
- Footer labels follow the language: DE "Impressum · Datenschutz", EN "Legal notice · Privacy policy".

**Stage & portraits**
- Two portrait slots: stage = front-facing, looking into the camera; about = side profile. Pipeline names: `src/assets/portraits/raw/stage.*` and `about.*`. Placeholders stay until photos exist.
- Treatment: stage keeps the strong ink/halftone. About gets a softer one: high-contrast grayscale with fine screentone only in the shadows, so facial features stay readable.
- Shards: ≈30–40 on the stage, slightly smaller, depth fade. They do not stop abruptly: they continue into the descent, thin out and gradually turn into the rising ash that later becomes embers. One continuous particle story from stage to bonfire.
- 2–3 slow-rotating low-poly monochrome 3D props along the descent, each tied to a panel. Subtle, never in front of text.

**Descent**
- The existing animated illustrations stay exactly as they are (PORTB bits, SCK/MOSI waveform, code typing).
- Five panels: 01 Register-Level Architecture · 02 Hardware & PCB · 03 Why C++ & Go · 04 Cluster & Infrastructure (new) · 05 Lab & Development Path.
- 02 keeps the SCK/MOSI waveform; its text moves from bus names to hardware/PCB design: KiCad 2-layer boards, layout and routing, bring-up and debugging with the oscilloscope. Draft for Richard's review in WORKLOG.
- 04: home-lab cluster with Proxmox VE, K3s, GitOps with ArgoCD, WireGuard / Cloudflare tunnels. Illustration in the same style: small node graph where pods get scheduled onto nodes, with a heartbeat pulse. Draft for Richard's review in WORKLOG.

**Arcana**
- Roman numerals centred at the top of the card again.
- Featured cards behave like deck cards: no direct link on click. Inspect animation for both: the card lifts, zooms toward the viewer into the centre (≈600 ms, slight overshoot), flips, the background dims. The back shows title, 2–3 lines, tags and two big buttons "VIEW SOURCE ↗" and "DETAILS". Esc, a click outside or "back" returns it to its place.
- Colour: cards stay grayscale on the table; only the zoomed inspect view shows the original colour photo. This is the one exception to §2 outside the warm zone.

---

## §15 Changelog v4

Owner decisions of 2026-11-09. §6 and §7 are updated to match; open work is in TASKS.md. Restore point: tag `checkpoint-atlus-v3`.
Bonfire: only the one addition below; everything else in `src/three/bonfire/` stays untouched.

**Global menu** (redesign; the v3 layout was confusing)
- Persona-style pause menu: the 5 items large, skewed and staggered in the centre-left, in the stage menu's language (slab, wedge, inversion; hover = wedge + echo text).
- The giant vertical "MENU" is a low-contrast background element at the left edge behind the items, not a separate block.
- No settings box. HUD chips in the corners: top-right close; bottom-left DE/EN and theme as slanted chips; bottom-right GitHub / LinkedIn / Mail chips; Quick Read as a slanted chip under the menu items; Impressum / Datenschutz as a tiny mono line at the very bottom.
- Open/close with a diagonal shard wipe (≤ 350 ms). Esc closes, focus is trapped.

**Stage**
- Name block top-right: larger and fluid (`clamp`, ~1.4× on desktop), never clipped between 1280 and 1920 px, same angle.
- "SCROLL DOWN" cue smaller; it fades out after the first scroll.

**Descent**
- Headline "FROM REGISTER TO NETWORK" → "FROM PIN TO PACKET".
- One low-poly monochrome 3D prop per panel, slow rotation, never in front of text: 01 QFP chip (kept) · 02 small populated PCB (a few ICs, traces, header pins) replaces the capacitor · 03 small monitor with scrolling code lines · 04 server blade / rack unit with blinking LEDs · 05 dome security camera whose lens follows the cursor.
- Panel 05 "Lab & Development Path" rewritten in plain words around the IT Systems Electronics apprenticeship (installations, networks, security/camera systems, field work). Draft for Richard's review.

**Now** (new section `now`, between descent and Selected Works)
- "NOW / IN PROGRESS": 3 slanted panels — TRICH-1 (own CPU on FPGA), home-lab cluster, apprenticeship (2025–2027). Each has a quest-log progress bar and one animated line illustration. Text from data files; missing facts are TODO keys.

**Camera turn + Record**
- Before RECORD the camera yaws 90°: the section is pinned and vertical scroll drives a horizontal ride along the timeline (years flip like a calendar, roles slide past as slanted bars, a click expands one). After the last entry the camera yaws back and the descent continues to the bonfire.
- Phones (< 768 px) and reduced motion: the normal vertical layout.

**Skill**
- One low-poly 3D prop per category beside the panel (chip / rack unit / oscilloscope / browser frame); it swaps with a quick spin when the category changes. Certificates stay KEY ITEM cards (done in v3b).

**Arcana**
- Finer cards: thinner frame lines, finer screentone, crisper title type.

**Bonfire**
- One small ruined house / chapel silhouette in the distance behind the fire (low-poly, fog-faded). Nothing else changes.

---

## §16 Changelog v5

Owner decisions of 2026-11-10. Open work is in TASKS.md. CI must be green before any merge.

**Global menu**
- While the overlay is open, the stage menu, name block and portrait are hidden and the page behind is dimmed to near-black screentone; only the overlay shows, also during the wipe. No settings box anywhere.

**Floating elements**
- No 3D prop overlaps panel text or a heading: props live in reserved gutters next to their panels and are hidden on narrow screens. No capacitor; the chip never sits on panel 02.
- No floating helper hints ("pick one", "try ↑↓"). Control hints only in the stage HUD bottom-right: "↑↓ SELECT · ⏎ OPEN · ESC BACK".
- Ink behind stage menu items only on hover / active.

**Dedicated screens** (Persona sub-screens)
- Every home section with a screen (about, arcana, skill, record) has an "OPEN SCREEN →" slab; it opens `/about`, `/work`, `/stack`, `/career` with the diagonal shard wipe. ESC / BACK returns to the same scroll position on `/`.
- Each screen: big title slab, sub-menu on the left (one tab per category or entry), detail panel on the right, one 3D prop, idle motion. Built from the new components (SkillBoard, KeyItems, RecordBoard, CardInspect); no old layouts.
- Career detail: an entry opens a detail screen (overlay, slash transition): big roman rank, role, company, period, 3–4 bullets, "skills gained" tags, ←/→ for previous / next, ESC back. Bullets from data for the R2P entries, TODO keys for the rest.
- Stack detail: a skill row opens the same detail screen: what it is, where it was used (project cards that jump into the Work screen), experience in words. No ratings.

**Portrait**
- `npm run portraits` accepts cream-on-black ink art: luminance becomes alpha (black → transparent), no manual cutout. Slots `stage.png` and `about.png`; placeholders stay until the files exist.

---

## §17 Changelog v6

Owner review of v5, 2026-11-10. Open work is in TASKS.md.

**Global menu**
- Exactly one list. The vertical MENU sits upright in its own fixed-width column with even leading; the list starts ≥ 32 px to its right. One Quick Read, in the bottom utility row. Name block and portrait are part of the overlay; the giant echo shows only the selected item (≤ 15 % opacity, enters with a 12 px offset). Stage slabs are `visibility: hidden` and `inert` while the overlay is open; legal links sit above the wipe shards.

**Floating props**
- Positions are stateless: `pos = anchor(layout) + parallax(scrollY) + idle(t) + kick`. Anchors come from layout boxes (transforms ignored), never from a prop's current position; `kick` is a critically damped spring (target 0) driven by clamped scroll velocity. The collision check sweeps every on-screen depth on each layout change. Each prop has a `data-prop` DOM proxy (position, `data-rest`, `data-kick`).

**Colour** — see §2 (rest state monochrome; real photo colour only while interacting).

**KEY ITEMS** — see §7 (exam code emblem on the front, official badge on the back).

**NOW** — Helm (AI agent project) replaces the apprenticeship, which lives in Career. Helmet line icon (Gjermundbu, no horns). Texts beyond the name are TODO keys until Richard supplies them.

**Record ride**
- Persona speedlines (tapered wedges, irregular, −8°, opacity ≤ 0.25) streaming with the ride. The year counter owns a column on solid ink; the ride viewport starts to its right. After the last role the camera rolls 90° while the section scrolls out and hands over to the next section; reversible; reduced motion = vertical list (plain cut).

**Stack** — Hardware vignette: Fourier square-wave build-up (odd harmonics 1 … 15, Gibbs overshoot), label "Σ sin(nωt)/n".


---

## §18 Changelog v7

Owner review of v6, 2026-11-10. Open work is in TASKS.md.

**Descent props** (replaces the collision rules of §16/§17)
- Fixed map: 01 PCB tile · 02 chip · 03 monitor · 04 rack unit · 05 security camera.
- Each panel sits in a `.descent-row` with a reserved, empty `.prop-slot[data-slot]` in its gutter (CSS grid, ≥ 1024 px). The prop rests on the slot centre and takes its panel's translateY (`--depth × --parallax`), so it can't touch text by construction. No runtime collision test, no measured hiding.
- Visibility by breakpoint only: ≥ 1024 px all five, < 1024 px none. Never scroll-dependent; the five props are never frustum-culled.
- Each prop is placed through the camera of the current frame (ray onto its plane), so camera damping and perspective can't move it off its slot.
- Every screen builds its own prop instances (factories); nothing is re-parented between scenes. `/about` keeps its own camera instance.
- Test hook `window.__propScreenPos()` (dev or `?e2e=1`, sticky for the tab session): `{ frame, props: [{ id, visible, inFrustum, scene, x, y, rest }] }`.

**Pause menu** (supersedes the menu layout of §17)
- Real pause: while open, `<html>` has `overflow: hidden`, `<main>` and the site footer are `inert` + `aria-hidden`, wheel/touch never reach the page's listeners; on close the exact scroll position comes back (unless an entry sent the visitor elsewhere). The site scrolls natively; there is no Lenis.
- Backdrop: ink-0 (`--ash-900` = #050505), opaque, with screentone; nothing of the page shows.
- Desktop: 12 columns inside the safe area. Cols 1–2 the vertical MENU, exactly as tall as the list, letters evenly spaced. Cols 3–6 the list; numbers in one column directly left of their item, 16 px gap, no staircase. Cols 7–12 the preview of the selected item: name + role, portrait (shrinks first), kicker, label `clamp(48px, 6vw, 112px)`, one teaser line.
- Footer: one row, three zones: DE/EN · THEME | Impressum · Datenschutz | GITHUB · LINKEDIN · MAIL · QUICK READ. Below 1024 px the preview drops to the name in the top row (clear of the close button), and the footer stacks.

**/about** (replaces the copied descent panels)
- Richard as a person, not skills (one line "Skills → Stack"). Status-screen spirit, our own design, no game wording or assets.
- Grid ≥ 1024 px: portrait (cols 1–4, spans both rows) · intro above sub-menu (cols 5–7) + detail panel (cols 8–12). Below: portrait beside the intro, then sub-menu + detail; < 640 px stacked.
- Sub-menu STATUS · WEEK · INVENTORY · NOW (↑↓, ESC like the other screens), own camera prop instance, idle motion = turning HUD rings + 1.2 % breathing.
- STATUS: name, base, role, languages with 4 level pips (native / fluent / good / basic); age only if given. WEEK: 7 slanted day slabs Mon–Sun, today inverted. INVENTORY: item tiles with own line icons (barbell, rack, empty slot) and one dry line each. NOW: building (from the NOW entries) / learning / reading.
- Source: `src/data/profile.js`, filled only from `design/ABOUT.md`. TODO strings show in development only; a section whose entries are all TODO leaves the sub-menu in production.

**Career ride**
- No lines of any kind in the background. Three large slanted ink wedges (`--ash-800`, `--ash-700`/45 %) move with the ride at 0.22 / 0.38 / 0.55 of its speed; they run full bleed.
- A huge outline year (Anton, 2 px stroke `--ash-600`) sits behind the active role at the reading line.
- Roles are slanted slabs with rank pips (I = one pip …); the active one inverted (paper), the others at 45 %. Role 0 lands ≥ 120 px right of the year column; leaving roles fade out before it.

**The 90° turn** (replaces the v6 roll during the scroll-out)
- Its own pinned beat of 60 vh after the last role, scrubbed by scroll and reversible: 0 % hold on the last role · 0–15 % radial speedline burst + 3 % scale-up · 15–70 % the whole board turns 90° clockwise around the screen centre (cubic in-out) while the year counter-rotates and stays upright · 70–100 % the board leaves upward along its new axis and the next title ("REST HERE, TRAVELLER") slides in from below.
- Reduced motion: no ride, the vertical list (cut). Phones (< 768 px): a 300 ms paper slab wipe at the end of the list.

**Portraits** (replaces the v7 poster shader; Richard, 2026-11-11)
- Sources: four green-screen photos, 572×1024, in `src/assets/portraits/raw/` (gitignored, never committed). Mapping: `stage` → hero (≥ 768 px) · `about` → the profile on `/about` and in the stage's About beat · `head` → pause-menu preview (≥ 1024 px; below that the preview stays name-only) and the hero below 768 px · `night` → exported, unused, behind `FLAGS.nightPortrait` in `src/data/portraits.js` (left out of the eager glob, never requested while off).
- `npm run cutout`: EXIF strip → chroma key on g − max(r, b) with spill suppression (g ≤ max(r, b)) for the hair edge → alpha erode 1 px + feather 1 px → crop (the frame is edge-extended first, so a figure cut by the frame gets no rim along the cut) → plain Lanczos resize to 900 / 1400 / 1800 px height, at most 1.75× the crop (heights above that are skipped; no AI upscaling) → AVIF + WebP, metadata stripped, `cutout/<id>-<color|bw>-<w>x<h>.*`.
- Colour: the despilled photo. B/W: luminance → CLAHE (25 % tiles, clip 2.5) → strong S-curve (sigmoidal contrast 5 at 50 %) → subtle film grain (σ ≈ 0.017). Both carry the same 1.5 px paper rim (`#f4f4f0`) behind the silhouette, so it reads on `#050505` and the cross-fade never moves an edge.
- Current sources allow: `stage` and `about` at 900 + 1400 px, `head` and `night` at 900 px; 1800 px exceeds 1.75× for all four.
- Render: DOM `CutoutPortrait` (B/W picture + colour picture cross-faded in CSS) on `/about`, in the pause menu and for the no-WebGL hero; in the WebGL stage the hero and profile planes blend the two textures by `uColour` (same 300 ms ease-out). Plain ink behind every portrait, no backdrop slab. HUD rings and the 1.2 % breathing stay.
- Dev-only `/?portrait-lab`: live contrast / grain / rim sliders on the CLAHE luminance the pipeline leaves in `raw/lab/` (gitignored), next to the baked cut-out with its colour hover; prints the `CONTRAST=… GRAIN=… RIM=… npm run cutout` line. The poster / posterize path and its tone sliders are gone.
