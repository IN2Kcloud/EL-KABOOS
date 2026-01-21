// === IMPORTS ===
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import gsap from 'https://cdn.skypack.dev/gsap';

// === DOM ELEMENT ===
const canvas = document.getElementById('LPtextCanvas');

// === THREE SETUP ===
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// === UNIFORMS ===
const uniforms = {
  u_time: { value: 0 },
  u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_texture: { value: null },

  u_speed: { value: 0.0 },
  u_turbulenceIntensity: { value: 0.6 },
  u_blackIntensity: { value: 0.85 }
  
};

// === TEXT CANVAS ===
const textCanvas = document.createElement('canvas');
textCanvas.width = 2048;
textCanvas.height = 300;
const ctx = textCanvas.getContext('2d');

let marqueeX = 0;
let marqueeY = .9; // 0 = top, 0.5 = center, 1 = bottom

const marqueeText =
  " • KABOOS • UNLEASHING PURPOSE THROUGH THE VIVID TAPESTRY OF CREATION • TRANSCENDING THE BOUNDARIES OF ARTISTRY";
const fontSize = 400;

ctx.font = `600 ${fontSize}px "Teko", "Berani", "Bebas Neue", sans-serif`;
ctx.fillStyle = "#ffffff"; // WHITE TEXT
ctx.textBaseline = "center";

function drawMarquee() {
  ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

  const textWidth = ctx.measureText(marqueeText).width;
  marqueeX -= uniforms.u_speed.value;
  if (marqueeX <= -textWidth) marqueeX = 0;

  const y = textCanvas.height * marqueeY;

  ctx.fillText(marqueeText, marqueeX, y);
  ctx.fillText(marqueeText, marqueeX + textWidth, y);

  textTexture.needsUpdate = true;
}

const textTexture = new THREE.CanvasTexture(textCanvas);
textTexture.minFilter = THREE.LinearFilter;
textTexture.magFilter = THREE.LinearFilter;
uniforms.u_texture.value = textTexture;

// === SHADERS ===
const vertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_turbulenceIntensity;
uniform float u_blackIntensity;

varying vec2 v_uv;

// Noise
float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i), hash(i+vec2(1,0)), u.x),
    mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x),
    u.y
  );
}

// Rough street turbulence
float grime(vec2 p){
  float g = 0.0;
  float w = 0.6;
  for(int i=0;i<4;i++){
    g += abs(noise(p)) * w;
    p *= 2.3;
    w *= 0.5;
  }
  return g;
}

void main(){
  vec2 uv = v_uv;

  float distortion =
    (grime(uv * 5.0 + u_time * 0.7) - 0.5) *
    0.08 *
    u_turbulenceIntensity;

  float textMask = texture2D(
    u_texture,
    uv + vec2(distortion, 0.0)
  ).r;

  // Horizontal street wipe
  float wipe =
    sin(uv.x * 7.0 + u_time * 1.6) * 0.5 + 0.5;

  // Vertical grime
  float dirt =
    grime(uv * vec2(2.0, 6.0) + u_time * 0.4);

  float blackness =
    smoothstep(0.35, 0.75, wipe + dirt * 0.6) *
    u_blackIntensity;

  vec3 white = vec3(1.0);
  vec3 black = vec3(0.0);

  vec3 col = mix(white, black, blackness);

  // Apply text shape
  col *= textMask;

  // Grit grain
  float grain =
    noise(uv * u_resolution * 0.6 + u_time * 4.0) * 0.06;

  col -= grain * textMask;

  gl_FragColor = vec4(col, textMask);
}
`;

// === MATERIAL / MESH ===
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

// === GSAP ===
gsap.to(uniforms.u_speed, {
  value: 2.2,
  duration: 3,
  ease: "power2.out"
});

gsap.to(uniforms.u_blackIntensity, {
  value: 1.0,
  duration: 1.6,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut"
});

// === LOOP ===
function animate(time) {
  uniforms.u_time.value = time * 0.001;
  drawMarquee();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// === RESIZE ===
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});
