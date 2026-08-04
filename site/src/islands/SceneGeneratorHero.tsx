import { useEffect, useRef } from "react";
import { generateLayout, drawScene, type SceneLayout } from "../lib/scene/scene";
import { getPalette } from "../lib/scene/palettes";
import { randomSeed } from "../lib/scene/rng";

const PALETTE = getPalette("miami-nights");

export default function SceneGeneratorHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<SceneLayout | null>(null);

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
        layoutRef.current = generateLayout(randomSeed(), w, h);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame: number;

    function render(timeMs: number) {
      if (!layoutRef.current) return;
      // Slow dusk-to-night drift instead of a static frame — the hero's one
      // piece of ambient motion, distinct from the fully interactive project page.
      const timeOfDay = 0.25 + 0.2 * (0.5 + 0.5 * Math.sin(timeMs / 20000));
      drawScene(ctx!, canvas!.width, canvas!.height, layoutRef.current, PALETTE, timeOfDay, timeMs);
      frame = requestAnimationFrame(render);
    }

    if (prefersReducedMotion) {
      drawScene(ctx, canvas.width, canvas.height, layoutRef.current!, PALETTE, 0.35, 0);
    } else {
      frame = requestAnimationFrame(render);
    }

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Animated synthwave sunset scene, generated procedurally"
      className="h-full w-full"
    />
  );
}
