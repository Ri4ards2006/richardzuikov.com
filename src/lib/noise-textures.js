// Small canvas-generated textures. SVG feTurbulence backgrounds block the main thread for seconds.
const cache = new Map();

function makeCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function fillNoise(canvas, rgb, alphaOf) {
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < image.data.length; i += 4) {
    const [r, g, b] = rgb();
    image.data[i] = r;
    image.data[i + 1] = g;
    image.data[i + 2] = b;
    image.data[i + 3] = alphaOf();
  }
  ctx.putImageData(image, 0, 0);
}

function cached(key, build) {
  if (!cache.has(key)) cache.set(key, `url(${build().toDataURL()})`);
  return cache.get(key);
}

export function grainTexture() {
  return cached('grain', () => {
    const canvas = makeCanvas(192);
    fillNoise(canvas, () => {
      const value = Math.random() * 255;
      return [value, value, value];
    }, () => 150);
    return canvas;
  });
}

// Soft cloud alpha map: random grids of rising detail, smoothly upscaled and stacked.
export function fogTexture(cells) {
  return cached(`fog-${cells}`, () => {
    const canvas = makeCanvas(256);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    [cells, cells * 2, cells * 4].forEach((size, octave) => {
      const layer = makeCanvas(size);
      fillNoise(layer, () => [200, 200, 196], () => Math.random() * 255);
      ctx.globalAlpha = 1 / (octave + 1);
      ctx.drawImage(layer, 0, 0, 256, 256);
    });
    return canvas;
  });
}
