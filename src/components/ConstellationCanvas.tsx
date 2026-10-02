import React, { useEffect, useRef } from 'react';
import { SHAPES, type ShapePainter } from '../lib/shapes';

const LINK_DIST = 52;
const CURSOR_RADIUS = 120;
const CURSOR_FORCE = 3.8;
const SPRING = 0.055;
const DAMPING = 0.82;

/** Accent stops the cloud travels through as progress goes 0 to 1. */
const PALETTE = ['#60a5fa', '#22d3ee', '#a78bfa'];

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
  /** 0 to 1. Drives both the shape morph and the colour ramp. */
  progress: number;
  shapes?: ShapePainter[];
  className?: string;
  /** Decorative by default; pass a label to expose it to assistive tech. */
  ariaLabel?: string;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Walks the palette with the same segment maths used for the shape morph. */
function paletteAt(progress: number) {
  const seg = progress * (PALETTE.length - 1);
  const i = Math.min(Math.floor(seg), PALETTE.length - 2);
  const t = smoothstep(seg - i);
  const a = hexToRgb(PALETTE[i]);
  const b = hexToRgb(PALETTE[i + 1]);
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

/**
 * Rasterises a shape offscreen, then keeps every pixel that survived the alpha
 * cutoff. Sorting the survivors by angle around the centroid means index i
 * sits at a comparable angular position in every shape, so morphing between
 * two clouds reads as a swirl rather than a scramble.
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

const ConstellationCanvas: React.FC<Props> = ({
  progress,
  shapes = SHAPES,
  className = '',
  ariaLabel,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Read inside the rAF loop so prop changes never restart it. */
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let points: Point[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
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

      const count = w < 640 ? 140 : 280;
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

    /** Resolves a point target for the current morph position. */
    const targetFor = (p: Point, t: number) => {
      const n = p.targets.length;
      if (n === 1) return p.targets[0];
      const seg = t * (n - 1);
      const i = Math.min(Math.floor(seg), n - 2);
      const f = smoothstep(seg - i);
      return {
        x: lerp(p.targets[i].x, p.targets[i + 1].x, f),
        y: lerp(p.targets[i].y, p.targets[i + 1].y, f),
      };
    };

    const link = (a: Point, b: Point, stroke: string) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > LINK_DIST * LINK_DIST) return;
      const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.6;
      ctx.strokeStyle = `rgba(${stroke},${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const draw = (time: number) => {
      const t = Math.min(1, Math.max(0, progressRef.current));
      const { r, g, b } = paletteAt(t);
      const stroke = `${r},${g},${b}`;

      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        const target = targetFor(p, t);
        if (reduceMotion) {
          p.x = target.x;
          p.y = target.y;
          continue;
        }

        const wobbleX = Math.sin(time * 0.0008 + p.phase) * 3;
        const wobbleY = Math.cos(time * 0.0011 + p.phase * 1.3) * 3;
        p.vx += (target.x + wobbleX - p.x) * SPRING;
        p.vy += (target.y + wobbleY - p.y) * SPRING;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS && d > 0.01) {
            const f = 1 - d / CURSOR_RADIUS;
            p.vx += (dx / d) * f * f * CURSOR_FORCE;
            p.vy += (dy / d) * f * f * CURSOR_FORCE;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Bucket into LINK_DIST-sized cells so linking stays near-linear
      // instead of testing every pair.
      const cols = Math.max(1, Math.ceil(w / LINK_DIST));
      const rows = Math.max(1, Math.ceil(h / LINK_DIST));
      const grid: Point[][] = Array.from({ length: cols * rows }, () => []);
      for (const p of points) {
        const gx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / LINK_DIST)));
        const gy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / LINK_DIST)));
        grid[gy * cols + gx].push(p);
      }

      ctx.lineWidth = 0.6;
      // Forward neighbours only, so each pair is visited exactly once.
      const neighbours = [
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
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

          for (let i = 0; i < cell.length; i++) {
            for (let j = i + 1; j < cell.length; j++) {
              link(cell[i], cell[j], stroke);
            }
            for (const q of partners) link(cell[i], q, stroke);
          }
        }
      }

      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${stroke},1)`;
      ctx.fillStyle = `rgba(${stroke},1)`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
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

    // Stop burning frames once the hero scrolls away or the tab is hidden.
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
  }, [shapes]);

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
