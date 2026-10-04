import React, { useEffect, useRef } from 'react';
import { SHAPES, type ShapePainter } from '../lib/constellationShapes';

const LINK_DIST = 52;
const CURSOR_RADIUS = 120;
const CURSOR_FORCE = 3.8;
const SPRING = 0.055;
const DAMPING = 0.82;

/** Seconds a shape is held before morphing to the next. */
const HOLD = 3.4;
/** Seconds the morph itself takes. */
const MORPH = 1.6;

/**
 * Brass only. The palette gives brass the single accent, so the shape does
 * the work and the colour merely breathes between two brass stops.
 */
const PALETTE = ['#B98A3C', '#CCA35C'];

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** One target per shape, same index across shapes so morphs map 1:1. */
  targets: Array<{ x: number; y: number }>;
  phase: number;
}

interface Props {
  shapes?: ShapePainter[];
  /**
   * Which shape the cycle opens on. The same mark appears on every interior
   * page, so offsetting the start stops them all showing an identical frame.
   */
  startAt?: number;
  /**
   * Override the point budget. A card-sized mark needs far fewer than a
   * header one, or it samples into a solid blob.
   */
  pointCount?: number;
  /** Override the link radius, which has to shrink with the point count. */
  linkDistance?: number;
  className?: string;
  ariaLabel?: string;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * Rasterises a shape offscreen and keeps every pixel above the alpha cutoff.
 * Sorting survivors by angle around the centroid means index i sits at a
 * comparable angular position in every shape, so a morph reads as a swirl
 * rather than a scramble.
 */
function sampleShape(
  paint: ShapePainter,
  w: number,
  h: number,
  count: number,
): Array<{ x: number; y: number }> {
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.clearRect(0, 0, w, h);
  paint(ctx, w, h);

  const data = ctx.getImageData(0, 0, w, h).data;
  const cands: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 100) cands.push({ x, y });
    }
  }
  if (cands.length === 0) return [];

  let cx = 0;
  let cy = 0;
  for (const p of cands) {
    cx += p.x;
    cy += p.y;
  }
  cx /= cands.length;
  cy /= cands.length;
  cands.sort(
    (a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx),
  );

  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    out.push(cands[Math.floor((i * cands.length) / count)]);
  }
  return out;
}

/**
 * A point cloud that settles into a shape, holds, then morphs to the next,
 * and scatters away from the cursor.
 *
 * It cycles on a timer rather than on scroll. The projects header is a short
 * band, so a scroll-driven morph would leave the viewport long before it
 * finished and would effectively never be seen.
 */
const ConstellationCanvas: React.FC<Props> = ({
  shapes = SHAPES,
  startAt = 0,
  pointCount,
  linkDistance,
  className = '',
  ariaLabel,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const linkDist = linkDistance ?? LINK_DIST;
    // A card mark is a fraction of a header one, so the repulsion radius has
    // to shrink with it or a hover scatters the whole shape off the card.
    const cursorRadius = linkDistance ? linkDistance * 2.3 : CURSOR_RADIUS;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let points: Point[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let startedAt = 0;
    const mouse = { x: 0, y: 0, active: false };

    const build = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = pointCount ?? (w < 640 ? 150 : 280);
      const clouds = shapes
        .map((s) => sampleShape(s, w, h, count))
        .filter((c) => c.length === count);
      if (clouds.length === 0) {
        points = [];
        return;
      }

      points = [];
      for (let i = 0; i < count; i++) {
        const seed = clouds[0][i];
        points.push({
          x: seed.x,
          y: seed.y,
          vx: 0,
          vy: 0,
          targets: clouds.map((c) => c[i]),
          phase: (i / count) * Math.PI * 2,
        });
      }
    };

    /** Position in the hold-then-morph cycle, as a float shape index. */
    const cyclePosition = (elapsedSec: number, n: number) => {
      if (n <= 1) return 0;
      const step = HOLD + MORPH;
      const total = step * n;
      const t = ((elapsedSec % total) + total) % total;
      const index = Math.floor(t / step);
      const within = t - index * step;
      const frac = within <= HOLD ? 0 : smoothstep((within - HOLD) / MORPH);
      return index + frac;
    };

    const draw = (time: number) => {
      if (!startedAt) startedAt = time;
      const elapsed = (time - startedAt) / 1000;
      const n = points[0]?.targets.length ?? 1;
      const pos = startAt + (reduceMotion ? 0 : cyclePosition(elapsed, n));

      const floor = Math.floor(pos);
      const i = ((floor % n) + n) % n;
      const f = pos - floor;
      const next = (i + 1) % n;

      const c0 = hexToRgb(PALETTE[0]);
      const c1 = hexToRgb(PALETTE[1]);
      const breathe = reduceMotion ? 0 : (Math.sin(elapsed * 0.6) + 1) / 2;
      const stroke = `${Math.round(lerp(c0.r, c1.r, breathe))},${Math.round(
        lerp(c0.g, c1.g, breathe),
      )},${Math.round(lerp(c0.b, c1.b, breathe))}`;

      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        const a = p.targets[i];
        const b = p.targets[next];
        const tx = lerp(a.x, b.x, f);
        const ty = lerp(a.y, b.y, f);

        if (reduceMotion) {
          p.x = tx;
          p.y = ty;
          continue;
        }

        const wobbleX = Math.sin(time * 0.0008 + p.phase) * 3;
        const wobbleY = Math.cos(time * 0.0011 + p.phase * 1.3) * 3;
        p.vx += (tx + wobbleX - p.x) * SPRING;
        p.vy += (ty + wobbleY - p.y) * SPRING;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < cursorRadius && d > 0.01) {
            const k = 1 - d / cursorRadius;
            p.vx += (dx / d) * k * k * CURSOR_FORCE;
            p.vy += (dy / d) * k * k * CURSOR_FORCE;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Bucket into LINK_DIST cells so linking stays near-linear rather than
      // testing every pair.
      const cols = Math.max(1, Math.ceil(w / linkDist));
      const rows = Math.max(1, Math.ceil(h / linkDist));
      const grid: Point[][] = Array.from({ length: cols * rows }, () => []);
      for (const p of points) {
        const gx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / linkDist)));
        const gy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / linkDist)));
        grid[gy * cols + gx].push(p);
      }

      ctx.lineWidth = 0.6;
      const neighbours = [
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      const link = (a: Point, b: Point) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkDist * linkDist) return;
        const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.55;
        ctx.strokeStyle = `rgba(${stroke},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      };

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const cell = grid[gy * cols + gx];
          if (cell.length === 0) continue;
          const partners: Point[] = [];
          for (const [ox, oy] of neighbours) {
            const nx = gx + ox;
            const ny = gy + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            partners.push(...grid[ny * cols + nx]);
          }
          for (let a = 0; a < cell.length; a++) {
            for (let c = a + 1; c < cell.length; c++) link(cell[a], cell[c]);
            for (const q of partners) link(cell[a], q);
          }
        }
      }

      ctx.fillStyle = `rgba(${stroke},1)`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || reduceMotion) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    build();
    if (reduceMotion) draw(0);
    else start();

    const onMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const ro = new ResizeObserver(() => {
      build();
      if (reduceMotion) draw(0);
    });
    ro.observe(host);

    // Stop burning frames once it scrolls away or the tab is hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [shapes, startAt, pointCount, linkDistance]);

  return (
    <div ref={hostRef} className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden={ariaLabel ? undefined : true}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        className="block h-full w-full"
      />
    </div>
  );
};

export default ConstellationCanvas;
