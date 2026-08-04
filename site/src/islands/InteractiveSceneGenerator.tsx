import { useEffect, useRef, useState } from "react";
import { generateLayout, drawScene, type SceneLayout } from "../lib/scene/scene";
import { palettes, getPalette } from "../lib/scene/palettes";
import { randomSeed } from "../lib/scene/rng";

export default function InteractiveSceneGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<SceneLayout | null>(null);
  const [paletteId, setPaletteId] = useState(palettes[0].id);
  const [timeOfDay, setTimeOfDay] = useState(0.3);
  const [seed, setSeed] = useState(() => randomSeed());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        layoutRef.current = generateLayout(seed, w, h);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame: number;
    function render(timeMs: number) {
      if (!layoutRef.current) return;
      drawScene(ctx!, canvas!.width, canvas!.height, layoutRef.current, getPalette(paletteId), timeOfDay, timeMs);
      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [paletteId, timeOfDay, seed]);

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `synthwave-scene-${seed}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Generated synthwave sunset scene"
        className="aspect-[16/10] w-full rounded-lg border border-white/10"
      />
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex gap-2">
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPaletteId(p.id)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                paletteId === p.id ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
          <span>Dusk</span>
          <input
            type="range"
            min={0}
            max={100}
            value={timeOfDay * 100}
            onChange={(e) => setTimeOfDay(Number(e.currentTarget.value) / 100)}
          />
          <span>Night</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSeed(randomSeed())}
            className="rounded-md border border-[var(--accent-2)] px-3 py-1.5 text-sm"
          >
            Randomize
          </button>
          <button onClick={handleSave} className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm">
            Save as PNG
          </button>
        </div>
      </div>
    </div>
  );
}
