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
/** Seconds the points take to gather into the first shape on arrival. */
const GATHER = 1.4;
/** One ambient star per this many square pixels of field. */
const STAR_AREA = 26000;

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
  /** Where this point rests when it is not part of a shape. */
  hx: number;
  hy: number;
  /** How eagerly it leaves the shape: staggers the release across points. */
  reach: number;
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
  /** Override how far the cursor pushes points. */
  cursorRadius?: number;
  /**
   * Field mode. The canvas fills its own box (a whole band, say) but the
   * shape is drawn inside this element's box. Everything outside the slot is
   * open field: where the points come from on arrival, where they go when
   * released, and where a handful of ambient stars stay.
   */
  shapeSlot?: React.RefObject<HTMLElement | null>;
  /**
   * Controlled mode. Instead of cycling on a timer, hold the shape at this
   * index, and move to another when the number changes. Used where something
   * else decides what the mark should be — the project in focus, say.
   */
  active?: number;
  className?: string;
  ariaLabel?: string;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
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
 * It cycles on a timer rather than on scroll. What scroll does drive, for a
 * canvas inside a pinned Band, is how tightly the points hold the shape: on
 * arrival they gather into it from wherever they were scattered, and as the
 * page slides over the band they let go and drift back out. Scroll back and
 * they re-form. The shape is the same object throughout — it is never faded
 * out and swapped for another.
 */
const ConstellationCanvas: React.FC<Props> = ({
  shapes = SHAPES,
  startAt = 0,
  pointCount,
  linkDistance,
  cursorRadius: cursorRadiusProp,
  shapeSlot,
  active,
  className = '',
  ariaLabel,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The index is read from a ref inside the frame loop, so changing it does
  // not tear the canvas down and rebuild it — the points just get a new
  // place to go. With reduced motion there is no frame loop, so the change
  // asks for one redraw instead.
  const controlled = active !== undefined;
  const activeRef = useRef(active ?? 0);
  const redrawRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    activeRef.current = active ?? 0;
    redrawRef.current?.();
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const linkDist = linkDistance ?? LINK_DIST;
    // A card mark is a fraction of a header one, so the repulsion radius has
    // to shrink with it or a hover scatters the whole shape off the card.
    const cursorRadius =
      cursorRadiusProp ?? (linkDistance ? linkDistance * 2.3 : CURSOR_RADIUS);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Only a mark inside a pinned band gathers and releases. A card mark or
    // a watermark has no band to answer to and simply holds its shape.
    const band = host.closest<HTMLElement>('[data-band]');
    const gathers = !!band && !reduceMotion;

    let points: Point[] = [];
    let stars: Point[] = [];
    let grid: Point[][] = [];
    let cols = 1;
    let rows = 1;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    /** True while a pinned Band has been fully covered by the page above it. */
    let covered = false;
    /** 0 = holding the shape, 1 = fully let go. Driven by the band's scroll. */
    let release = 0;
    let startedAt = 0;
    let built = false;
    const mouse = { x: 0, y: 0, active: false };

    const build = () => {
      // offsetWidth, not the bounding box: the band scales its content as it
      // is covered, and the canvas should be laid out at its true size.
      w = Math.max(1, host.offsetWidth);
      h = Math.max(1, host.offsetHeight);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Where the shape goes: the whole canvas, or the slot inside it.
      let ox = 0;
      let oy = 0;
      let sw = w;
      let sh = h;
      const slot = shapeSlot?.current;
      if (slot) {
        const hostBox = host.getBoundingClientRect();
        const slotBox = slot.getBoundingClientRect();
        const k = hostBox.width / w || 1;
        ox = (slotBox.left - hostBox.left) / k;
        oy = (slotBox.top - hostBox.top) / k;
        sw = Math.max(1, Math.round(slotBox.width / k));
        sh = Math.max(1, Math.round(slotBox.height / k));
      }

      cols = Math.max(1, Math.ceil(w / linkDist));
      rows = Math.max(1, Math.ceil(h / linkDist));
      grid = Array.from({ length: cols * rows }, () => []);

      const count = pointCount ?? (sw < 640 ? 150 : 280);
      const clouds = shapes
        .map((s) => sampleShape(s, sw, sh, count))
        .filter((c) => c.length === count);
      if (clouds.length === 0) {
        points = [];
        stars = [];
        return;
      }

      points = [];
      for (let i = 0; i < count; i++) {
        const targets = clouds.map((c) => ({ x: c[i].x + ox, y: c[i].y + oy }));
        const hx = gathers ? Math.random() * w : targets[0].x;
        const hy = gathers ? Math.random() * h : targets[0].y;
        // The very first build starts scattered, so the mark gathers itself
        // on arrival. A rebuild (a window resize) starts in place: reforming
        // on every pixel of a drag would be noise.
        const startHome = gathers && !built;
        points.push({
          x: startHome ? hx : targets[0].x,
          y: startHome ? hy : targets[0].y,
          vx: 0,
          vy: 0,
          targets,
          hx,
          hy,
          reach: 0.85 + Math.random() * 0.75,
          phase: (i / count) * Math.PI * 2,
        });
      }

      // Ambient stars: only in field mode, only a few, never part of a shape.
      stars = [];
      if (slot && !reduceMotion) {
        const n = Math.round((w * h) / STAR_AREA);
        for (let i = 0; i < n; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          stars.push({
            x,
            y,
            vx: 0,
            vy: 0,
            targets: [],
            hx: x,
            hy: y,
            reach: 1,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      built = true;
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

    const repel = (p: Point) => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < cursorRadius && d > 0.01) {
        const k = 1 - d / cursorRadius;
        p.vx += (dx / d) * k * k * CURSOR_FORCE;
        p.vy += (dy / d) * k * k * CURSOR_FORCE;
      }
    };

    const draw = (time: number) => {
      if (!startedAt) startedAt = time;
      const elapsed = (time - startedAt) / 1000;
      const n = points[0]?.targets.length ?? 1;
      // Controlled: sit on the named shape. The springs below carry the
      // points across when it changes, so there is no separate morph to run.
      const pos = controlled
        ? activeRef.current
        : startAt + (reduceMotion ? 0 : cyclePosition(elapsed, n));

      const floor = Math.floor(pos);
      const i = ((floor % n) + n) % n;
      const f = pos - floor;
      const next = (i + 1) % n;

      // How loosely the points hold the shape right now: wide open on
      // arrival and closing over GATHER seconds, then whatever the band's
      // scroll position says. The larger of the two wins, so scrolling during
      // the arrival does not snap anything.
      const arriving = gathers
        ? 1 - smoothstep(clamp01((elapsed - 0.1) / GATHER))
        : 0;
      const loose = Math.max(arriving, release);

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
        let tx = lerp(a.x, b.x, f);
        let ty = lerp(a.y, b.y, f);

        if (reduceMotion) {
          p.x = tx;
          p.y = ty;
          continue;
        }

        if (loose > 0) {
          const mine = Math.min(1, loose * p.reach);
          tx = lerp(tx, p.hx, mine);
          ty = lerp(ty, p.hy, mine);
        }

        const wobbleX = Math.sin(time * 0.0008 + p.phase) * 3;
        const wobbleY = Math.cos(time * 0.0011 + p.phase * 1.3) * 3;
        p.vx += (tx + wobbleX - p.x) * SPRING;
        p.vy += (ty + wobbleY - p.y) * SPRING;

        if (mouse.active) repel(p);

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Bucket into LINK_DIST cells so linking stays near-linear rather than
      // testing every pair. The buckets are reused between frames.
      for (const cell of grid) cell.length = 0;
      for (const p of points) {
        const gx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / linkDist)));
        const gy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / linkDist)));
        grid[gy * cols + gx].push(p);
      }

      ctx.lineWidth = 0.6;
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
          for (let a = 0; a < cell.length; a++) {
            for (let c = a + 1; c < cell.length; c++) link(cell[a], cell[c]);
            // Right, below-left, below, below-right: each pair is met once.
            if (gx + 1 < cols) {
              for (const q of grid[gy * cols + gx + 1]) link(cell[a], q);
            }
            if (gy + 1 < rows) {
              if (gx > 0) {
                for (const q of grid[(gy + 1) * cols + gx - 1]) link(cell[a], q);
              }
              for (const q of grid[(gy + 1) * cols + gx]) link(cell[a], q);
              if (gx + 1 < cols) {
                for (const q of grid[(gy + 1) * cols + gx + 1]) link(cell[a], q);
              }
            }
          }
        }
      }

      // Released points thin out a little so the field reads as distance.
      ctx.fillStyle = `rgba(${stroke},${1 - 0.45 * loose})`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }

      if (stars.length > 0) {
        ctx.fillStyle = `rgba(${stroke},0.34)`;
        for (const s of stars) {
          const driftX = Math.sin(time * 0.00035 + s.phase) * 7;
          const driftY = Math.cos(time * 0.00042 + s.phase * 1.7) * 7;
          s.vx += (s.hx + driftX - s.x) * SPRING;
          s.vy += (s.hy + driftY - s.y) * SPRING;
          if (mouse.active) repel(s);
          s.vx *= DAMPING;
          s.vy *= DAMPING;
          s.x += s.vx;
          s.y += s.vy;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const frame = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || reduceMotion || covered) return;
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
    redrawRef.current = reduceMotion ? () => draw(0) : null;

    const onMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      const rect = canvas.getBoundingClientRect();
      const k = rect.width / w || 1;
      mouse.x = (e.clientX - rect.left) / k;
      mouse.y = (e.clientY - rect.top) / k;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const rebuild = () => {
      build();
      if (reduceMotion) draw(0);
    };
    const ro = new ResizeObserver(rebuild);
    ro.observe(host);
    // In field mode the slot can move without the host changing size (late
    // web fonts reflowing the text beside it), so re-measure once they land.
    if (shapeSlot) void document.fonts?.ready.then(rebuild);

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

    // Listen on the nearest scope rather than the canvas when there is one.
    // A project card is covered by its stretched link, and the hero's field
    // sits behind its text, so the canvas itself never sees the pointer; the
    // scope does, and the coordinates are still measured against the canvas.
    const pointerTarget: HTMLElement =
      host.closest<HTMLElement>('[data-constellation-scope]') ?? canvas;

    // A band that has pinned and been covered still counts as on screen to
    // the IntersectionObserver above, so the band says when it is hidden —
    // and, on the way there, how far the page has slid over it.
    const onBandCover = (e: Event) => {
      covered = (e as CustomEvent<boolean>).detail;
      if (covered) stop();
      else if (visible && !document.hidden) start();
    };
    const onBandProgress = (e: Event) => {
      // Fully let go by the time the band is four-fifths covered: the last
      // stretch is mostly hidden anyway. Squared, so the shape holds while
      // the page has only just started to move and gives way progressively
      // after — a linear release had the mark illegible within 80px of
      // scroll, which on a phone is before anyone has looked at it.
      const t = clamp01((e as CustomEvent<number>).detail / 0.8);
      release = t * t;
    };
    band?.addEventListener('bandcover', onBandCover);
    band?.addEventListener('bandprogress', onBandProgress);

    pointerTarget.addEventListener('pointermove', onMove);
    pointerTarget.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      redrawRef.current = null;
      ro.disconnect();
      io.disconnect();
      band?.removeEventListener('bandcover', onBandCover);
      band?.removeEventListener('bandprogress', onBandProgress);
      pointerTarget.removeEventListener('pointermove', onMove);
      pointerTarget.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [shapes, startAt, pointCount, linkDistance, cursorRadiusProp, shapeSlot, controlled]);

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
