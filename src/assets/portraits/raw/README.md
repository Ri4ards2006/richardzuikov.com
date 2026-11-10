# Portrait sources

Drop one file per slot here: `stage.*` (front-facing, looking into the camera), `about.*` (side profile), `work.*`, `stack.*`, `career.*` or `contact.*`. This folder is gitignored, only this README is tracked.

- **Ink art** (cream lines on a black background) as `stage.png` / `about.png`: the black becomes transparent from the luminance, so no manual cutout is needed. Only `magick` is required. If faint strokes vanish or the background keeps a haze, adjust the levels: `INK_LOW=4% INK_HIGH=60% npm run portraits`.
- **Photos** as `.jpg` / `.jpeg` / `.webp` / …: the background is removed with `rembg`.

## Install on Arch

```sh
sudo pacman -S imagemagick
pipx install "rembg[cli]"   # only for photos
```

## Run

```sh
npm run portraits
```

For each file the script makes the background transparent (luminance → alpha for `.png` ink art, `rembg` for photos), strips metadata, trims, and writes transparent `../<name>-1400.webp` and `../<name>-700.webp` (height in px). Commit those two files.

Photos are processed locally and never uploaded. On its first run `rembg` downloads its model file once to `~/.u2net/`.

An id without a photo falls back to a silhouette: `../front-silhouette.svg` for `stage`, `../profile-silhouette.svg` for `about`, `../silhouette.svg` for the rest (see `src/data/portraits.js`).

## Poster pipeline (green screen, v7)

For `about.png` / `stage.png` shot on a green screen:

```sh
npm run poster            # about and stage; an id without a raw file keeps its placeholder
npm run poster -- about   # only one id
```

Strips EXIF, keys out the green (with spill suppression on the hair edge), erodes the alpha by 1 px and feathers it by 1.5 px, then writes three layers to `../poster/`: `<id>-gray-*` (grayscale + CLAHE, input of the 5-tone shader), `<id>-color-*` (for the colour reveal) and `<id>-poster-*` (static 5-tone poster with a 2 px paper rim, used without WebGL or with reduced motion). Each as AVIF + WebP at 900 / 1400 / 1800 px wide; widths larger than the cut-out are skipped, never upscaled. Commit the files in `../poster/`. If the key eats into dark green clothing or leaves a haze, adjust `KEY_LOW=4% KEY_HIGH=16% npm run poster`.

Tune the shader live in development at `/?portrait-lab` (sliders for the four tone steps, softness, edge strength and rim width, plus the `colorReveal` toggle), then copy the values into `DEFAULT_PARAMS` in `src/components/atlus/poster-gl.js`.
