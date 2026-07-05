import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture, Vec2, Raycast } from 'ogl';

// Floating field of image planes (random photos via Lorem Picsum). A hidden
// grid scaffold guarantees no overlap + in-bounds, but heavy jitter + size
// variation make it read as a random scatter. Nothing shows until the first
// scroll, which blooms every card up from scale 0 in place. Cursor parallax is
// gentle; a hovered card scales up where it sits while the rest darken.

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLACEHOLDER = [0.16, 0.16, 0.18];

const vertex = /* glsl */ `
precision highp float;
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uVelocity;
varying vec2 vUv;
varying float vSheen;
void main() {
  vUv = uv;
  vec3 p = position;
  float curl = sin(uv.x * 3.14159) * uVelocity * 0.04;   // whisper of velocity bend
  p.z += curl;
  p.z += sin(uv.y * 4.0 + uTime) * 0.004;                // faint idle
  vSheen = curl;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform float uHover;
uniform float uDim;
uniform float uStar;          // 1 = far/small, 0 = full photo (drives the dim→bright ramp)
uniform float uMotion;        // 0..1 zoom motion-blur amount (depth smear while moving)
varying vec2 vUv;
varying float vSheen;

const int SAMPLES = 8;

void main() {
  // photo, with a radial (zoom) motion-blur that smears it while it rushes in
  vec3 col;
  if (uMotion > 0.001) {
    vec2 dir = vUv - 0.5;                       // radial = motion along the view axis
    vec3 acc = vec3(0.0);
    for (int s = 0; s < SAMPLES; s++) {
      float k = 1.0 - (float(s) / float(SAMPLES)) * uMotion * 0.9;
      acc += texture2D(uTexture, 0.5 + dir * k).rgb;
    }
    col = acc / float(SAMPLES);
  } else {
    col = texture2D(uTexture, vUv).rgb;
  }

  col += abs(vSheen) * 0.2;
  col *= uDim;                                  // non-hovered recede by darkening
  col += uHover * 0.07;                         // hovered brightens

  // dark while small/far, bright at full scale (rev = 1 - uStar)
  float rev = 1.0 - uStar;
  col *= mix(0.1, 1.0, rev);

  gl_FragColor = vec4(col, 1.0);
}`;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeInPow = (t) => Math.pow(t, 2.4); // slow → fast: rushes in from depth

function colsForWidth(w) {
  if (w >= 1280) return 5;
  if (w >= 960) return 4;
  if (w >= 600) return 3;
  return 2;
}

export function createField(canvas) {
  const renderer = new Renderer({
    canvas, alpha: true, antialias: true,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl, { fov: 35, near: 0.1, far: 100 });
  camera.position.z = 8;
  const scene = new Transform();

  const rng = mulberry32(20260622);
  const POOL = 15; // enough for 5 cols x 3 rows
  const items = [];
  for (let i = 0; i < POOL; i++) {
    const wide = rng() > 0.45;
    const aspect = wide ? 16 / 9 : 1;
    const geometry = new Plane(gl, { width: aspect, height: 1, widthSegments: 16, heightSegments: 16 });
    const texture = new Texture(gl, {
      image: new Uint8Array([PLACEHOLDER[0] * 255, PLACEHOLDER[1] * 255, PLACEHOLDER[2] * 255, 255]),
      width: 1, height: 1, generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE,
    });
    const pw = wide ? 800 : 600, ph = wide ? 450 : 600;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { texture.image = img; };
    img.src = `https://picsum.photos/seed/lcd-${i}-${Math.floor(rng() * 9999)}/${pw}/${ph}`;

    const program = new Program(gl, {
      vertex, fragment, transparent: false, depthTest: true, cullFace: false,
      uniforms: {
        uTime: { value: rng() * 10 }, uVelocity: { value: 0 },
        uHover: { value: 0 }, uDim: { value: 1 }, uStar: { value: 1 }, uMotion: { value: 0 }, uTexture: { value: texture },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
    mesh.scale.set(0, 0, 0);
    items.push({
      mesh, aspect, wide,
      f: 0.46 + rng() * 0.42,          // size fraction of its cell (varied)
      jx: rng() * 2 - 1, jy: rng() * 2 - 1, // jitter within cell
      z: (rng() * 2 - 1) * 0.35,        // small depth
      seed: rng() * 6.28,
      t0: rng() * 0.62, span: 0.22 + rng() * 0.16, // random scroll window to zoom in
      hover: 0, dim: 1, active: false, size: 0, px: 0, py: 0,
    });
  }

  // place the cards into an invisible grid sized to the current viewport
  function layout() {
    const tanHalf = Math.tan((35 * Math.PI) / 180 / 2);
    const H = 2 * camera.position.z * tanHalf;
    const W = H * (window.innerWidth / window.innerHeight);
    const bandX = W * 0.92, bandLeft = -W * 0.46;
    const bandTop = H * 0.40, bandBottom = -H * 0.34; // copy clears out, so fill lower
    const bandY = bandTop - bandBottom;
    const cols = colsForWidth(window.innerWidth);
    const rows = 3;
    const used = Math.min(cols * rows, POOL);
    const cellW = bandX / cols, cellH = bandY / rows;
    for (let i = 0; i < POOL; i++) {
      const it = items[i];
      if (i >= used) { it.active = false; continue; }
      it.active = true;
      const col = i % cols, row = Math.floor(i / cols);
      const cx = bandLeft + (col + 0.5) * cellW;
      const cy = bandTop - (row + 0.5) * cellH;
      const size = Math.min(cellW / it.aspect, cellH) * it.f;
      const freeX = cellW - size * it.aspect;
      const freeY = cellH - size;
      it.size = size;
      it.px = cx + it.jx * (freeX / 2);
      it.py = cy + it.jy * (freeY / 2);
    }
  }

  const meshes = items.map((it) => it.mesh);
  const pointer = { x: 0, y: 0 };
  const pLerp = { x: 0, y: 0 };
  const mouseNDC = new Vec2(0, 0);
  const raycast = new Raycast();

  function onMove(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    pointer.x = x * 2 - 1;
    pointer.y = y * 2 - 1;
    mouseNDC.set(x * 2 - 1, -(y * 2 - 1));
  }
  window.addEventListener('pointermove', onMove);

  let velocity = 0, progress = 0;

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    layout();
  }
  resize();

  function render(t) {
    const time = t * 0.001;

    // gentle parallax
    pLerp.x = lerp(pLerp.x, pointer.x, 0.05);
    pLerp.y = lerp(pLerp.y, pointer.y, 0.05);
    scene.rotation.y = lerp(scene.rotation.y, pLerp.x * 0.05, 0.07);
    scene.rotation.x = lerp(scene.rotation.x, -pLerp.y * 0.035, 0.07);
    scene.position.x = lerp(scene.position.x, pLerp.x * 0.14, 0.06);
    scene.position.y = lerp(scene.position.y, -pLerp.y * 0.1, 0.06);
    scene.updateMatrixWorld();

    velocity *= 0.88;

    // hover pick (stable — cards don't move, scale is centred); only once mostly shown
    let hovered = null;
    if (progress > 0.85) {
      raycast.castMouse(camera, mouseNDC);
      try {
        const hits = raycast.intersectMeshes(meshes.filter((m, i) => items[i].active));
        if (hits.length) hovered = hits[0];
      } catch (e) { /* bounds not ready */ }
    }

    for (const it of items) {
      if (!it.active) { it.mesh.scale.set(0, 0, 0); continue; }
      // each card rushes in from depth (0 → full) within its own scroll window
      const lin = clamp01((progress - it.t0) / it.span);
      const ease = easeInPow(lin);             // slow → fast
      const isH = hovered === it.mesh;
      it.hover = lerp(it.hover, isH ? 1 : 0, 0.16);
      it.dim = lerp(it.dim, hovered ? (isH ? 1 : 0.5) : 1, 0.12);
      const u = it.mesh.program.uniforms;
      u.uHover.value = it.hover;
      u.uDim.value = it.dim;
      u.uStar.value = 1 - ease;                 // drives the dim→bright ramp
      u.uTime.value = time + it.seed;
      u.uVelocity.value = velocity;
      u.uMotion.value = Math.min(1, 5.5 * lin * lin * (1 - lin)); // blur while travelling
      // scale from 0 (invisible) up to full size, + hover scale
      const s = it.size * ease * (1 + it.hover * 0.6);
      it.mesh.scale.set(s, s, s);
      it.mesh.position.set(it.px, it.py, it.z + it.hover * 0.4);
    }
    renderer.render({ scene, camera });
  }

  return {
    render,
    resize,
    setProgress: (v) => { progress = v; },
    addVelocity: (v) => { velocity = Math.max(-1.5, Math.min(1.5, velocity + v)); },
    destroy: () => { window.removeEventListener('pointermove', onMove); },
  };
}
