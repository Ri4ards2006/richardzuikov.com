# External Assets Log

All external assets used on the site are CC0 / Public Domain and documented here per `DESIGN.md` §1, §7 Card 05 and §9.

---

## Textures

### Stone Floor (Bonfire Rest Site)
- **Asset Name**: Stone Floor (`stone_floor`)
- **Source**: Poly Haven (https://polyhaven.com/a/stone_floor)
- **License**: CC0 / Public Domain (No Rights Reserved)
- **Author**: Dimitrios Savva
- **Files in Repo**:
  - `public/textures/bonfire/stone_floor_diff.jpg` (Diffuse map, 512×512 optimized JPEG)
  - `public/textures/bonfire/stone_floor_rough.jpg` (Roughness map, 512×512 optimized JPEG)
  - `public/textures/bonfire/stone_floor_nor.jpg` (OpenGL Normal map, 512×512 optimized JPEG)
- **Usage**: Applied to the procedural instanced stone floor slabs in `src/three/bonfire/index.js` via `MeshStandardMaterial`.

---

## SVG glyphs

- **Source**: `design/assets-src/` (PR #11), drawn for this project, no third-party material.
- **Build copies**: `src/assets/svg/` (tracestar, tracestar-16, card-frame, ink-01…05, icons/*), optimized with `npx svgo@3.3.2 -r -f src/assets/svg --multipass` (26.8 KB → 16.2 KB). svgo is run on demand, not a dependency. Re-run after editing a source.
- **Usage**: `src/components/atlus/glyphs.jsx` (`TraceStar`, `CardFrame`, `Icon`, `InkSplat`, `ImpactInk`); the 3D arcana cards rasterise `card-frame.svg` in `drawCard` (`src/components/stage/scene.js`).
