import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cutoutSet } from '../data/portraits';
import CutoutPortrait from '../components/atlus/CutoutPortrait';

// Dev-only portrait lab (/?portrait-lab, DESIGN.md §18 "Portraits"): previews the B/W look of
// `npm run cutout` live (contrast = S-curve, grain, rim) on the CLAHE luminance the pipeline leaves in
// raw/lab/ (gitignored), next to the baked cut-out with its colour cross-fade. When it looks right, run
// the printed command. Never part of the production bundle (App.jsx imports it only in DEV).
const labFiles = import.meta.glob('../assets/portraits/raw/lab/*.png', { eager: true, query: '?url', import: 'default' });
const allCutouts = import.meta.glob('../assets/portraits/cutout/*.{avif,webp}', { eager: true, query: '?url', import: 'default' });

// Same defaults as scripts/cutout.sh.
const DEFAULTS = { contrast: 5, grain: 0.22, rim: 1.5 };
const SLIDERS = [['contrast', 0, 15, 0.5], ['grain', 0, 1, 0.01], ['rim', 0, 4, 0.5]];
const PAPER = [244, 244, 240];

const labInputs = Object.fromEntries(Object.entries(labFiles).map(([path, url]) => {
  const [, id, margin] = path.match(/\/([a-z]+)-m(\d+)\.png$/) ?? [];
  return [id, { url, margin: Number(margin) }];
}).filter(([id]) => id));

// ImageMagick -sigmoidal-contrast {contrast}x50%.
const sigmoidal = (contrast) => {
  if (contrast < 0.01) return (u) => u;
  const sig = (u) => 1 / (1 + Math.exp(contrast * (0.5 - u)));
  const lo = sig(0);
  const hi = sig(1);
  return (u) => (sig(u) - lo) / (hi - lo);
};

const gaussian = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

function render(canvas, image, margin, { contrast, grain, rim }) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const src = document.createElement('canvas');
  src.width = w;
  src.height = h;
  const sctx = src.getContext('2d', { willReadFrequently: true });
  sctx.drawImage(image, 0, 0);
  const data = sctx.getImageData(0, 0, w, h);
  const px = data.data;
  const curve = sigmoidal(contrast);
  const sigma = 0.078 * grain; // ImageMagick +noise Gaussian at -attenuate 1 ≈ σ 0.078
  const mask = new ImageData(w, h);
  for (let i = 0; i < px.length; i += 4) {
    const v = Math.min(1, Math.max(0, curve(px[i] / 255) + (sigma ? gaussian() * sigma : 0))) * 255;
    px[i] = v; px[i + 1] = v; px[i + 2] = v;
    mask.data[i] = PAPER[0]; mask.data[i + 1] = PAPER[1]; mask.data[i + 2] = PAPER[2]; mask.data[i + 3] = px[i + 3];
  }
  sctx.putImageData(data, 0, 0);
  const rimCanvas = document.createElement('canvas');
  rimCanvas.width = w;
  rimCanvas.height = h;
  rimCanvas.getContext('2d').putImageData(mask, 0, 0);

  canvas.width = w - margin * 2;
  canvas.height = h - margin * 2;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Rim: the paper silhouette stamped around a circle of radius `rim` (a disk dilation).
  if (rim > 0) {
    for (let k = 0; k < 24; k += 1) {
      const a = (k / 24) * Math.PI * 2;
      ctx.drawImage(rimCanvas, -margin + Math.cos(a) * rim, -margin + Math.sin(a) * rim);
    }
  }
  ctx.drawImage(src, -margin, -margin);
}

export default function PortraitLab() {
  const ids = Object.keys(labInputs).sort();
  const [id, setId] = useState(ids.includes('stage') ? 'stage' : ids[0]);
  const [params, setParams] = useState(DEFAULTS);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const baked = useMemo(() => (id ? cutoutSet(id, allCutouts) : null), [id]);

  useEffect(() => {
    if (!id) return undefined;
    let live = true;
    const img = new Image();
    img.onload = () => { if (live) setImage(img); };
    img.src = labInputs[id].url;
    return () => { live = false; };
  }, [id]);

  useEffect(() => {
    if (image && canvasRef.current) render(canvasRef.current, image, labInputs[id].margin, params);
  }, [image, params, id]);

  const command = `CONTRAST=${params.contrast} GRAIN=${params.grain} RIM=${params.rim} npm run cutout`;
  return (
    <div className="portrait-lab">
      <aside>
        <h1 className="font-anton text-3xl uppercase">Portrait lab</h1>
        {ids.length === 0 && <p className="mt-3 text-sm">No lab input yet. Put <code>stage.png</code> etc. into <code>src/assets/portraits/raw/</code> and run <code>npm run cutout</code>.</p>}
        {ids.length > 1 && (
          <select value={id} onChange={(event) => setId(event.target.value)}>
            {ids.map((value) => <option key={value}>{value}</option>)}
          </select>
        )}
        {SLIDERS.map(([key, min, max, step]) => (
          <label key={key}>
            <span>{key} <output>{params[key]}</output></span>
            <input type="range" min={min} max={max} step={step} value={params[key]} onChange={(event) => setParams({ ...params, [key]: Number(event.target.value) })} />
          </label>
        ))}
        <button type="button" onClick={() => setParams(DEFAULTS)}>reset</button>
        <pre>{command}</pre>
      </aside>
      {id && (
        <div className="portrait-lab-stage">
          <figure>
            <canvas ref={canvasRef} className="portrait-lab-canvas" />
            <figcaption>live B/W (lab preview, 900 px)</figcaption>
          </figure>
          {baked && (
            <figure>
              <CutoutPortrait set={baked} focusable alt={`${id} cut-out`} sizes="40vw" />
              <figcaption>baked cut-out · hover / focus = colour</figcaption>
            </figure>
          )}
        </div>
      )}
    </div>
  );
}
