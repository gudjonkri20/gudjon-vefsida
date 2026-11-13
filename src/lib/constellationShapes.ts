/**
 * Shape painters for the projects-page constellation.
 *
 * Each painter strokes a silhouette into an offscreen context. The canvas
 * rasterises it, samples the surviving pixels into a point cloud, and draws
 * links between near neighbours — so these only need a recognisable outline.
 *
 * Outlines are stroked, never filled: a filled glyph samples into a solid
 * blob, while an outline leaves the interior open for the link lines.
 *
 * The three shapes are the work, in order: a brain, a feed-forward network,
 * and the speech waveform that is already the site's signature mark.
 */

export type ShapePainter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => void;

/** Fits a 0-100 normalised design box into the canvas, preserving aspect. */
function fit(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const size = Math.min(w, h) * 0.8;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate((w - size) / 2, (h - size) / 2);
  ctx.scale(size / 100, size / 100);
}

function stroke(ctx: CanvasRenderingContext2D, width: number) {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

/** Brain silhouette with cortical folds and a stem. */
export const brain: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 2.2);

  ctx.stroke(
    new Path2D(
      'M50 8 C68 8 82 17 84 31 C93 37 93 52 84 59 C84 72 72 83 56 83 ' +
        'C50 89 38 89 32 83 C18 81 8 69 10 55 C1 47 3 32 14 27 ' +
        'C18 13 32 8 50 8 Z',
    ),
  );

  // Without the folds the outline alone reads as a blob.
  ctx.lineWidth = 1.9;
  for (const d of [
    'M50 10 C51 30 49 52 48 82',
    'M26 25 C37 31 35 44 26 49',
    'M65 23 C56 32 61 44 71 46',
    'M30 57 C41 60 45 68 41 79',
    'M63 59 C57 65 59 72 65 75',
    'M16 40 C24 41 28 36 27 31',
    'M78 38 C71 40 68 35 70 30',
  ]) {
    ctx.stroke(new Path2D(d));
  }

  ctx.lineWidth = 2.2;
  ctx.stroke(new Path2D('M44 83 C44 90 48 94 54 95'));
};

/**
 * Feed-forward network. Each node reaches only its two nearest neighbours in
 * the next layer: a fully connected mesh contributes so many pixels that the
 * sampling buries the nodes and the cloud reads as noise.
 */
export const network: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 0.9);

  const layers = [4, 5, 4];
  const xs = [14, 50, 86];
  const nodes = layers.map((count, li) =>
    Array.from({ length: count }, (_, i) => ({
      x: xs[li],
      y: 15 + i * (70 / (count - 1)),
    })),
  );

  for (let li = 0; li < nodes.length - 1; li++) {
    for (const a of nodes[li]) {
      const nearest = [...nodes[li + 1]]
        .sort((p, q) => Math.abs(p.y - a.y) - Math.abs(q.y - a.y))
        .slice(0, 2);
      for (const b of nearest) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Heavy rings so the nodes dominate the sample and stay legible.
  ctx.lineWidth = 4;
  for (const layer of nodes) {
    for (const n of layer) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
};

/**
 * The speech waveform, rebuilt from the same five-syllable envelope as
 * Waveform.tsx — one burst per syllable of "Guð-jón Krist-jáns-son", weighted
 * for Icelandic first-syllable stress, from a fixed seed.
 *
 * Reusing the signature here is the point: the cloud resolves into the mark
 * the rest of the site already carries.
 */
export const waveform: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 1.6);

  const SYLLABLES = [
    { at: 0.09, stress: 1.0 },
    { at: 0.25, stress: 0.72 },
    { at: 0.5, stress: 0.95 },
    { at: 0.68, stress: 0.66 },
    { at: 0.85, stress: 0.44 },
  ];
  const SIGMA = 0.032;
  const SAMPLES = 320;

  /** Deterministic pseudo-noise in [-1, 1]. Same input, same output. */
  const noise = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };

  ctx.beginPath();
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1);
    let envelope = 0;
    for (const s of SYLLABLES) {
      envelope += s.stress * Math.exp(-((t - s.at) ** 2) / (2 * SIGMA * SIGMA));
    }
    const amp = Math.min(1, envelope) * 34 * noise(i);
    const x = t * 100;
    const y = 50 + amp;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
};

/** The initials, stroked so they sample as an outline rather than a blob. */
export const initials: ShapePainter = (ctx, w, h) => {
  const size = Math.min(w, h) * 0.64;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 ${size}px "Familjen Grotesk Variable", Familjen Grotesk, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  stroke(ctx, 3.2);
  ctx.strokeText('GK', w / 2, h / 2);
};

/**
 * Iceland.
 *
 * The real coastline: Natural Earth's 1:50m outline (public domain), 453
 * points simplified to 196 with Douglas-Peucker. The Westfjords, Snæfellsnes,
 * Reykjanes, Langanes and the eastern fjords are where they actually are.
 *
 * Longitude is scaled by cos(65°) before fitting. A degree of longitude at
 * Iceland's latitude is only 42% as long as a degree of latitude, so plotted
 * raw — or squeezed into a square, as the 22-point version this replaces was
 * — the island comes out far too tall. It is 1.48 times as wide as it is
 * high: in the 0-100 design box it spans the full width and ICELAND_HEIGHT of
 * the height, centred.
 *
 *   x = (lon + 24.475) * cos(65°) * 21.67      y = (66.526 - lat) * 21.67 + 16.2
 */
const ICELAND_HEIGHT = 67.6;

const ICELAND: Array<[number, number]> = [
  [81.8, 22.6], [84.6, 22.0], [88.1, 19.3], [90.5, 19.3], [87.6, 21.4], [85.7, 24.9], [86.7, 26.3],
  [87.7, 26.8], [88.7, 26.3], [89.5, 27.1], [89.6, 29.8], [88.4, 32.7], [92.4, 32.2], [93.0, 34.4],
  [91.6, 36.8], [94.4, 35.3], [96.5, 35.9], [97.9, 37.7], [98.9, 37.4], [99.4, 38.0], [99.0, 40.6],
  [97.7, 41.6], [98.5, 42.9], [99.1, 43.0], [99.1, 44.2], [98.2, 45.1], [99.8, 46.2], [99.9, 47.8],
  [99.1, 48.9], [97.3, 49.4], [97.3, 52.2], [95.5, 54.9], [94.7, 55.4], [92.4, 54.8], [92.5, 56.3],
  [91.7, 57.2], [92.0, 59.3], [90.2, 61.9], [86.6, 64.5], [84.4, 64.5], [79.2, 67.1], [77.1, 68.5],
  [71.7, 73.9], [61.0, 77.1], [60.1, 78.8], [60.4, 79.8], [59.8, 81.0], [58.6, 81.8], [57.0, 81.1],
  [57.3, 82.4], [53.3, 83.8], [47.8, 83.0], [43.0, 81.0], [39.2, 80.6], [36.5, 77.7], [36.7, 76.4],
  [37.7, 76.0], [37.2, 75.1], [35.5, 76.7], [35.0, 76.6], [34.3, 75.4], [32.9, 75.2], [30.6, 73.4],
  [31.0, 72.4], [30.4, 72.1], [27.7, 74.0], [16.7, 74.7], [15.9, 70.5], [16.3, 69.1], [18.0, 71.1],
  [22.2, 69.4], [25.7, 63.4], [27.6, 62.7], [25.9, 62.3], [23.1, 64.1], [22.2, 64.1], [23.6, 62.4],
  [22.7, 62.0], [23.1, 59.8], [26.4, 57.4], [25.7, 56.9], [23.3, 58.7], [21.2, 59.3], [19.7, 57.4],
  [20.4, 55.2], [18.4, 53.7], [10.3, 53.1], [6.0, 54.9], [5.0, 54.1], [4.1, 52.2], [5.0, 51.1],
  [7.2, 51.1], [10.3, 50.3], [11.7, 49.2], [12.5, 50.0], [15.5, 48.3], [17.2, 48.7], [23.6, 48.2],
  [24.5, 47.0], [24.7, 45.2], [22.3, 46.6], [19.0, 45.8], [18.0, 45.0], [19.8, 42.9], [23.5, 40.6],
  [24.1, 39.6], [22.6, 38.6], [19.8, 38.8], [19.1, 37.7], [16.8, 37.0], [15.2, 37.4], [14.4, 36.7],
  [5.3, 40.4], [2.3, 38.7], [0.2, 38.4], [0.0, 37.9], [1.2, 36.2], [2.1, 35.9], [5.7, 37.6],
  [4.3, 35.9], [3.5, 32.5], [5.2, 32.7], [7.9, 34.6], [10.9, 33.0], [7.1, 32.3], [5.9, 30.9],
  [6.7, 30.1], [8.7, 30.2], [6.4, 27.2], [6.8, 26.1], [9.5, 27.1], [8.0, 25.2], [9.4, 23.7],
  [10.7, 24.0], [12.9, 25.7], [13.3, 28.0], [15.2, 28.0], [16.1, 26.8], [16.6, 27.0], [17.0, 30.5],
  [17.6, 29.6], [18.6, 29.6], [18.6, 26.1], [15.3, 24.3], [14.0, 23.0], [14.8, 22.1], [18.2, 21.8],
  [16.7, 21.1], [16.4, 20.3], [12.4, 20.3], [14.0, 18.3], [18.8, 18.3], [28.1, 27.0], [27.1, 28.3],
  [29.0, 29.9], [28.4, 33.2], [27.6, 34.1], [25.8, 33.6], [27.6, 35.5], [27.7, 36.6], [28.5, 36.7],
  [27.9, 39.0], [29.7, 40.2], [30.6, 43.5], [32.4, 37.0], [33.6, 35.5], [34.8, 34.9], [36.0, 36.7],
  [36.8, 36.9], [37.7, 33.7], [37.7, 26.9], [39.1, 25.4], [40.8, 26.5], [44.2, 31.9], [45.7, 32.6],
  [46.2, 31.6], [46.0, 27.9], [46.6, 25.9], [51.6, 23.6], [56.8, 30.1], [58.0, 33.4], [58.4, 31.3],
  [56.4, 25.6], [56.6, 24.2], [60.1, 24.5], [63.4, 28.4], [67.1, 23.2], [69.9, 24.9], [73.2, 23.3],
  [73.7, 21.6], [72.7, 17.9], [73.1, 17.2], [75.3, 16.3], [77.7, 16.5], [80.3, 19.8], [80.3, 21.4],
];

export const iceland: ShapePainter = (ctx, w, h) => {
  // Fitted to its own proportions, not to a square: in a wide, short canvas
  // (the hero mark on a phone) a square fit left it half the size it could be.
  const scale = Math.min((w * 0.86) / 100, (h * 0.86) / ICELAND_HEIGHT);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate((w - 100 * scale) / 2, (h - 100 * scale) / 2);
  ctx.scale(scale, scale);
  // A thin stroke. The points are sampled from wherever the stroke lands, so
  // a heavy line turns a coastline into a band and the fjords close up.
  stroke(ctx, 1.4);

  ctx.beginPath();
  ICELAND.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
};

/* ---------------------------------------------------------------------- *
 * Small marks, one per project category. Drawn simply: on a card these are
 * sampled down to a few dozen points, so detail would only turn to mush.
 * ---------------------------------------------------------------------- */

/** Speech bubble — conversational work. */
export const bubble: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 3);
  ctx.beginPath();
  ctx.moveTo(18, 22);
  ctx.lineTo(82, 22);
  ctx.quadraticCurveTo(90, 22, 90, 32);
  ctx.lineTo(90, 62);
  ctx.quadraticCurveTo(90, 72, 82, 72);
  ctx.lineTo(44, 72);
  ctx.lineTo(28, 88);
  ctx.lineTo(30, 72);
  ctx.lineTo(18, 72);
  ctx.quadraticCurveTo(10, 72, 10, 62);
  ctx.lineTo(10, 32);
  ctx.quadraticCurveTo(10, 22, 18, 22);
  ctx.closePath();
  ctx.stroke();
};

/** A cycle of arrows — automation. */
export const gear: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 3);
  ctx.beginPath();
  ctx.arc(50, 50, 32, Math.PI * 0.15, Math.PI * 1.6);
  ctx.stroke();
  // Arrowhead closing the loop.
  ctx.beginPath();
  ctx.moveTo(74, 28);
  ctx.lineTo(82, 36);
  ctx.lineTo(70, 42);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(50, 50, 12, 0, Math.PI * 2);
  ctx.stroke();
};

/** Bar chart — dashboards. */
export const bars: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 4);
  const heights = [34, 58, 26, 70, 46];
  heights.forEach((bh, i) => {
    const x = 16 + i * 17;
    ctx.beginPath();
    ctx.moveTo(x, 84);
    ctx.lineTo(x, 84 - bh);
    ctx.stroke();
  });
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(8, 90);
  ctx.lineTo(92, 90);
  ctx.stroke();
};

/** Stacked cylinders — data engineering. */
export const database: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 3);
  for (const y of [26, 50, 74]) {
    ctx.beginPath();
    ctx.ellipse(50, y, 30, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(20, 26);
  ctx.lineTo(20, 74);
  ctx.moveTo(80, 26);
  ctx.lineTo(80, 74);
  ctx.stroke();
};

/** Which mark a project card shows, by category. */
export const CATEGORY_SHAPE: Record<string, ShapePainter> = {
  chatbot: bubble,
  mcp: network,
  ml: brain,
  automation: gear,
  dashboards: bars,
  'data-eng': database,
  research: waveform,
  side: initials,
};

/** Morph order on the interior page headers. */
export const SHAPES: ShapePainter[] = [brain, network, waveform];

/** Morph order in the hero: who, where, what he studies. */
export const HERO_SHAPES: ShapePainter[] = [initials, iceland, waveform];
