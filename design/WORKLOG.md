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
