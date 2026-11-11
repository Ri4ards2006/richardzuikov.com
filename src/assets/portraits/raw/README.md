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

## Cut-out pipeline (green screen, v7)

For `stage.png`, `about.png`, `head.png`, `night.png` shot on a green screen:

```sh
npm run cutout            # all four; an id without a raw file is skipped
npm run cutout -- head    # only one id
```

Strips EXIF, keys out the green (spill suppression on the hair edge), erodes the alpha by 1 px and feathers it by 1 px, crops to the figure, then writes a colour and a black-and-white cut-out (CLAHE, S-curve, film grain) with a 1.5 px paper rim to `../cutout/` as AVIF + WebP, named `<id>-<color|bw>-<w>x<h>`. Heights 900 / 1400 / 1800 px with plain Lanczos, at most 1.75× the crop; larger heights are skipped (no AI upscaling). Commit the files in `../cutout/`, never this folder. If the key eats into dark green clothing or leaves a haze: `KEY_LOW=4% KEY_HIGH=16% npm run cutout`.

Tune the B/W look live in development at `/?portrait-lab` (contrast, grain, rim), then run the command it prints, e.g. `CONTRAST=5 GRAIN=0.22 RIM=1.5 npm run cutout`. The lab reads `lab/<id>-m<margin>.png`, which the pipeline writes here (gitignored).
