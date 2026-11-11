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
https://richardzuikov-com-git-feat-atlus-v5-ri4ards2006s-projects.vercel.app/ (behind the Vercel login). Not built yet: all four Vercel projects answered "Deployment rate limited — retry in 24 hours" on PR #16, so the Vercel checks are red for that reason only. The GitHub checks (build, Playwright E2E, Lighthouse, Gitleaks, dependency / EXIF audit) are green. Re-run the Vercel deployment after the limit resets; do not merge before it is green.

**Files touched**
`design/{DESIGN,TASKS,WORKLOG}.md`, `design/screenshots/v5/*`, `scripts/portraits.sh`, `src/App.jsx`, `src/css/style.scss`, `src/lib/translations.js`, `src/data/stack-details.js`, `src/assets/portraits/raw/README.md`, `src/pages/{Stage,About,Work,Stack,Career}.jsx`, `src/components/MenuOverlay.jsx`, `src/components/atlus/{Screen,OpenScreen,PropViewer,DetailScreen,CareerDetail,StackDetail,SkillBoard,RecordBoard}.jsx` (deleted `ArcanaCard.jsx`), `src/components/stage/{AboutSection,ProjectDeck}.jsx`, `src/components/stage/{scene,descent-props,skill-props,prop-viewer}.js`

## 2026-11-10 · Claude Code (Opus 5.5) · merges and changelog v6

**Merges** (GitHub checks green; Vercel not required for `feat/atlus-menu`, as asked)
- PR #15 (agy e2e v4) into `feat/atlus-menu`.
- PR #16 (v5): asked to rebase onto #15, but `feat/atlus-v5` was already pushed and a rebase needs a force-push, which is forbidden. Merged `feat/atlus-menu` into `feat/atlus-v5` instead (same result, no rewrite), then merged #16.
- One test changed on the way, because the behaviour change was intentional: agy's "stage nav is occluded" test expected the blocked click to fail with "intercepts pointer events" or "hidden"; since v5 the stage nav is `visibility: hidden` while the overlay is open, so Playwright reports "not visible". The assertion now accepts that too.
- That push of v5 was the only extra push; v6 is pushed once at the end.

**Worktree**: `../rz-atlus-v6`, branch `feat/atlus-v6` from `origin/feat/atlus-menu`, upstream unset.

**Done** (DESIGN.md §17, one commit per task, two review rounds each)
1. Menu: in the merged v5 the overlay already had one list; Richard's screenshot (two lists ~120 px apart, Quick Read twice) matches v4, where the stage slabs and the stage Quick Read showed through. What v5 still got wrong and is fixed now: the MENU letters overlapped the list (letters to x = 222, list from x = 216 at 1440), stage slabs were hidden but focusable, name and portrait were gone. Now: MENU column, list 40 px right of it (32 px on phones), stage slabs hidden + `inert`, one Quick Read in the utility row, name block + portrait inside the overlay (so they also appear on deep pages), echo enters with 12 px, legal links above the shards. Checked at 1024, 1280, 1440, 1920 and 390 (one list, one Quick Read, even leading, no overlap, legal never under a shard) on `/` and `/career`. e2e: stage nav inert, five items, one Quick Read.
2. Prop drift, root cause: `measure()` (ResizeObserver on `<html>`) read the descent panels with `getBoundingClientRect`, which includes their scroll-dependent parallax transform. A re-measure mid-scroll baked the current offset into the prop anchors and into the panel tops that drive `--depth`, which feeds the same transform (feedback loop); `--depth` also froze outside |1.6|. Measured: one re-measure moved panel tops by up to 190 px. Fix: layout rects (offset chain), `pos = anchor + parallax(scroll) + idle(t) + kick`, kick = critically damped spring (ω = 10, back within ~0.6 s), `--depth` a clamped pure function of scroll. Near and far panels drift ~280 px apart, so a prop no longer copies its panel's parallax blindly: each takes the first constant parallax that stays clear of every obstacle across all on-screen depths. `data-prop` proxies (`chip`, `pcb`, `monitor`, `rack`, `dome`) carry the drawn position, `data-rest` and `data-kick`. No GSAP is involved in the props. Acceptance: 5× top→bottom→top with accelerating wheel bursts plus forced re-measures, then 1 s: rest drift ≤ 1 px, kick ≤ 1 px for every prop; a scroll sweep at 1280 / 1440 / 1920 found no prop over text.
3. Colour: the images were never baked to grayscale (all runtime filters). Deck, Work and Stack cards: colour on hover / focus-visible, 250 ms ease-out, screentone fades with it; touch: centred deck card; inspect view stays in colour; reduced motion instant. WebGL tarot cards: a second face (colour photo, same mono frame and title) fades in on hover / focus. Measured saturation: 0 at rest, 17–30 on hover; non-selected cards stay 0.
4. KEY ITEMS: front emblem = exam code in Anton (sized to its length) + one small glyph; back shows `src/assets/badges/<id>.png` unmodified and in colour when present, linked only via `verifyUrl`; README in that folder. Tested with a throwaway badge (removed). DESIGN.md §7 / §9 updated.
5. NOW: Helm replaces the apprenticeship; helmet icon `design/assets-src/icons/viking-helmet.svg` (svgo 3.3.2 → `src/assets/svg/icons/`). Title "Helm" and kicker "KI-Agent / AI agent" in translations; summary and progress are TODO keys, visible in development only (production shows title, kicker, icon and a scanning bar).
6. Record ride: hairlines → 15 tapered wedges at −8°, irregular, opacity ≤ 0.25, moving with the ride (×1.6). Year counter on a solid-ink column, track starts right of it, first role fully readable on landing. The old exit (rotateY away, then ~1.5 screens of empty pin) is replaced by a 90° roll while the pin scrolls out, so the bonfire rises in as the timeline turns; WebGL camera rolls 12° and back. Scroll-driven, so reversible. Reduced motion keeps the vertical list.
7. Fourier vignette (P3): odd harmonics 1 … 15, one per 2 s, ghosts stay, Gibbs overshoot visible, "Σ sin(nωt)/n". The "pick one" hint under the skill list no longer exists (removed in v5; searched source and rendered `/`, `/stack`, 390).

**Review (§10)**
- Menu 1: echo half under KONTAKT at 1024. Smaller, lower. Menu 2: page title counted as a second list on `/career` → false positive (hidden under the overlay); the check is occlusion-aware now.
- Props 1: no prop visible at all: the sweep counted overlaps off screen. On-screen only. Props 2: real on-screen collisions with the opposite column. Parallax candidates.
- Colour 1/2: nothing to fix beyond checks.
- Key items 1: glyph huge (a general glyph rule won), code pushed into the numeral. Fixed; badge centred.
- NOW 1: spectacles read as "w", side lines as legs. Closed eye openings, longer nose guard, no side lines.
- Ride 1: board vanished with an empty pinned screen after it. Roll hand-over. Ride 2: fine at rest; a leaving bar is clipped at the column edge, which is intended.
- Fourier 1: fine.

**Checks**: `npx playwright test` 23 passed, 1 skipped (ride on mobile, by design). Own scripts (menu at 5 widths on `/` and `/career`, drift, prop-over-text sweep, colour saturation, key items, NOW, ride frames, Fourier frames) all pass.

**Decisions**
- Emblems without an official exam code use a title keyword: POWER (IBM Power Linux), PYTHON (Google IT Automation), ARCHITECT (IBM Systems and Solutions Architect). Change in `translations.js` (`emblem`).
- Badge file name = certificate `id` (e.g. `7Y5OLV313LZX.png` for AZ-900).
- "Echo ≤ 12 px offset" read as the entrance offset of the giant echo; there is no second echo list.
- Helm title is the project name; only summary and progress are TODO keys. Nothing about what Helm does is on the site.
- The roll hand-over turns the timeline clockwise (left becomes up, matching the scroll).

**Open questions for Richard**
- Badge PNGs and verify URLs per certificate (only Google IT Automation has one now).
- Helm: one or two sentences and the steps for the progress bar.
- Codes for POWER / PYTHON / ARCHITECT, if you prefer something else.
- `feat/portrait-poster`: no branch or task text in the repo, so it was not run; the colour cutout and the `colorReveal` toggle wait for that task's description.
- Earlier ones still open: internship and non-R2P bullets, experience per skill, TRICH-1 / cluster progress, panel 05 / NOW drafts.

**Preview**
https://richardzuikov-com-git-feat-atlus-v6-ri4ards2006s-projects.vercel.app/ (behind the Vercel login; built after the single push, unless the daily limit is hit again).

**Files touched**
`.github/tests/e2e.spec.js`, `design/{DESIGN,TASKS,WORKLOG}.md`, `design/assets-src/icons/viking-helmet.svg`, `design/screenshots/v6/*`, `src/assets/badges/README.md`, `src/assets/svg/icons/viking-helmet.svg`, `src/css/style.scss`, `src/data/now.js`, `src/lib/translations.js`, `src/pages/Stage.jsx`, `src/components/MenuOverlay.jsx`, `src/components/atlus/{glyphs,KeyItems,RecordBoard,SkillVignette}.jsx`, `src/components/stage/{CardInspect,NowSection}.jsx`, `src/components/stage/{scene,descent-props,prop-ids}.js`

## 2026-11-10 · Claude Code (Opus 5.5) · prop test hook (follow-up to v6)

The v6 report in the chat was cut off after task 1. The task 2–7 summary was already in this WORKLOG (entry above), so it was not added a second time.

**Prop drift, root cause with lines (before `6088375`)**: `src/components/stage/scene.js:435` (`measure()`, run by the ResizeObserver on `<html>`) read the panels with `getBoundingClientRect()`. That rect includes the scroll-dependent parallax transform (`--depth`). From it came the prop anchors (`props.layout(...)`, :442) and the panel tops, and those tops drive `--depth` in the frame loop (:606–608). The result was a feedback loop: every re-measure mid-scroll baked the current offset in, up to 190 px. In addition, :608 wrote `--depth` only while |depth| < 1.6, so depth froze at the last value.

**Answer to agy**: `[data-prop]` are DOM proxies (`.prop-proxies` in `Stage.jsx`). `sync()` (`descent-props.js`) writes their transform every frame from the projected `root.position` of the mesh, before `renderer.render`; so they are coupled, not independent. Because they are still proxies, the test hook below was added.

**Test hook**: `window.__propScreenPos()` → `{ frame, props: [{ id, visible, x, y }] }`. It holds the world position of each prop mesh (`getWorldPosition`), projected with the camera of the frame that was just rendered, in viewport px. It is only set in dev or with `?e2e=1` (`scene.js`) and removed on dispose. `screenPositions(camera)` in `descent-props.js` reads only the meshes and never the DOM.

**Test**: `.github/tests/e2e.spec.js` › "Prop screen positions (test hook)" checks four things: no hook without `?e2e=1`; 5 ids; `frame` increases; hook and proxy centre differ by < 1.5 px. Desktop only, because props are hidden below 1024 px. Full suite: 24 passed, 2 skipped (both mobile, by design). `test:security` green.

## 2026-11-10 · Claude Code (Opus 5.5) · changelog v7

**Step 0**: PR #19: checks green, set from draft to ready, merged into `feat/atlus-menu` (`baa6c22`). Worktree `../rz-atlus-v7`, branch `feat/atlus-v7` from `origin/feat/atlus-menu`. `design/REVIEW-v6.md` is not on `feat/atlus-menu`; it lives on `test/e2e-v6` (PR #18, not merged) and was read from there.

**Task 1: descent props disappear (P0)**

Evidence before the fix (per-prop log through the extended hook: visible, scene, frustum, layout reason; script outside the repo):
- (a) **Confirmed, cause.** `layout()` hid a prop when no parallax candidate passed the runtime text-collision sweep. The result depended on the moment of measurement. 2560×1440, three cold loads: first measure `all ok`, re-measure after ~400 ms (fonts/images) → `monitor: collision, dome: collision`. The camera (panel 05) disappeared and stayed gone until the next layout change. Other viewports, zoom levels or font timings flip other props. In addition each prop took a parallax constant other than its panel's (up to ±150 px × depth), so at some scroll positions it hung far from its panel, and Richard read that as "missing". Richard's "chip on panel 02" also did not match the old map (chip was on 01, PCB on 02).
- (b) **Ruled out.** No object is shared: all builders are factories, the `/about` camera is its own instance in its own renderer (`prop-viewer.js`, `prop="domeCamera"`, by design). Every descent prop reported `scene: descent` before and after opening/closing all four sub-screens.
- (c) **Not the cause.** Every prop with `visible` was `inFrustum`. Still set `frustumCulled = false` for the five, as the brief asks.
- (d) **Ruled out.** No IntersectionObserver or enter/leave state on the props; 5 fast wheel bursts changed nothing.

Fix: see DESIGN.md §18 (rows with reserved slots, fixed map, visibility by breakpoint only, collision code deleted). Found while verifying: the drawn mesh sat 8–25 px off its rest point, because the props live at z = −0.4 while the px→world scale is for z = 0 (4 % per distance from the screen centre) plus camera damping. Now each prop is placed by a ray through the frame's camera.

Acceptance (script outside the repo): 1440×900, 20 random scroll positions + after opening/closing `/about`, `/work`, `/stack`, `/career` + after 5× fast top→bottom→top: 108 checks, 0 fails. Every prop whose panel is in view is visible, in scene `descent`, in the frustum when its slot is on screen, has a rest error ≤ 0.07 px to its slot, has a mesh within the idle amplitude (≤ 7 px), and has no on-screen overlap with any text block. Same result at 1024×768 (106), 1920×1080 (115), 2560×1440 (140). At 1023, 768 and 390 px all five are hidden. Screenshots: `design/screenshots/v7/props/panel-0{1..5}-1440.png`, `descent-390.png`.

Review (§10): round 1 at 1440: PCB, chip and camera sit beside their panels; 13rem slot → the footprint touched panel 01 at the top edge, but only off screen. Slot set to 11rem, check limited to on-screen overlap. Round 2 at 390: layout unchanged, no slots.

e2e: the hook test now also checks the fixed slot order, all five `visible` in scene `descent` and, at each panel, rest = slot (±1 px). Note: a leftover `vite preview` from the v6 worktree on :4173 had served the old build to Playwright (`reuseExistingServer`); stopped, then 24 passed, 2 skipped.

**Task 2: pause menu = real pause state (P0)**
- Reproduced at 1440×900 on the bonfire: with the menu open, wheel + PageUp scrolled the page from 11955 to 11168; `<main>` was neither inert nor aria-hidden (only `body` had overflow hidden). The page itself was not readable behind the opaque panel in my build. Richard's screenshot may come from an older deploy or the wipe; the new backdrop is opaque either way.
- No Lenis in the project (native scroll), so `lenis.stop()` does not apply. The lock is `overflow: hidden` on `<html>` plus a capture listener for wheel/touch, and the position is restored on close.
- Layout rebuilt as the 12-column grid of the brief (DESIGN.md §18). The old giant echo is now the preview label (`clamp(48px, 6vw, 112px)`, measured 61 / 77 / 86 / 112 px at 1024 / 1280 / 1440 / 1920). New keys `atlus.menuPreview.*` (DE/EN): one line per section describing what it contains, no claims about Richard.
- Checks (script outside the repo) at 1024, 1280, 1440, 1920, 390, 360: scroll unchanged while open and restored exactly; letters height = list height (283 / 346 / 385 / 503 / 238 / 222 px); no overlap between list, preview, footer zones, chips and close button; nothing wider than the viewport. Menu entries still land (Projekte → `#arcana` at top 64, Werdegang → ride landing, Kontakt → end).
- Review (§10): round 1: MENU showed only "M E" (container-query units in the container's own font-size fall back to the viewport → moved to the spans); at 1024 the legal links ran under GITHUB (footer tracks `auto auto auto` + space-between, compact chips below 1280). Round 2: at 360 the numbers broke into two lines ("01" / "/") → nowrap; umlaut dots of "Ü" clipped in the label and the slab → line height / padding.
- e2e: new test "Pause menu (v7)": wheel + PageUp don't move the page, `main` inert + aria-hidden, letters = list height, no footer chip overlap, Escape restores the exact position and releases `main`. 26 passed, 2 skipped.
- Screenshots: `design/screenshots/v7/menu-{1024,1280,1440,1920,390,360}.png`.

**Stopped after task 2** (brief: "if the session gets long, finish the current task, push, report, stop"). Tasks 3–6 are open in TASKS.md.
- `design/ABOUT.md`: Richard's ABOUT template taken over as the source for `/about`, plus a section for the requested world map (countries filled white). Richard's chat note "erfinde vorerst die about seite grob" conflicts with the brief's "never invent hobbies, ages, numbers or levels". Planned for task 3: build the screen structure roughly, but with TODO keys instead of invented facts (hidden in production).
- Task 6 blocker: `src/assets/portraits/raw/about.png` does not exist, not in this worktree and not in the main checkout (`raw/` is gitignored, so it doesn't travel with git).

**Checks**: `npm run build` ok, `npm run test:security` ok, `npx playwright test` 26 passed, 2 skipped (both mobile, by design).

## 2026-11-10 · Claude Code (Opus 5.5) · v7 tasks 3–6 (replacement brief)

**Step 0**: PR #19 was already merged into `feat/atlus-menu` (`baa6c22`). The replacement brief's tasks 1 (props) and 2 (pause menu) match what the earlier v7 run did (`fdb2fd3`, `e69a41d`, entry above) and were not redone; the full e2e suite still passes on top of the new work. Continued in `../rz-atlus-v7` on `feat/atlus-v7`.

**Content note**: the ABOUT block in the brief arrived empty ("…"), and `design/ABOUT.md` is still the unfilled template. `/about` therefore uses only what that template names (base Flensburg; languages German, English, Latvian, Russian without levels; hobbies Powerlifting and Home lab without lines) plus the role from the brief and the published NOW entries for "building". Everything else is a TODO key. No age (the old "20 Jahre" quick fact is not in the ABOUT block).

**Task 3: /about rework**
- Copied descent panels removed; one line "Skills → Stack". New status screen (DESIGN.md §18): portrait with HUD rings, STATUS · WEEK · INVENTORY · NOW, intro, own camera prop instance (`PropViewer`, unchanged), idle motion.
- **Intro draft for Richard's review** (`src/data/profile.js` → `intro`, DE + EN, 52 / 58 words), built only from the facts above: "Ich bin Richard, Azubi zum IT-Systemelektroniker bei R2P in Flensburg, fertig 2027. Im Außendienst verlege ich Netzwerke und nehme Kamerasysteme beim Kunden in Betrieb. Zu Hause steht mein Home-Lab, und an eigenen Platinen sitze ich auch. Hier geht es nicht um Skills, sondern darum, wer ich daneben bin."
- In production WEEK is hidden (all seven days are TODO); STATUS, INVENTORY (2 tiles) and NOW (building only) show.
- Review (§10): round 1: the intro under the title pushed the portrait below the fold → intro moved into the body grid beside the portrait; rings re-centred; on phones the portrait is 12rem. Round 2 (dev, all tabs): TODO text inherited Anton in tiles / NOW → mono; the week staircase wrapped Sunday's text → 0.2rem steps.
- New icons `barbell`, `rack`, `slot` (design/assets-src/icons, src/assets/svg/icons). e2e: `/about` route + "status screen (v7)" test.
- Screenshots: `design/screenshots/v7/about-{1440,1024,390}.png`, `about-dev-tab{2,3,4}-1440.png`, `about-dev-week-390.png`.

**Task 4: Career ride**
- Speedline strip and the conic entrance lines removed. Three ink wedges with their own rates, outline year behind the active role, rank pips, active inverted, others dimmed.
- REVIEW-v6 P1: at 1440×900 role 0 now lands at x 713 with the year column ending at 561 (152 px). The year column has no ink box any more (it showed as a black rectangle over the wedges).
- Review: round 1: pips broke the bar grid (role pushed under the rank), the wedges were cut at the content edge (pin is 76rem wide), and the year's ink box showed → explicit grid placement, `overflow: visible clip` on the pin + full-bleed wedges, box removed. Round 2: the leaving role left a dark stub next to the year → mask fades leaving roles out before the column.
- Screenshots: `design/screenshots/v7/career-ride-{land,y1500,last}.png`, `career-screen-1440.png`, `career-390.png`.

**Task 5: the 90° turn**
- Own pinned beat of 0.6 × viewport height after the last role (`data-turn-start`, `data-turn-len` on `#record`); phases exactly as the brief (`turnState()` in `RecordBoard.jsx`). Measured: 25 % → 2.1°, 50 % → 72.5°, ≥ 70 % → 90°, scroll back → 0°.
- Review: round 1: the yaw container became a flex column, which stretched "SCREEN ÖFFNEN" across the board; and at 100 % the turned board covered the incoming title → `align-items: flex-start`; the board leaves upward along its new axis and fades while the title comes in. Round 2: strip fine; mid-turn the board passes under the header, which is intended.
- The year counter-rotates through the `rotate` property, because its entrance uses a transition on `transform` that would lag the scrub.
- e2e: "Record turn beat (v7)": hold = 0°, 75 % = 90° with the pin still at 64 px and the year at −90°, back = 0°.
- Strip: `design/screenshots/v7/turn-{0,25,50,75,100}.png`, `turn-strip.png`.

**Task 6: portrait poster**
- **Blocker**: `src/assets/portraits/raw/about.png` does not exist (not in this worktree, not in the main checkout, nowhere under ~/Projects, ~/Media, ~/Downloads). The pipeline was built and checked on a synthetic green-screen image in the scratchpad; its output was never committed. `/about` keeps the silhouette until real files exist in `src/assets/portraits/poster/`.
- Found while testing: `-border` inherited the `copy_opacity` compose and turned the colour cut-out bilevel → compose reset; IM's channel compositing turned the key mask grey → `-fx` for the key and despill (~5 s for 2000×2400). AVIF forced to 8 bit.
- Found in the lab: React StrictMode runs the effect twice, and `dispose()` called `loseContext()` on the canvas that the second run reuses → white canvas. `loseContext()` removed.
- The lab's JS is not in the production bundle (DEV guard); its few CSS rules are.
- Screenshot: `design/screenshots/v7/portrait-lab-synthetic.png` (default params · edge 4 / rim 6 · colour reveal mid · full).

**Not touched**: `labs/`, `src/labs/`. `design/REVIEW-v7.md` (untracked, written by agy during this session) was read but not committed; it reviews the earlier v7 state.

**Open questions for Richard**
- Fill `design/ABOUT.md` (languages + levels, week, a dry line per hobby, more hobbies, learning / reading, age if you want it shown).
- Review the intro draft.
- `about.png` (green screen) into `raw/`, then `npm run poster -- about`.
- World map: still waits for the country list (not part of this brief).

## 2026-11-11 — v8 polish (DESIGN.md §19), branch feat/atlus-v8

Stacked on `feat/atlus-v7` because PR #24 was still open; the PR targets `feat/atlus-v7` and gets retargeted to `feat/atlus-menu` once #24 is merged.

**Task 1: hero** — Review round 1: the figure (70 vh, left edge at 50 %) put the role line across the glasses and ZUIKOV across the hair → name capped at 15vh, figure at 48 %, hard ink offset on name + role. Round 2 (1280 / 1440 / 1920): face clear of the role line everywhere; the hair still passes under ZUIKOV, which reads as layering, not collision. The HUD hints sit in the faded bottom of the figure. 0 s vs 3 s: only breathing and water differ. `/about`'s figure breathing also dropped to 0.6 %.

**Task 2: edges** — Cut edges measured on the alpha channel (share of opaque pixels on the edge row/column). Before: hard hip line + vertical right edge on Who Am I and /about, hard bottom on the hero. After: all fade into ink; the WebGL hero follows the stage / head swap.

**Task 3: props** — The slot (11rem) was what bounded the drawn size, not SIZE; slot 16.5rem + SIZE 1.6. No overlap at 1024 / 1440 / 1920.

**Task 4: TODO / DRAFT** — Production builds were already clean, but `import.meta.env.DEV` follows NODE_ENV: `NODE_ENV=development vite build` leaked TODO / ENTWURF on `/`, `/quick`, `/about`, `/stack` (new test red). Gate now `DEV_HINTS` from `command === 'serve'`; the same build is green, the dev server still shows the hints.

**Task 5: /about** — WEEK gone; NOW + INVENTORY from Richard's list; own line icons book / code window / mountains + sun.

**Task 6: spacing** — Audit script (all visible text / boxed elements, scrolled through, at rest) at 1024 / 1440 / 1920: before, the `…` button and every section gutter sat at 20 px, near descent panels at 9 px at 1024. After: none under 24 px except the record ride bars and the clipped project deck (full bleed by design) and transient entrance / yaw states.

Screenshots: `design/screenshots/v8/` — `hero-0s`, `hero-3s`, `whoami`, `descent-{1,2,4}`, `about` at 1440×900 and 390×844; `descent-{1,4}-1024x768`.

**Open for Richard**: one dry line per hobby; details for the three NOW items; language levels; the intro draft.
