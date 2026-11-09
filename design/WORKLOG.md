# Worklog

Append-only. Format: date · agent · done · next · files touched.

## 2026-11-09 · Claude Code (Opus 5.5)

**Done**
- Committed the cinematic stage. `/quick`, `/lab` and `/impressum` are monochrome; `/contact` redirects to `/#bonfire`.
- Adopted the design bible as DESIGN.md with §12; created TASKS.md from the §6, §7 and §11 audit.
- Performance: Lighthouse's own trace showed one 1.1 s task right after the boot timer, measured with user timings as the first `renderer.render()` in `prepareDive` (synchronous shader compile). Fixed with `compileAsync` before the loop starts, deferred tarot images, 30 fps idle, mobile DPR 1.
- Results (Lighthouse, software WebGL, no GPU): `/` mobile 83–88, TBT 230–350 ms (was 58, ~4.9 s); `/` desktop 74–76; `/quick` 94; no task over 200 ms after the intro (max 129 ms).
- Review §10, round 1: slabs too flat, no paper wedge, no HUD. All fixed.
- Review §10, round 2: chip collided on mobile, bonfire colours off §2 and core burned out with no `>` marker, no film grain. All fixed.

**Next**
- Ruling on `/contact`. Then the §7 gaps in TASKS.md, starting with the Card 01–02 name plate and the `who` / `heading` / `skill` / `record` sections.
- Measure 60 fps and desktop Lighthouse on real GPU hardware.

**Notes**
- `design/REVIEW.md`, `design/storyboard/` and `design/refs/` did not exist, so §10 compared against the written spec only.
- `design/DESIGN.md.new` did not exist; the bible came from the untracked `design/Design.md` in the main checkout, which was left in place.

**Files touched**
`design/*`, `.gitignore`, `package*.json`, `tailwind.config.cjs`, `public/{favicon.svg,og.png,sitemap.xml}`, `src/App.jsx`, `src/css/{style.scss,tokens.css}`, `src/hooks/use-wipe-location.js`, `src/lib/{atlus.js,translations.js}`, `src/pages/{Stage,Lab,Impressum}.jsx`, `src/components/stage/*`, `src/components/home/*`, `src/components/Header.jsx`

## 2026-11-09 · Claude Code (Opus 5.5) · correction and follow-up

**Done**
- Correction to the entry above: `design/REVIEW.md` did not exist when the task started, but the reviewer agent wrote it at 15:01 during the task. Its text entered commit `d9d8e06` through the shared git index; `bbe546e` is the reviewer's own commit. The file was not edited here.
- Read REVIEW.md, fixed items 8.1, 4.2 and 4.3, and added the remaining items to TASKS.md.

**Next**
- As above. Separate reviewer and implementation agents should not share one worktree index.

**Files touched**
`design/TASKS.md`, `design/WORKLOG.md`, `src/pages/Impressum.jsx`, `src/css/style.scss`

## 2026-11-09 · Claude Code (Opus 5.5) · housekeeping for changelog v2

**Done**
- Tagged `a7ffea7` as `checkpoint-atlus-v1` and pushed the tag.
- Moved the bonfire (geometry, flame and ember shaders, light, flicker) from `scene.js` to `src/three/bonfire/index.js` and the contact list from `Stage.jsx` to `src/three/bonfire/ContactList.jsx`. Helpers both sides need went to `src/three/utils.js`.
- Verified no visual change: same seeded `Math.random` and virtual clock, 150 frames, stage and bonfire at 1440×900 and 390×844. All four PNGs are byte-identical to the build of `a7ffea7`; two baseline runs were also identical to each other. Leaving and re-entering the route three times disposes and rebuilds with no console error. Scene chunk 148.4 → 148.6 KB gzip; three.js stays out of the initial chunk.
- Added DESIGN.md §13, adjusted §6 / §7, added the v2 tasks.

**Next**
- The v2 tasks in TASKS.md. Bonfire items belong to antigravity.

**Notes**
- `update(dt, progress)` also needs the DOM-measured placement, so `createBonfire` takes a `getLayout` callback instead of a fourth method.
- The replacement for the wrong career entry arrived as an unfilled template. The entry is unchanged and listed under "Needs the owner".
- `design/refs/` is gitignored and does not exist in the checkouts here, so the referenced images could not be opened.

**Files touched**
`design/{DESIGN,TASKS,WORKLOG}.md`, `src/three/**`, `src/components/stage/scene.js`, `src/pages/Stage.jsx`

## 2026-11-09 · Claude Code (Opus 5.5) · merges, Descent, Arcana, Skill

**Done**
- Merged PR #8 (`feat/atlus-stage`) and PR #7 (`feat/bonfire-v2`) into `feat/atlus-menu`. No conflict occurred, not even in TASKS.md; the ticks of both sides are present.
- ASSETS.md: the Poly Haven API names Dimitrios Savva as the author of `stone_floor`, not Rob Tuytel.
- After the merge: stage, about and bonfire at 1440×900 and 390×844, no console errors, no horizontal overflow.
- Descent: dot-grid removed, panels on three depth layers with parallax, 220 ms slam entrance, one animated line illustration per panel (CSS only, paused off screen), TODO keys for the panel text.
- Arcana: fine screentone with per-image levels on the 3D cards; fan deck of all projects with drag, wheel and arrow keys, lift and flip to specs and links; Rack Configurator as a deck card; `/lab`, `/works`, `/portfolio`, `/dev` redirect to `/#arcana`; game-card header with roman numerals.
- Skill: rating column, ranks and the n/n counter removed; "used in" tags on `/stack`.

**Review (§10)**
- Compared against the written §13 only, since `design/storyboard/` and `design/refs/` do not exist here.
- Two rounds with fixes: panel layers, illustrations, card images, deck layout, flip, card numerals. One round: dot-grid removal, slam (6-frame strip, nothing to fix), `/stack`. Non-visual tasks were checked with Playwright only: deck input (real keyboard, mouse and wheel events), redirects, flip, TODO visibility. So not every task got the two rounds §10 asks for.
- The final check found a real bug: opening a deck card with Enter closed it again at once. Fixed.

**Next**
- Remaining v2 tasks: Global and Record.

**Notes**
- The slogan task needed no code change: "ENGINEERED WITH INTENT" exists only in TASKS.md, and no arcana copy reads as a slogan. Owner statements on `/quick` were left alone.
- Skill tags name only projects and certificates documented on the site. C / ASM, POSIX, REST / WebSocket and Figma have no source, so they have no tag; each has a TODO key for development.
- TODO strings are hidden from the page in production but are still in the JS bundle, like the existing TODO keys.
- `src/pages/Lab.jsx` is unrouted and no longer bundled; kept like `Contact.jsx` until someone decides to delete it.
- The rack card uses the home-lab photo, as `/lab` did; no rack image exists.
- On desktop, `#bonfire` (menu item KONTAKT) lands on an empty screen: `.stage-abyss` is 145vh with its content at the bottom. Present before this work; not changed.

**Files touched**
`design/{ASSETS,TASKS,WORKLOG}.md`, `public/sitemap.xml`, `src/App.jsx`, `src/css/style.scss`, `src/lib/translations.js`, `src/pages/{Stage,Stack,Work}.jsx`, `src/components/{MenuOverlay.jsx,atlus/ArcanaCard.jsx,home/WorkSection.jsx}`, `src/components/stage/{scene.js,PanelIllustration.jsx,ProjectDeck.jsx}`, `src/data/{featured-projects,project-images,stack-uses}.js` (removed `src/data/stack-levels.js`)

## 2026-11-09 · Claude Code (Opus 5.5) · changelog v3: Nav, Stage, Descent, Arcana

**Done**
- Tagged `5e6b952` as `checkpoint-atlus-v2`, added DESIGN.md §14, adjusted §6 / §7, added the v3 tasks. Worked on `feat/atlus-v3` in its own worktree; `src/three/bonfire/` is untouched.
- Nav: CONTACT and `/#bonfire` land at the very end of the rail; the About figure is fully turned exactly at its landing position. Global `…` button on every screen with the full-screen Atlus overlay. Footer labels follow the language.
- Stage: `stage` (front) and `about` (profile) portrait slots with placeholders; softer About treatment; 30 / 38 shards with depth fade that thin out through the descent into rising ash and embers; chip, capacitor and server blade beside panels 01, 02 and 04.
- Descent: five panels; panel 02 rewritten; panel 04 with node-graph illustration.
- Arcana: numerals centred; inspect view for featured and deck cards; colour photo only in the inspect view.

**Drafts for Richard's review**
- 02 Hardware & PCB, DE: "Eigene 2-Layer-Platinen entstehen in KiCad, von Layout und Routing bis zur fertigen Baugruppe. Bring-up und Fehlersuche laufen am Oszilloskop, bis jedes Signal dort ankommt, wo es hin soll."
- 02 Hardware & PCB, EN: "I design my own 2-layer boards in KiCad, from layout and routing to the assembled board. Bring-up and debugging happen on the oscilloscope, until every signal arrives where it should."
- 04 Cluster & Infrastructure, DE: "Im Home-Lab läuft ein Cluster aus Proxmox VE und K3s, deployt per GitOps mit ArgoCD. Von außen erreichbar ist er über WireGuard und Cloudflare-Tunnel."
- 04 Cluster & Infrastructure, EN: "My home lab runs a cluster on Proxmox VE and K3s, deployed through GitOps with ArgoCD. It is reached from outside through WireGuard and Cloudflare tunnels."

**Review (§10), two rounds per group, against the written §14 only** (`design/storyboard/` and `design/refs/` do not exist here)
- Nav 1: mobile landing cut off the headline and mail row; arrow keys did nothing until a slab had focus; side panel text small. Fixed. Nav 2: Escape in the menu also left deep pages. Fixed.
- Stage 1: props too large; shards could pass in front of the portraits; ash too faint before the fire. Fixed. Stage 2: placeholder shading had a hard seam and no shadow screentone. Fixed.
- Descent 1: heartbeat too flat; phone capacitor touched its panel. Fixed. Descent 2: no further defect found.
- Arcana 1: empty middle on the card back; dim appeared without a transition; the featured slot collapsed to zero width after becoming a button. Fixed. Arcana 2: the wheel reached the page through short copy. Fixed.

**Next**
- Remaining v2 tasks: Global and Record. Richard's review of the two drafts.

**Notes**
- The repo has no test runner. Behaviour was checked with Playwright scripts outside the repo; the nav test failed before the fix and passes after it.
- DETAILS has no page to open, so it swaps the back of the card to the full specs. The Rack Configurator shows its live link in place of VIEW SOURCE, because its repo entry is only the profile link.
- `/quick` reads the same panel texts, so the two drafts appear there too.
- Theme is in the overlay as specified, but Atlus screens stay forced dark, so it only shows on `/quick` and the legal page.
- On phones the bonfire shrank from 22 rem to 14 rem so the headline, contact list and fire fit on one landed screen.
- `Weather_Station.png` has a small generator star in its corner, visible in the colour view.

**Files touched**
`design/{DESIGN,TASKS,WORKLOG}.md`, `scripts/portraits.sh`, `src/assets/portraits/{front-silhouette.svg,raw/README.md}`, `src/css/style.scss`, `src/data/portraits.js`, `src/lib/{atlus,translations}.js`, `src/pages/Stage.jsx`, `src/components/{Footer,Header,MenuOverlay}.jsx`, `src/components/stage/{AboutSection.jsx,CardInspect.jsx,PanelIllustration.jsx,ProjectDeck.jsx,descent-props.js,floating-shards.js,scene.js}`

## 2026-11-09 · Claude Code (Opus 5.5) · merges, Skill, Record

**Done**
- Merged PR #10 (`feat/atlus-v3`) and PR #9 (`feat/bonfire-v3`) into `feat/atlus-menu`, both builds green, no conflict. Stage, descent, arcana and bonfire checked at 1440×900 and 390×844; nothing to fix.
- Skill on `/` and `/stack`: slabs slam in, slash-wipe panel, staggered rows, four vignettes, certificates as KEY ITEM cards with the Arcana inspect view.
- Record on `/` and `/career`: jobs and education only, entry 02 corrected, flipping year numerals, slanted bars with roman rank and slash-wipe detail, camera dolly with speedlines and bars from depth.
- `src/three/bonfire/` untouched on this branch.

**Review (§10), two rounds per group, against the written spec only** (`design/refs/lovable/career.png` is not on this machine)
- Skill 1: vignettes filled only part of their box; the active slab ran to the screen edge on phones. Fixed. Skill 2: no further defect found.
- Record 1: the year was measured while the bars were still transformed, so it stayed wrong after landing; with no scroll room it never flipped. Fixed, hover and focus now flip it too. Record 2: no further defect found.

**Decisions**
- STACK and CAREER in the stage and global menus now fly to `#skill` and `#record`, as §6 specifies. The deep pages stay reachable through "FULL INDEX →" and "FULL RECORD →".
- The expanded Record bar shows the first two sentences of the existing `desc`, so it is not empty in production. The TODO key `atlus.todoRecord` is visible in development only.
- Certificates left `/career` but stay on `/quick`, the plain recruiter version.

**Open questions for Richard**
- Entry 02 keeps its old description (workstations, Bash, USB images). Does it fit the Minijob?
- Text for the Record details (`atlus.todoRecord`).
- `design/refs/lovable/career.png` is still missing here, so the look was not compared against it.

**Preview**
https://richardzuikov-com-git-feat-atlus-v3b-ri4ards2006s-projects.vercel.app/ (behind the Vercel login)

**Files touched**
`design/{TASKS,WORKLOG}.md`, `src/css/style.scss`, `src/hooks/use-section-enter.js`, `src/lib/{atlus,translations}.js`, `src/pages/{Stage,Stack,Career}.jsx`, `src/components/atlus/{SkillBoard,SkillVignette,KeyItems,RecordBoard}.jsx`, `src/components/stage/{CardInspect.jsx,scene.js}`


## 2026-11-09 · Claude Code (Opus 5.5) · phase 1 merges and changelog v4

**Phase 1 (on `feat/atlus-menu`)**
- PR #12: career data fixed on `feat/atlus-v3b` (`355741e`): R2P is now three entries — Sep 2024 internship, Dec 2024 – Aug 2025 IT helpdesk & system administration (Minijob) with the given details, 2025–2027 apprenticeship IT-Systemelektroniker; DE and EN. "GO-CORE-LAB Framework" and "Embedded Systems & Signal Analysis" were already gone. The year flip now takes the first four-digit year of a period. Merged after green checks.
- PR #11 merged. SVGs optimised with `npx svgo@3.3.2` into `src/assets/svg` (26.8 → 16.2 KB; svgo not added as a dependency). TraceStar on the scroll cue, the new card frame on arcana (rasterised into the 3D card texture), deck, key item and inspect cards, the new line icons on the key items, ink splatters on stage, about and as impact moments on the arcana / skill / record headings (`d06dc43`).
- `REVIEW-bonfire-v3.md` has no P1 finding (one P3, the rest Pass), so there was nothing to fix there; the P3 was left alone because the bonfire is off limits apart from the chapel.
- Tag `checkpoint-atlus-v3` on `d06dc43`.

**Phase 2 (on `feat/atlus-v4`)**: DESIGN.md §15, tasks in TASKS.md, one commit per task except where noted.
- Global menu: pause menu with large skewed staggered slabs, wedge, inversion and echo text, MENU as a background element; corner HUD chips, Quick Read chip, legal mono line; diagonal wipe with three paper shards (open 340 ms, close 300 ms), Esc, focus trap. The three menu tasks share one commit because they are one component.
- Stage: name block 10.4vw (capped at 10rem), in view and clear of the menu at 1024, 1280, 1440 and 1920 px; portrait anchor moved below it. Scroll cue 9 px with TraceStar, fades after the first scroll and stays gone.
- Descent: "FROM PIN TO PACKET" / "VOM PIN ZUM PAKET". Props: chip, PCB, monitor with scrolling code, rack unit with blinking LEDs, dome camera whose lens follows the cursor (slow pan without a mouse). Panel 05 rewritten (draft below).
- Now: new section between descent and Selected Works, data in `src/data/now.js`.
- Record: pinned horizontal ride on desktop (≥ 768 px, no reduced motion): yaw in, 1 px of scroll per px of track, flipping year, yaw out. Menu and deep-link landing rest after the yaw-in; keyboard focus scrolls the focused role onto the reading line. Phones and reduced motion keep the vertical list.
- Skill: WebGL prop per category below the slabs (chip, rack unit, oscilloscope with a running trace, browser frame), spin swap; none on `/stack` and below 1024 px.
- Arcana: 768 px card texture with anisotropic filtering, thinner frame strokes, lower screentone amplitude, narrower titles; deck and inspect frames lighter, screentone 1.5 px.
- Bonfire: small ruined chapel behind the fire, merged into the ruins mesh with the same fog fade. Nothing else touched.

**Review (§10), two rounds per group, against the written §15** (`design/storyboard/` and `design/refs/` still do not exist here)
- Menu 1: echo text too faint, numbers far from their slabs, the menu always opened on 01. Fixed. Menu 2: echo too dominant at 1280×720 and running behind the chips. Fixed.
- Stage 1: name ran into the portrait rings and role line. Fixed. Stage 2: at 1920 px the name came within 21 px of the menu. Capped at 10rem.
- Descent 1: dome read as a wire cage and the lens was invisible. Fixed (smoked dome, paper lens bezel). Descent 2: the dome was seen from above. Tilted to be seen from below.
- Now 1: no side gutter, panel 03 ran off screen. Fixed. Now 2: label and title said the same; panels stretched with empty bottoms. Fixed.
- Record 1: bars slid under the year, too small, inactive bars too faint. Fixed. Record 2: active bar clipped at the left edge. Fixed.
- Skill 1: oscilloscope and browser turned their backs to the viewer. Sway instead of full rotation. Skill 2: browser front unreadable. Edges on every block.
- Arcana 1: frame still heavy, long title touched the corner traces. Fixed. Arcana 2: no further defect found.
- Bonfire 1: chapel too close and hidden behind the flame. Moved to z −7.6 between fire and tower. Bonfire 2: no further defect found.
- Final run: menu, stage, ride, reduced motion and deep pages pass (Playwright scripts outside the repo; the repo has no test runner). One menu and one stage run timed out at a host load average of 61 and passed on rerun.

**Decisions**
- Camera turn: the DOM board makes the full 90° yaw; the WebGL camera only whips up to 28° and drifts sideways, because a literal 90° turn in the scene faces empty space.
- NOW progress: TRICH-1 and cluster steps are unknown, so their quest bars scan instead of showing a made-up value; the apprenticeship bar follows the calendar year (2026 = step 2 of 3).
- TRICH-1 facts come from the project reference (balanced ternary, compiler / ISA / VM in Go, Verilog core on a Tang Nano 9K).

**Drafts for Richard's review**
- 05 Lab- & Ausbildungspfad, DE: "Seit 2025 mache ich bei R2P die Ausbildung zum IT-Systemelektroniker, Abschluss 2027. Ein großer Teil ist Außendienst beim Kunden: Ich installiere Netzwerke, baue Sicherheits- und Kamerasysteme auf und nehme sie in Betrieb."
- 05 Lab & Development Path, EN: "Since 2025 I have been training as an IT Systems Electronics Technician at R2P, finishing in 2027. Much of it is field work at customer sites: I install networks, set up security and camera systems and put them into operation."
- NOW texts in `src/data/now.js` (TRICH-1, cluster, apprenticeship).

**Open questions for Richard**
- TRICH-1 and cluster: which steps are done (quest bars)? Exact start and exam month of the apprenticeship?
- Internship (Sep 2024): any detail line? It currently has none.
- Are the panel 05 and NOW drafts right?
- Should the ride also run on tablets in portrait (768–1023 px)? It does now.

**Preview**
https://richardzuikov-com-git-feat-atlus-v4-ri4ards2006s-projects.vercel.app/ (behind the Vercel login)

**Files touched**
`design/{ASSETS,DESIGN,TASKS,WORKLOG}.md`, `src/assets/svg/**`, `src/data/now.js`, `src/lib/{atlus,translations}.js`, `src/pages/Stage.jsx`, `src/css/style.scss`, `src/components/MenuOverlay.jsx`, `src/components/atlus/{glyphs,KeyItems,RecordBoard,SkillBoard}.jsx`, `src/components/stage/{AboutSection,CardInspect,NowSection,ProjectDeck}.jsx`, `src/components/stage/{scene,descent-props,skill-props}.js`, `src/three/bonfire/ruins.js`

## 2026-11-10 · Claude Code (Opus 5.5) · merges and changelog v5

**Merges**
- PR #13 (`chore/ci-docs`) into `feat/atlus-menu`: all CI checks green. From now on CI must be green before any merge (AGENTS.md otherwise forbids merging; the owner asked for these two).
- PR #14 (v4): `feat/atlus-menu` (with the new CI) merged into `feat/atlus-v4` first so the new workflows ran on it; all green (Build, Playwright E2E, Lighthouse, Gitleaks, dependency / EXIF audit, Vercel), then merged.

**Worktree**: `../rz-atlus-v5` (outside the main checkout, as AGENTS.md asks), branch `feat/atlus-v5` from `origin/feat/atlus-menu`, upstream unset so a bare push never targets `feat/atlus-menu`. It was first created inside the main checkout by mistake and moved with `git worktree move`.

**Done** (DESIGN.md §16, one commit per task)
- Global menu: v4 showed the stage menu, name and portrait through the opening wipe ("two menus"). Now a near-black screentone dimmer covers the page and the stage hero, canvas and dots button hide while the overlay is mounted. Screenshots: `design/screenshots/v5/menu-open-1440x900.png`, `menu-open-390x844.png`. No settings box anywhere (checked on `/` and `/career`).
- Props: placed in the centre of the free gutter beside their panel, hidden below 1024 px, hidden when the gutter is narrower than the rotating footprint or when that footprint touches any panel, heading or NOW panel. The capacitor was already gone in v4; the chip sits right of panel 01 and clear of panel 02.
- Hints: "versuch ↑↓", "wähl eine aus", "dreh sie um" and the visible deck hint removed (the deck keeps it in its aria-label). HUD bottom-right shows "↑↓ SELECT · ⏎ OPEN · ESC BACK" above Quick Read, hidden on touch screens.
- Ink: no permanent splatter behind the stage menu; each item has its own, shown on hover or arrow-key selection only.
- OPEN SCREEN slabs on about, arcana, skill, record → `/about`, `/work`, `/stack`, `/career` through the route wipe, now an ink panel with paper shards. ESC / BACK steps back in history and the stage lands on the saved scroll position (tested on all four, exact to the pixel at 1440 and 390).
- Screens: title slab, prop (own small lazy three.js canvas, 30 fps, paused off screen, still under reduced motion), sub-menu left, sticky detail right, screentone drift. `/about`: profile + the five descent entries; `/work`: one tab per project, framed card → CardInspect; `/stack`: SkillBoard + KeyItems, prop follows the category; `/career`: RecordBoard + entry panel. ArcanaCard (the old Work layout) and its CSS are deleted.
- Career detail: overlay with slash transition, rank, role, company, period, bullets, skills gained, ←/→ (wraps), ESC back without leaving the screen. Used on "/" and `/career`; it replaces the inline expand.
- Stack detail: same overlay; "what it is" (general tool descriptions in `src/data/stack-details.js`), framed project cards that open `/work` on that project (ESC returns to `/stack`), experience as a TODO key in development only. No ratings.
- Portraits: `<slot>.png` is treated as cream-on-black ink art, alpha from luminance (levels 6–70 %, `INK_LOW` / `INK_HIGH`), only ImageMagick needed; photos still use rembg. Tested on a synthetic cream-on-black image: corner alpha 0, cream alpha 1. Placeholders stay until a file exists.
- Fixed on the way: the stage measured after its DOM was gone when a route change raced a resize callback (TypeError); v4's "finer screentone" for deck cards had landed on the dead `.arcana-halftone` rule and now applies to the deck cards.

**Review (§10), two rounds per group**
- Menu 1: stage visible mid-wipe. Fixed. Menu 2: nothing further.
- Floating 1: ink on the auto-focused first item at load; ink hidden behind the paper slab. Fixed (pointer / arrow keys only, offset past the slab). Floating 2: nothing further.
- Screens 1: career board squeezed (year beside the list in a narrow column). Year above the list. Screens 2: prop column inflated the header; detail panel scrolled away. Prop height capped, detail sticky.
- Career detail 1: overlay text dark on dark (portalled outside the forced-dark wrapper). Fixed. 2: nothing further.
- Stack detail 1: empty EXPERIENCE heading in production. Hidden until the text exists. 2: project cards too big on phones. Fixed.

**Checks**: repo suite `npx playwright test` 18/18; own Playwright scripts for menu, open/return, screens, career and stack detail, ride, reduced motion and deep pages all pass.

**Decisions**
- "Ink only on hover/active": a stage menu item is always active, so ink follows hover and arrow-key selection, not the resting active item.
- Career detail replaced the inline expand everywhere, including the home ride.
- Screens opened from a Stack detail card use history back, so ESC on `/work` returns to `/stack`.
- `<slot>.png` = ink art, other formats = photo. A PNG photo would need converting to JPEG first.

**Open questions for Richard**
- Bullets for the internship and the non-R2P entries, and "experience in words" per skill.
- Should the descent props also show between 768 and 1023 px if a smaller size fits the gutter? Hidden now.
- The stage portrait shader drops pixels with alpha < 0.5; very faint ink strokes may vanish. Check with the real art and adjust `INK_HIGH` if needed.
- Earlier questions still open: TRICH-1 / cluster progress, apprenticeship months, panel 05 and NOW drafts.

**Preview**
https://richardzuikov-com-git-feat-atlus-v5-ri4ards2006s-projects.vercel.app/ (behind the Vercel login)

**Files touched**
`design/{DESIGN,TASKS,WORKLOG}.md`, `design/screenshots/v5/*`, `scripts/portraits.sh`, `src/App.jsx`, `src/css/style.scss`, `src/lib/translations.js`, `src/data/stack-details.js`, `src/assets/portraits/raw/README.md`, `src/pages/{Stage,About,Work,Stack,Career}.jsx`, `src/components/MenuOverlay.jsx`, `src/components/atlus/{Screen,OpenScreen,PropViewer,DetailScreen,CareerDetail,StackDetail,SkillBoard,RecordBoard}.jsx` (deleted `ArcanaCard.jsx`), `src/components/stage/{AboutSection,ProjectDeck}.jsx`, `src/components/stage/{scene,descent-props,skill-props,prop-viewer}.js`
