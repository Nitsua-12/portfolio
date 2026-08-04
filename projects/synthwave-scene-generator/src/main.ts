import "./style.css";
import { palettes, getPalette } from "./palettes";
import { generateLayout, drawScene, type SceneLayout } from "./scene";
import { randomSeed } from "./rng";

const canvas = document.querySelector<HTMLCanvasElement>("#scene")!;
const ctx = canvas.getContext("2d")!;
const timeSlider = document.querySelector<HTMLInputElement>("#time-slider")!;
const randomizeBtn = document.querySelector<HTMLButtonElement>("#randomize-btn")!;
const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn")!;
const paletteButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".palette-btn"));

let paletteId = palettes[0].id;
let timeOfDay = Number(timeSlider.value) / 100;
let seed = randomSeed();
let layout: SceneLayout = generateLayout(seed, 1, 1);

function resizeCanvas(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    layout = generateLayout(seed, w, h);
  }
}

function setPalette(id: string): void {
  paletteId = id;
  for (const btn of paletteButtons) {
    btn.setAttribute("aria-pressed", String(btn.dataset.palette === id));
  }
}

paletteButtons.forEach((btn) => {
  btn.addEventListener("click", () => setPalette(btn.dataset.palette!));
});

timeSlider.addEventListener("input", () => {
  timeOfDay = Number(timeSlider.value) / 100;
});

randomizeBtn.addEventListener("click", () => {
  seed = randomSeed();
  layout = generateLayout(seed, canvas.width, canvas.height);
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `synthwave-scene-${seed}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

new ResizeObserver(resizeCanvas).observe(canvas);
resizeCanvas();

function render(timeMs: number): void {
  const palette = getPalette(paletteId);
  drawScene(ctx, canvas.width, canvas.height, layout, palette, timeOfDay, timeMs);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
