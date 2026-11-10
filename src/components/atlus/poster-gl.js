// Poster shader (DESIGN.md §18, v7 task 6): grayscale cut-out -> 5 tones with soft steps, a soft
// dark edge pass and a 2 px paper rim; optional colour reveal that dissolves into the colour photo.
// Plain WebGL2, no three.js: one quad, two textures.

export const TONES = ['#121212', '#2a2a2a', '#555555', '#8a8a8a', '#f4f4f0'];
export const DEFAULT_PARAMS = { t1: 0.2, t2: 0.38, t3: 0.56, t4: 0.76, soft: 0.025, edge: 1.4, rim: 2 };

const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uGray;
uniform sampler2D uColor;
uniform vec2 uTexel;
uniform vec4 uSteps;
uniform float uSoft;
uniform float uEdge;
uniform float uRim;
uniform float uReveal;
uniform vec3 uTones[5];

float lum(vec2 uv) { return texture(uGray, uv).r; }
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

vec3 tone(float l) {
  float k = smoothstep(uSteps.x - uSoft, uSteps.x + uSoft, l)
          + smoothstep(uSteps.y - uSoft, uSteps.y + uSoft, l)
          + smoothstep(uSteps.z - uSoft, uSteps.z + uSoft, l)
          + smoothstep(uSteps.w - uSoft, uSteps.w + uSoft, l);
  int lo = int(floor(k));
  int hi = min(lo + 1, 4);
  return mix(uTones[lo], uTones[hi], fract(k));
}

void main() {
  vec4 g = texture(uGray, vUv);
  float a = g.a;
  // Soft edge pass: Sobel on the luminance, darkens toward the deepest tone.
  vec2 t = uTexel;
  float gx = lum(vUv + vec2(t.x, -t.y)) + 2.0 * lum(vUv + vec2(t.x, 0.0)) + lum(vUv + t)
           - lum(vUv - t) - 2.0 * lum(vUv - vec2(t.x, 0.0)) - lum(vUv + vec2(-t.x, t.y));
  float gy = lum(vUv + vec2(-t.x, t.y)) + 2.0 * lum(vUv + vec2(0.0, t.y)) + lum(vUv + t)
           - lum(vUv - t) - 2.0 * lum(vUv - vec2(0.0, t.y)) - lum(vUv + vec2(t.x, -t.y));
  float edge = smoothstep(0.08, 0.6, length(vec2(gx, gy)) * uEdge);
  vec3 col = mix(tone(g.r), uTones[0], edge * 0.85);

  // Paper rim: the alpha grown by uRim px, outside the figure.
  float ring = 0.0;
  for (int i = 0; i < 12; i++) {
    float ang = float(i) * 0.5235988;
    ring = max(ring, texture(uGray, vUv + vec2(cos(ang), sin(ang)) * uRim * t).a);
  }
  ring *= 1.0 - a;

  // Colour reveal: noise dissolve into the colour cut-out.
  vec4 c = texture(uColor, vUv);
  float n = noise(vUv * 28.0) * 0.7 + noise(vUv * 90.0) * 0.3;
  float r = smoothstep(n - 0.04, n + 0.04, uReveal * 1.08);
  vec3 figure = mix(col, c.rgb, r);

  vec3 rgb = figure * a + uTones[4] * ring;
  outColor = vec4(rgb, a + ring);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

// createPoster(canvas, { gray, color }) -> Promise<{ set(params), reveal(0…1), dispose() }>.
export async function createPoster(canvas, { gray, color }, params = DEFAULT_PARAMS) {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('no webgl2');
  const [grayImage, colorImage] = await Promise.all([loadImage(gray), loadImage(color)]);

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texture = (unit, image) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };
  const textures = [texture(0, grayImage), texture(1, colorImage)];
  const u = (name) => gl.getUniformLocation(program, name);
  gl.uniform1i(u('uGray'), 0);
  gl.uniform1i(u('uColor'), 1);
  gl.uniform3fv(u('uTones'), new Float32Array(TONES.flatMap(hex)));
  gl.uniform2f(u('uTexel'), 1 / grayImage.naturalWidth, 1 / grayImage.naturalHeight);

  canvas.width = grayImage.naturalWidth;
  canvas.height = grayImage.naturalHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  let current = { ...params };
  let reveal = 0;
  const draw = () => {
    gl.uniform4f(u('uSteps'), current.t1, current.t2, current.t3, current.t4);
    gl.uniform1f(u('uSoft'), current.soft);
    gl.uniform1f(u('uEdge'), current.edge);
    // Rim in px of the displayed image, converted to texture px.
    const scale = canvas.width / Math.max(1, canvas.clientWidth);
    gl.uniform1f(u('uRim'), current.rim * scale);
    gl.uniform1f(u('uReveal'), reveal);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  draw();
  // Parameter and reveal changes redraw once per frame.
  let pending = 0;
  const schedule = () => {
    if (!pending) pending = requestAnimationFrame(() => { pending = 0; draw(); });
  };

  return {
    aspect: grayImage.naturalWidth / grayImage.naturalHeight,
    set(next) {
      current = { ...current, ...next };
      schedule();
    },
    reveal(value) {
      reveal = value;
      schedule();
    },
    redraw: draw,
    dispose() {
      cancelAnimationFrame(pending);
      textures.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      // No loseContext(): the canvas is reused when React re-runs the effect (StrictMode, prop change).
    },
  };
}
