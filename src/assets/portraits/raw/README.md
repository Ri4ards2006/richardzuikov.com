# Portrait source photos

Drop photos here named `about.*`, `work.*`, `stack.*`, `career.*` or `contact.*`, one per name. This folder is gitignored, only this README is tracked.

## Install on Arch

```sh
pipx install "rembg[cli]"
sudo pacman -S imagemagick
```

## Run

```sh
npm run portraits
```

For each photo the script removes the background with `rembg`, strips metadata, trims, and writes transparent `../<name>-1400.webp` and `../<name>-700.webp` (height in px). Commit those two files.

Photos are processed locally and never uploaded. On its first run `rembg` downloads its model file once to `~/.u2net/`.

A menu id without a photo falls back to `../silhouette.svg` (see `src/data/portraits.js`).
