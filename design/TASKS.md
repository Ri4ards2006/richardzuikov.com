# Tasks

Derived from DESIGN.md §6, §7 and §11. Status: `todo` / `doing` / `done`. Owner: implementation agent.

## §6 Information architecture

| Status | Item |
|---|---|
| done | One page with one fixed WebGL canvas behind HTML sections |
| done | Sections `arcana` and `bonfire` with these ids |
| todo | Section ids `intro`, `stage` |
| todo | Section `who` (STATUS): 3–4 sentences, ink portrait detail, optional stat hexagon |
| todo | Section `heading` (HEADING): 2027 goal, focus areas |
| todo | Section `skill` (SKILL): condensed ranked list, vignettes, "FULL INDEX →" `/stack` |
| todo | Section `record` (RECORD): calendar timeline, KEY ITEMS, "FULL RECORD →" `/career` |
| todo | ABOUT, STACK and CAREER fly the camera to their section (they still open deep pages) |
| todo | Lenis `scrollTo` driving the camera rail |
| done | Deep pages `/about /work /stack /career` |
| doing | `/contact` as full screen: conflicts with the owner's redirect decision, needs a ruling |
| todo | Global fixed `…` button after the stage, opening the full-screen MENU overlay (vertical letters, monochrome, shard transition) |
| todo | Language and theme toggles inside that overlay |
| doing | HUD status chip top-left (present; exact `STATUS: AVAILABLE · FLENSBURG` wording open) |
| todo | HUD top-right chips GitHub / LinkedIn / CV / Mail |
| todo | HUD bottom-right control hints + `QUICK READ →` (link exists, not as HUD) |
| doing | HUD bottom-centre `SCROLL TO DESCEND` (cue exists, TraceStar missing) |

## §7 Storyboard

### Card 01
| Status | Item |
|---|---|
| doing | Real preloader: waits for 3D chunk and shader compile; fonts/textures and LoadingManager missing; minimum is 0.8 s, spec 0.6 s |
| todo | Boot log, 3–4 typed lines from translation keys |
| doing | Tear: vertical ragged split exists; diagonal, debris, ink fibres missing |
| todo | Reveal "RICHARD ZUIKOV" on halftone |
| done | Once per session; click or key skips |
| todo | Visible "skip intro" button (§8) |

### Card 02
| Status | Item |
|---|---|
| todo | Name plate textured with rendered name as the shattering surface |
| doing | 24–40 Voronoi cells (exists, hand-written; `d3-delaunay` not used) |
| todo | Extruded fragments with matching UVs |
| todo | Radial impulse, gravity and drag physics per fragment (currently eased paths) |
| doing | 12° dutch tilt dive exists; spec z 15 → 5, current 16 → 10 |
| todo | Reflective ink mirror plane with ripple and droplets |
| todo | Monochrome chromatic aberration and motion blur |
| todo | Five fragments snap into slabs, then cross-fade to HTML slabs |

### Card 03
| Status | Item |
|---|---|
| done | HTML `<nav>` slabs with CSS 3D, individual size and offset, mono numbers 01–05 |
| done | Paper wedge and inversion on the active item |
| todo | 2° camera nudge, speedlines and debris on hover |
| todo | Large echo text ("03 STACK") |
| doing | Portrait layers exist as rings/disc, figure, slash; real ink portrait needs photos |
| todo | Parallax opposite to the mouse at 0.5 / 1.5 / 3 % |
| todo | Boil on strokes, breathing scale 1 → 1.012 |
| doing | Ink shader: halftone done; threshold tones and darkened edges missing |
| todo | Hard ink-water background: posterized caustics, screentone, dust (caustics were dropped from `/`) |
| todo | First wheel/scroll starts the descent |
| done | Arrow keys navigate the menu |

### Card 04
| Status | Item |
|---|---|
| doing | Camera rail from scroll exists (DOM-synced, not y 0 → −60) |
| doing | Slanted panels with paper borders exist; cuts and depth layers need work |
| todo | Speedlines on fast scroll |
| todo | Ransom-note headlines "WHO AM I" / "WHERE I'M HEADING" |
| doing | 3D tarot with tilt, halftone image, roman numeral, title |
| todo | Deal-in animation with slam, bounce and dust puff; scroll rotates the fan |
| todo | Silver sheen sweep on hover |
| todo | Click flips on `/`; card back with specs, tags, repo link (exists only on `/work`) |
| todo | SVG card frame |
| todo | Skill list tilted in 3D with asymmetric active slab |
| todo | Skill vignettes: source→asm→hex, rack LEDs, oscilloscope, browser wireframe |
| todo | Detail panel for the selected skill |
| todo | Years as Anton numerals that flip like a calendar on scroll |
| todo | Roles as slanted bars with rank pips |
| todo | KEY ITEMS inventory grid with generic line icons, detail panel, flavor text |
| todo | 55–80 %: panels fade, darkness grows, ash shifts into embers |

### Card 05
| Status | Item |
|---|---|
| doing | Low-angle camera on stone floor; pitch 7° vs ≈ 8°; procedural slabs, not Poly Haven PBR |
| todo | `design/ASSETS.md` |
| todo | Ring of noise-displaced stones |
| doing | Charred PCB pile: one PCB board exists; fragments with emissive edges missing |
| doing | Soldering iron exists; LatheGeometry profile and TubeGeometry cable missing |
| todo | Flames as crossed billboards with fbm shader (currently cones) |
| doing | Instanced embers: 80 points; spec 120 |
| done | PointLight `#ff6600` with sine + noise flicker |
| todo | Selective bloom on the fire, vignette |
| done | Cinzel headline, list with `>` marker, hover to `--glow` |
| doing | Row labels: spec `SEND MAIL`, `COPY MAIL`, `CV (PDF)`, `GITHUB`, `LINKEDIN` |
| todo | "CONNECTION KINDLED" on first arrival on `/` (exists only on unrouted `/contact`) |
| done | Plain footer with Impressum / Datenschutz |

## §4 / §8 items surfaced by the audit

| Status | Item |
|---|---|
| todo | `<TraceStar/>` component and all its uses, favicon variant |
| done | Film grain ~8 % (static tile with stepped jitter) |
| todo | Ink splatters and cross-hatching generated in code |
| doing | `border-radius: 0` on `/` (done for the stage; `rounded` remains on deep pages) |
| todo | Port stack to `@react-three/fiber`, drei, postprocessing, gsap, lenis, d3-delaunay, or rule against it |
| doing | Palette names: tokens match values, not the `--ink-*` / `--bone` names |
| done | No hue outside the warm zone in code, except unrouted `/contact` components (last Impressum remnant fixed from review 8.1) |
| todo | Warm colours fade in from scroll 55 % |
| done | Mobile < 768 px: DPR 1, 12 fragments |
| todo | Mobile: portrait 2 layers, simplified bonfire |
| todo | Static stills per section for no-WebGL and reduced motion (currently one static page) |
| done | `/` mobile Lighthouse ≥ 70 (83–88) |
| todo | `/` desktop Lighthouse ≥ 85 (74–76 under software WebGL; re-measure on a GPU) |
| todo | `/quick` Lighthouse ≥ 95 (94) |
| done | No long task > 200 ms after the intro (max 129 ms) |
| todo | 60 fps desktop / 30 fps mobile verified on real hardware |
| done | 3D chunk ≤ 400 KB gzip (148 KB) |

## §11 Definition of done

| Status | Item |
|---|---|
| doing | Within 3 s a first-time visitor sees motion, depth and the name (name is only a small label; depends on Card 01/02 name plate) |
| doing | Every screen has depth, ink/screentone, idle motion and a slab/shard (stage yes; deep pages and quick read partly) |
| doing | Nothing looks like a default component (stage yes; deep pages still have rounded cards and plain lists) |

## Needs the owner

| Status | Item |
|---|---|
| todo | Rule on `/contact`: redirect (current) or full screen (§6) |
| todo | Provide `design/storyboard/card-01…05.png` and `design/refs/` for the §10 comparison |
| todo | Portrait photos in `src/assets/portraits/raw/` |

## Added from REVIEW.md (2026-11-09)

Reviewer items already listed above are not repeated. The review was written before the two §10 rounds, so 3.1, 3.2 (numbers), 3.4, 7.2 (marker), 8.3 and 9.2 are already fixed; 3.5 (rings) and 7.5 (footer) do exist in the build.

| Status | Item | Review |
|---|---|---|
| done | Remove the last `#FFB000` in `Impressum.jsx` | 8.1 |
| done | Slab entrance within 220 ms with the §5 curve | 4.2 |
| done | Manga panels use 3 px borders | 4.3 |
| todo | Row labels and icons: prompt-style text list instead of Lucide icons | 7.2 |
| todo | Skip control as a slab with a key cue | 1.5 |
| todo | Rack link as a slanted chip | 5.5 |
| todo | Sharp binary halftone on panels instead of the soft gradient | 4.5 |
| todo | Touch or gyro input in place of mouse parallax on mobile | 9.3 |
| todo | Preloader bar relative to viewport width | 9.5 |
| todo | Rename tokens to `--bone`, `--paper`, `--ember`, `--flame`, `--glow` | 8.4 |
