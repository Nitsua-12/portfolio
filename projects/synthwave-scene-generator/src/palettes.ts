export interface SkyStops {
  top: string;
  mid: string;
  horizon: string;
}

export interface Palette {
  id: string;
  label: string;
  skyDusk: SkyStops;
  skyNight: SkyStops;
  sunInner: string;
  sunOuter: string;
  grid: string;
  glow: string;
  silhouette: string;
  star: string;
}

export const palettes: Palette[] = [
  {
    id: "miami-nights",
    label: "Miami Nights",
    skyDusk: { top: "#1b1035", mid: "#ff2e88", horizon: "#ffb347" },
    skyNight: { top: "#05010f", mid: "#3a0ca3", horizon: "#ff2e88" },
    sunInner: "#fff275",
    sunOuter: "#ff2e88",
    grid: "#00e5ff",
    glow: "#ff2e88",
    silhouette: "#0d0117",
    star: "#ffffff",
  },
  {
    id: "dusk-ember",
    label: "Dusk Ember",
    skyDusk: { top: "#2a1130", mid: "#d1495b", horizon: "#ffb703" },
    skyNight: { top: "#0b0512", mid: "#4a1942", horizon: "#e85d04" },
    sunInner: "#ffe8a3",
    sunOuter: "#ff6d00",
    grid: "#21e6c1",
    glow: "#ff6d00",
    silhouette: "#170b12",
    star: "#ffe8a3",
  },
  {
    id: "neon-grave",
    label: "Neon Grave",
    skyDusk: { top: "#0d021a", mid: "#4b0082", horizon: "#00ff9c" },
    skyNight: { top: "#030014", mid: "#23004d", horizon: "#00c853" },
    sunInner: "#d1ffbd",
    sunOuter: "#00ff9c",
    grid: "#b967ff",
    glow: "#00ff9c",
    silhouette: "#060010",
    star: "#d1ffbd",
  },
];

export function getPalette(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Blends two hex colors; t=0 -> a, t=1 -> b. */
export function lerpColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const bl = Math.round(lerp(b1, b2, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

export function lerpSky(palette: Palette, timeOfDay: number): SkyStops {
  return {
    top: lerpColor(palette.skyDusk.top, palette.skyNight.top, timeOfDay),
    mid: lerpColor(palette.skyDusk.mid, palette.skyNight.mid, timeOfDay),
    horizon: lerpColor(palette.skyDusk.horizon, palette.skyNight.horizon, timeOfDay),
  };
}
