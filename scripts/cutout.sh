#!/usr/bin/env bash
# Portrait cut-outs (DESIGN.md §2 + §18 "Portraits"): src/assets/portraits/raw/<id>.png shot on a
# green screen -> a colour and a black-and-white cut-out per id.
#
#   1. EXIF / metadata strip, auto-orient
#   2. chroma key on green dominance g - max(r, b); spill suppression g := min(g, max(r, b))
#      (removes the green fringe in the hair); alpha erode 1 px + feather 1 px; crop to the figure
#   3. per output height: plain Lanczos resize, at most MAX_SCALE (1.75x) of the cropped source;
#      larger heights are skipped. No AI upscaling.
#   4. colour: despilled photo.  bw: luminance -> CLAHE -> sigmoidal S-curve -> film grain.
#      Both get the same RIM px paper rim behind the silhouette, so the crossfade never moves an edge.
#   5. AVIF + WebP, metadata stripped, named <id>-<color|bw>-<w>x<h>.<avif|webp>
#
# Also writes raw/lab/<id>.png (CLAHE luminance + alpha, gitignored) for the dev lab /?portrait-lab,
# which previews CONTRAST / GRAIN / RIM live.
#
# Usage: npm run cutout [-- <id> ...]   (default: stage about head night; ids without a raw file are skipped)
# Env:   CONTRAST  S-curve strength (sigmoidal contrast, midpoint 50 %)   default 5
#        GRAIN     film grain (ImageMagick -attenuate, sigma ~ 0.078 x GRAIN) default 0.22
#        RIM       paper rim width in px of the output image               default 1.5
#        KEY_LOW / KEY_HIGH  green dominance mapped opaque -> transparent    default 6% / 20%
#        RAW_DIR / OUT_DIR   override the folders (tests outside the repo)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="${RAW_DIR:-$ROOT/src/assets/portraits/raw}"
OUT="${OUT_DIR:-$ROOT/src/assets/portraits/cutout}"
CONTRAST="${CONTRAST:-5}"
GRAIN="${GRAIN:-0.22}"
RIM="${RIM:-1.5}"
KEY_LOW="${KEY_LOW:-6%}"
KEY_HIGH="${KEY_HIGH:-20%}"
HEIGHTS=(900 1400 1800)
MAX_SCALE=1.75
PAD=8      # edge-replicated frame extension (px of the source)
MARGIN=6   # context kept around the crop while resizing / building the rim, cut off at the end
PAPER='#f4f4f0'
INK='#050505'

if ! command -v magick >/dev/null; then
  echo "error: magick not found (ImageMagick 7 with AVIF + WebP), see $RAW/README.md" >&2
  exit 1
fi

ids=("$@")
[ "${#ids[@]}" -eq 0 ] && ids=(stage about head night)
mkdir -p "$OUT" "$RAW/lab"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# bw <in rgba> <out rgba>: luminance, CLAHE, S-curve, grain; alpha kept. Semi-transparent edge
# pixels are flattened onto ink first, so CLAHE never sees the keyed-out green.
clahe() {
  magick "$1" -background "$INK" -alpha remove -alpha off -colorspace gray -clahe 25x25%+128+2.5 "$2"
}

for id in "${ids[@]}"; do
  src="$RAW/$id.png"
  if [ ! -f "$src" ]; then
    echo "$id: no $id.png in $RAW, skipped"
    continue
  fi
  w="$WORK/$id"
  mkdir -p "$w"
  rm -f "$OUT/$id"-*

  # 1. Metadata off, orientation baked in; the frame is extended by PAD px of its own edge pixels, so
  #    a figure cut by the frame (shoulders, bust) continues past it and gets no rim along the cut.
  magick "$src" -auto-orient -strip -alpha off -colorspace sRGB -virtual-pixel edge \
    -set option:distort:viewport "%[fx:w+2*$PAD]x%[fx:h+2*$PAD]-$PAD-$PAD" -distort SRT 0 +repage "$w/rgb.png"
  read -r fw fh < <(magick "$src" -auto-orient -format '%w %h\n' info:)

  # 2. Key + despill + alpha.
  magick "$w/rgb.png" -fx 'max(0, g - max(r, b))' -colorspace gray "$w/green.png"
  magick "$w/rgb.png" -channel G -fx 'min(g, max(r, b))' +channel "$w/despill.png"
  magick "$w/green.png" -level "$KEY_LOW,$KEY_HIGH" -negate -morphology Erode Disk:1 -blur 0x1 "$w/alpha.png"
  # Figure box (1 px ink border so the trim never takes the figure as background), grown by 3 px
  # for the rim and clipped to the original frame. The working crop keeps MARGIN px more context.
  read -r bw bh bx by < <(magick "$w/alpha.png" -bordercolor black -border 1 -threshold 10% -format '%@\n' info: | tr 'x+' '  ')
  read -r x0 y0 x1 y1 < <(awk -v bw="$bw" -v bh="$bh" -v bx="$bx" -v by="$by" -v p="$PAD" -v fw="$fw" -v fh="$fh" 'BEGIN {
    x0 = bx - 1 - 3; y0 = by - 1 - 3; x1 = x0 + bw + 6; y1 = y0 + bh + 6
    if (x0 < p) x0 = p; if (y0 < p) y0 = p; if (x1 > p + fw) x1 = p + fw; if (y1 > p + fh) y1 = p + fh
    print x0, y0, x1, y1 }')
  cropw=$(( x1 - x0 )); srch=$(( y1 - y0 ))
  magick "$w/despill.png" "$w/alpha.png" -compose copy_opacity -composite \
    -crop "$(( cropw + 2 * MARGIN ))x$(( srch + 2 * MARGIN ))+$(( x0 - MARGIN ))+$(( y0 - MARGIN ))" +repage "$w/cut.png"

  # Lab input: CLAHE luminance + alpha at <= 900 px, with the context margin in the file name.
  labh=$(( srch < 900 ? srch : 900 ))
  read -r labfull labm < <(awk -v h="$labh" -v s="$srch" -v m="$MARGIN" 'BEGIN { k = h / s; printf "%d %d\n", (s + 2 * m) * k + 0.5, m * k + 0.5 }')
  magick "$w/cut.png" -filter Lanczos -resize "x$labfull" "$w/lab-rgba.png"
  clahe "$w/lab-rgba.png" "$w/lab-gray.png"
  rm -f "$RAW/lab/$id"-*.png
  magick "$w/lab-gray.png" \( "$w/lab-rgba.png" -alpha extract \) -compose copy_opacity -composite -strip "$RAW/lab/$id-m$labm.png"

  written=()
  for h in "${HEIGHTS[@]}"; do
    if awk -v h="$h" -v s="$srch" -v m="$MAX_SCALE" 'BEGIN { exit !(h > s * m) }'; then
      echo "$id: ${h}px would be $(awk -v h="$h" -v s="$srch" 'BEGIN { printf "%.2f", h / s }')x of the ${srch}px crop (max ${MAX_SCALE}x), skipped"
      continue
    fi
    # Output size and the margin to cut off again, at this scale.
    read -r full m cw < <(awk -v h="$h" -v s="$srch" -v m="$MARGIN" -v c="$cropw" 'BEGIN { k = h / s; printf "%d %d %d\n", (s + 2 * m) * k + 0.5, m * k + 0.5, c * k + 0.5 }')
    # 3. Plain Lanczos resize.
    magick "$w/cut.png" -filter Lanczos -resize "x$full" "$w/c-$h.png"
    magick "$w/c-$h.png" -alpha extract "$w/a-$h.png"
    # 4. Black and white: CLAHE -> S-curve -> grain.
    clahe "$w/c-$h.png" "$w/g-$h.png"
    magick "$w/g-$h.png" -sigmoidal-contrast "${CONTRAST}x50%" -attenuate "$GRAIN" +noise Gaussian "$w/bw-$h.png"
    # Paper rim: alpha dilated by RIM px, under the figure.
    magick "$w/a-$h.png" -morphology Dilate "Disk:$RIM" "$w/rim-$h.png"
    canvas="$(magick identify -format '%wx%h' "$w/c-$h.png")"
    size="${cw}x${h}"
    for layer in color bw; do
      if [ "$layer" = color ]; then fig="$w/c-$h.png"; else
        magick "$w/bw-$h.png" "$w/a-$h.png" -compose copy_opacity -composite "$w/bwa-$h.png"
        fig="$w/bwa-$h.png"
      fi
      magick \( -size "$canvas" xc:"$PAPER" "$w/rim-$h.png" -compose copy_opacity -composite \) \
        "$fig" -compose over -composite -crop "${size}+${m}+${m}" +repage "$w/$layer-$h-final.png"
      base="$OUT/$id-$layer-${size}"
      magick "$w/$layer-$h-final.png" -strip -depth 8 -quality 62 "$base.avif"
      magick "$w/$layer-$h-final.png" -strip -quality 82 -define webp:alpha-quality=95 -define webp:method=6 "$base.webp"
    done
    written+=("$size")
  done
  if [ "${#written[@]}" -eq 0 ]; then
    echo "error: $id: no output height fits ${MAX_SCALE}x of the ${srch}px crop; use a larger photo" >&2
    exit 1
  fi
  echo "$id: colour + bw at ${written[*]} (AVIF + WebP) -> $OUT"
done
