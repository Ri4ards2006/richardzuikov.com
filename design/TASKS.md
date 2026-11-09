# Tasks

Derived from DESIGN.md §6, §7 and §11. Status: `todo` / `doing` / `done` / `superseded` (replaced by §13). Owner: implementation agent, unless a table has its own Owner column.

## §6 Information architecture

| Status | Item |
|---|---|
| done | One page with one fixed WebGL canvas behind HTML sections |
| done | Sections `arcana` and `bonfire` with these ids |
| todo | Section ids `intro`, `stage` |
| superseded | Section `who` (STATUS): 3–4 sentences, ink portrait detail, optional stat hexagon |
| todo | Section `heading` (HEADING): 2027 goal, focus areas |
| todo | Section `skill` (SKILL): condensed ranked list, vignettes, "FULL INDEX →" `/stack` |
| todo | Section `record` (RECORD): calendar timeline, KEY ITEMS, "FULL RECORD →" `/career` |
| todo | ABOUT, STACK and CAREER fly the camera to their section (they still open deep pages) |
| todo | Lenis `scrollTo` driving the camera rail |
| done | Deep pages `/about /work /stack /career` |
| doing | `/contact` as full screen: conflicts with the owner's redirect decision, needs a ruling |
| superseded | Global fixed `…` button after the stage, opening the full-screen MENU overlay (vertical letters, monochrome, shard transition) |
| todo | Language and theme toggles inside that overlay |
| superseded | HUD status chip top-left (present; exact `STATUS: AVAILABLE · FLENSBURG` wording open) |
| superseded | HUD top-right chips GitHub / LinkedIn / CV / Mail |
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
| superseded | Roles as slanted bars with rank pips |
| todo | KEY ITEMS inventory grid with generic line icons, detail panel, flavor text |
| todo | 55–80 %: panels fade, darkness grows, ash shifts into embers |

### Card 05
| Status | Item |
|---|---|
| done | Low-angle camera on stone floor with Poly Haven PBR textures (logged in ASSETS.md) |
| done | `design/ASSETS.md` |
| todo | Ring of noise-displaced stones |
| doing | Charred PCB pile: one PCB board exists; fragments with emissive edges missing |
| superseded | Soldering iron exists; LatheGeometry profile and TubeGeometry cable missing |
| done | Flames as crossed billboards with fbm shader (layered additive) |
| done | Instanced embers (120 desktop, 60 mobile with sine drift) and thin smoke |
| done | PointLight `#ff6600` with multi-frequency sine + noise flicker |
| todo | Selective bloom on the fire, vignette |
| done | Cinzel headline, list with `>` marker, hover to `--glow` |
| superseded | Row labels: spec `SEND MAIL`, `COPY MAIL`, `CV (PDF)`, `GITHUB`, `LINKEDIN` |
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
| todo | Replacement for "IT Specialist in System Integration" (`src/lib/translations.js`): title, company, period. The decision still held the unfilled template `<<TITEL, FIRMA, ZEITRAUM>>`, so the entry stays unchanged until this is given |
| todo | Side-profile photo; `design/refs/pose-profile.jpg` and `design/refs/lovable/{stage,career,bonfire}.png` (gitignored, not on this machine's checkouts yet) |
| todo | Text for the TODO keys: About (who / what / into) and the Descent panels |

## Added from REVIEW.md (2026-11-09)

Reviewer items already listed above are not repeated. The review was written before the two §10 rounds, so 3.1, 3.2 (numbers), 3.4, 7.2 (marker), 8.3 and 9.2 are already fixed; 3.5 (rings) and 7.5 (footer) do exist in the build.

| Status | Item | Review |
|---|---|---|
| done | Remove the last `#FFB000` in `Impressum.jsx` | 8.1 |
| done | Slab entrance within 220 ms with the §5 curve | 4.2 |
| done | Manga panels use 3 px borders | 4.3 |
| done | Row labels and icons: prompt-style text list instead of Lucide icons | 7.2 |
| todo | Skip control as a slab with a key cue | 1.5 |
| todo | Rack link as a slanted chip | 5.5 |
| todo | Sharp binary halftone on panels instead of the soft gradient | 4.5 |
| todo | Touch or gyro input in place of mouse parallax on mobile | 9.3 |
| todo | Preloader bar relative to viewport width | 9.5 |
| todo | Rename tokens to `--bone`, `--paper`, `--ember`, `--flame`, `--glow` | 8.4 |

## Changelog v2 (DESIGN.md §13)

### Housekeeping
| Status | Owner | Item |
|---|---|---|
| done | claude-code | Tag `checkpoint-atlus-v1` as restore point |
| done | claude-code | Bonfire moved to `src/three/bonfire/` with `mount` / `update` / `dispose`; no visual change |

### Global
| Status | Owner | Item |
|---|---|---|
| todo | claude-code | One numbering format, mono `01 /`, for sections, menu items and panels |
| todo | claude-code | `…` button top-right, always visible |
| todo | claude-code | Full-screen Atlus-style menu overlay: sections, Quick Read, DE/EN, theme, GitHub / LinkedIn / Mail |
| todo | claude-code | TODO translation keys hidden in production |

### Stage
| Status | Owner | Item |
|---|---|---|
| done | claude-code | Remove the "STATUS: AVAILABLE…" chip |
| done | claude-code | Remove the diagonal white line across the portrait |
| done | claude-code | Name as big angled Anton block "RICHARD / ZUIKOV" top-right, small role line underneath |
| done | claude-code | Remove the name/role line above the menu |
| done | claude-code | Menu slabs ~1.5× larger, up to ~120 px desktop; keep wedge, inversion, echo text; no overflow at 390 px (review 9.1) |
| doing | claude-code | QUICK READ out from under the menu: global menu + small HUD link bottom-right |
| done | claude-code | 40–60 floating 3D shards: flat-shaded greys, slow rotation, cursor push, spring back |
| done | claude-code | Replace the halftone ellipse band with hard ink-water (Card 03) |

### About
| Status | Owner | Item |
|---|---|---|
| done | claude-code | New section directly after the stage, before "From Register to Network"; text from translations, missing facts as TODO keys |
| done | claude-code | Side-profile portrait with placeholder silhouette until the real photo exists |
| done | claude-code | Stage → About: portrait turns ~90° on Y and moves forward/larger into the layout |
| done | claude-code | Monochrome afterimage trail: 5–6 delayed ghost copies fading out |
| done | claude-code | Leaving About: figure dissolves into halftone dots |

### Descent
| Status | Owner | Item |
|---|---|---|
| done | claude-code | Remove the dot-grid / KiCad paper background everywhere |
| done | claude-code | Panels at different depths with parallax |
| done | claude-code | Panel entrance motion: slide + slight rotation + slam |
| done | claude-code | Animated monochrome line illustration per panel: register bits flipping, SPI/I2C waveform, code typing |
| done | claude-code | Panel text 2–3 sentences as TODO keys |

### Arcana
| Status | Owner | Item |
|---|---|---|
| done | claude-code | Card images: high-contrast grayscale with very fine screentone instead of coarse halftone; object recognisable |
| done | claude-code | Browsable deck of all projects (Lab data) below the 3 featured cards: smaller cards in a fan/carousel |
| done | claude-code | Deck input: drag, wheel, arrow keys |
| todo | claude-code | Selected deck card lifts and flips to specs + repo link |
| todo | claude-code | Rack Configurator as one card in the deck |
| todo | claude-code | "ALL PROJECTS" no longer links to `/lab`; `/lab` redirects to `/#arcana` |
| todo | claude-code | Game-card style with roman numerals, no occult symbols |
| todo | claude-code | Remove slogan headlines such as "ENGINEERED WITH INTENT" and any ad copy |

### Skill
| Status | Owner | Item |
|---|---|---|
| todo | claude-code | Remove the "not rated" column and every rating |
| todo | claude-code | Short "used for / where" tags per item |

### Record
| Status | Owner | Item |
|---|---|---|
| todo | claude-code | Visual rework after `design/refs/lovable/career.png` |
| todo | claude-code | Big year numerals flipping on scroll |
| todo | claude-code | Slanted role bars with roman rank |
| todo | claude-code | KEY ITEMS grid + item description panel |
| todo | claude-code | Replace the wrong "IT Specialist in System Integration" entry; blocked on the owner's title, company, period. No other entries change |

### Bonfire
| Status | Owner | Item |
|---|---|---|
| done | claude-code | Remove the cable entirely |
| done | claude-code | Recognisable soldering iron: conical chrome tip, thin shaft, heat-sink sleeve, ribbed rubber grip, stuck diagonally into the pile |
| done | claude-code | Varied stones |
| done | claude-code | Charred PCB pile with glowing traces |
| done | claude-code | A few logs |
| done | antigravity | Layered flame shader |
| done | antigravity | Sparks and thin smoke |
| done | antigravity | Flickering light on stones and floor |
| done | antigravity | Contact list: SEND MAIL · CV (PDF) · GITHUB · LINKEDIN |
| done | antigravity | Remove "Copy email" from the list; small copy box next to the displayed email, checkmark for 2 s |
