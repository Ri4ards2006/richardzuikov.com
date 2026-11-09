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
