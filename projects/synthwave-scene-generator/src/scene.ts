import { mulberry32 } from "./rng";
import { type Palette, lerpSky, type SkyStops } from "./palettes";

export const HORIZON_FRACTION = 0.62;

export interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  riseSpeed: number;
  drift: number;
  phase: number;
}

export interface SceneLayout {
  seed: number;
  stars: Star[];
  particles: Particle[];
  carOffsetX: number;
}

export interface DrawOptions {
  /** Off on the homepage hero (too busy alongside the flowing grid/particles); on everywhere else. */
  showCar?: boolean;
  /** Off on the homepage hero — the gas-station canopy/sign silhouette reads as stray black
   * rectangles once hero text overlaps it. On everywhere else, since it's the generator's actual feature. */
  showStructure?: boolean;
}

export function generateLayout(seed: number, w: number, h: number): SceneLayout {
  const rng = mulberry32(seed);
  const horizonY = h * HORIZON_FRACTION;

  const stars: Star[] = [];
  const starCount = 90;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: rng() * w,
      y: rng() * horizonY * 0.9,
      r: 0.6 + rng() * 1.4,
      phase: rng() * Math.PI * 2,
    });
  }

  const particles: Particle[] = [];
  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: rng() * w,
      y: rng() * h,
      size: 0.8 + rng() * 1.8,
      riseSpeed: 0.006 + rng() * 0.01,
      drift: (rng() - 0.5) * 0.003,
      phase: rng() * Math.PI * 2,
    });
  }

  const carOffsetX = (rng() - 0.5) * 0.3;

  return { seed, stars, particles, carOffsetX };
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, sky: SkyStops): void {
  const horizonY = h * HORIZON_FRACTION;
  const grad = ctx.createLinearGradient(0, 0, 0, horizonY);
  grad.addColorStop(0, sky.top);
  grad.addColorStop(0.55, sky.mid);
  grad.addColorStop(1, sky.horizon);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, horizonY);
}

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number, palette: Palette): void {
  const horizonY = h * HORIZON_FRACTION;
  const grad = ctx.createLinearGradient(0, horizonY, 0, h);
  grad.addColorStop(0, palette.silhouette);
  grad.addColorStop(1, "#000000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, horizonY, w, h - horizonY);
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  starColor: string,
  timeOfDay: number,
  timeMs: number,
): void {
  ctx.save();
  const baseAlpha = 0.15 + 0.7 * timeOfDay;
  ctx.fillStyle = starColor;
  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(timeMs / 600 + s.phase);
    ctx.globalAlpha = baseAlpha * (0.5 + 0.5 * twinkle);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSun(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: Palette,
  sky: SkyStops,
): void {
  const cx = w / 2;
  const cy = h * HORIZON_FRACTION;
  const r = Math.min(w, h) * 0.16;

  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
  grad.addColorStop(0, palette.sunInner);
  grad.addColorStop(1, palette.sunOuter);
  ctx.shadowColor = palette.sunOuter;
  ctx.shadowBlur = r * 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Retro scanline cutout on the lower half of the sun.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = sky.horizon;
  let y = cy - r * 0.1;
  let gap = r * 0.05;
  for (let i = 0; i < 6; i++) {
    const thickness = r * (0.035 + i * 0.018);
    ctx.fillRect(cx - r, y, r * 2, thickness);
    y += thickness + gap;
    gap += r * 0.015;
  }
  ctx.restore();
}

function drawGasStation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: Palette,
): void {
  const baseY = h * HORIZON_FRACTION;
  const cx = w * 0.5;
  const canopyW = w * 0.34;
  const canopyH = h * 0.035;
  const pillarH = h * 0.09;
  const canopyY = baseY - pillarH - canopyH;
  const pillarW = Math.max(2, w * 0.012);

  ctx.save();
  ctx.fillStyle = palette.silhouette;

  const kioskW = w * 0.09;
  const kioskH = h * 0.1;
  ctx.fillRect(cx - canopyW / 2 - kioskW * 0.2, baseY - kioskH, kioskW, kioskH);

  ctx.fillRect(cx - canopyW / 2 + canopyW * 0.15, baseY - pillarH, pillarW, pillarH);
  ctx.fillRect(cx + canopyW / 2 - canopyW * 0.15 - pillarW, baseY - pillarH, pillarW, pillarH);

  ctx.fillRect(cx - canopyW / 2, canopyY, canopyW, canopyH);

  ctx.strokeStyle = palette.glow;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - canopyW / 2, canopyY + canopyH);
  ctx.lineTo(cx + canopyW / 2, canopyY + canopyH);
  ctx.stroke();

  const signPoleH = h * 0.14;
  const poleX = cx + canopyW / 2 + w * 0.03;
  ctx.shadowBlur = 0;
  ctx.fillStyle = palette.silhouette;
  ctx.fillRect(poleX, baseY - signPoleH, Math.max(2, w * 0.006), signPoleH);

  const signW = w * 0.05;
  const signH = h * 0.045;
  const signX = poleX - signW / 2 + w * 0.003;
  const signY = baseY - signPoleH;
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = palette.glow;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = 12;
  ctx.strokeRect(signX, signY, signW, signH);

  ctx.restore();
}

/** Horizontal lines continuously march from the horizon toward the viewer and loop — the "driving forward" illusion. */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: Palette,
  timeMs: number,
): void {
  const horizonY = h * HORIZON_FRACTION;
  const vpX = w / 2;

  ctx.save();
  const pulse = 0.75 + 0.25 * Math.sin(timeMs / 900);
  ctx.strokeStyle = palette.grid;
  ctx.shadowColor = palette.grid;
  ctx.shadowBlur = 8;
  ctx.globalAlpha = pulse;
  ctx.lineWidth = 1.5;

  const hLines = 14;
  const flowCycleMs = 9000;
  const flowOffset = (timeMs % flowCycleMs) / flowCycleMs;
  for (let i = 0; i < hLines; i++) {
    const t = (i / hLines + flowOffset) % 1;
    const y = horizonY + (h - horizonY) * t * t;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const vLines = 12;
  const spread = w * 0.9;
  for (let i = -vLines; i <= vLines; i++) {
    const bottomX = vpX + (spread / vLines) * i;
    ctx.beginPath();
    ctx.moveTo(vpX, horizonY);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  offsetX: number,
  palette: Palette,
): void {
  const carW = w * 0.24;
  const carH = carW * 0.34;
  const cx = w / 2 + offsetX * w;
  const baseY = h * 0.97;

  ctx.save();
  ctx.translate(cx - carW / 2, baseY - carH);

  ctx.fillStyle = palette.silhouette;
  ctx.strokeStyle = palette.glow;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = 6;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, carH * 0.65);
  ctx.lineTo(carW * 0.08, carH * 0.4);
  ctx.lineTo(carW * 0.28, carH * 0.18);
  ctx.lineTo(carW * 0.62, carH * 0.18);
  ctx.lineTo(carW * 0.78, carH * 0.4);
  ctx.lineTo(carW, carH * 0.5);
  ctx.lineTo(carW, carH * 0.75);
  ctx.lineTo(0, carH * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(carW * 0.22, carH * 0.75, carH * 0.16, 0, Math.PI * 2);
  ctx.arc(carW * 0.78, carH * 0.75, carH * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Soft glowing motes drifting upward through the whole scene — drawn last, on top of everything. */
function drawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  palette: Palette,
  timeMs: number,
): void {
  ctx.save();
  ctx.fillStyle = palette.glow;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = 4;
  for (const p of particles) {
    let y = (p.y - timeMs * p.riseSpeed) % h;
    if (y < 0) y += h;
    let x = (p.x + timeMs * p.drift) % w;
    if (x < 0) x += w;

    const twinkle = 0.5 + 0.5 * Math.sin(timeMs / 500 + p.phase);
    ctx.globalAlpha = 0.25 + 0.35 * twinkle;
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layout: SceneLayout,
  palette: Palette,
  timeOfDay: number,
  timeMs: number,
  options: DrawOptions = {},
): void {
  const { showCar = true, showStructure = true } = options;
  const sky = lerpSky(palette, timeOfDay);

  drawSky(ctx, w, h, sky);
  drawGround(ctx, w, h, palette);
  drawStars(ctx, layout.stars, palette.star, timeOfDay, timeMs);
  drawSun(ctx, w, h, palette, sky);
  if (showStructure) drawGasStation(ctx, w, h, palette);
  drawGrid(ctx, w, h, palette, timeMs);
  if (showCar) drawCar(ctx, w, h, layout.carOffsetX, palette);
  drawParticles(ctx, w, h, layout.particles, palette, timeMs);
}
