# External Assets Log

All external assets used on the site are CC0 / Public Domain and documented here per `DESIGN.md` §1, §7 Card 05 and §9.

---

## Textures

### Stone Floor (Bonfire Rest Site)
- **Asset Name**: Stone Floor (`stone_floor`)
- **Source**: Poly Haven (https://polyhaven.com/a/stone_floor)
- **License**: CC0 / Public Domain (No Rights Reserved)
- **Author**: Rob Tuytel
- **Files in Repo**:
  - `public/textures/bonfire/stone_floor_diff.jpg` (Diffuse map, 512×512 optimized JPEG)
  - `public/textures/bonfire/stone_floor_rough.jpg` (Roughness map, 512×512 optimized JPEG)
  - `public/textures/bonfire/stone_floor_nor.jpg` (OpenGL Normal map, 512×512 optimized JPEG)
- **Usage**: Applied to the procedural instanced stone floor slabs in `src/three/bonfire/index.js` via `MeshStandardMaterial`.
