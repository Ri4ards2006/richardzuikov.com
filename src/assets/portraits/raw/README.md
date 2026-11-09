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
