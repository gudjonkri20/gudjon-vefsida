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
 * Twenty-two coastal reference points, normalised from real longitude and
 * latitude rather than drawn by hand, so the Westfjords, Snæfellsnes and the
 * eastern fjords land where they actually are:
 *   x = (lon + 24.6) / 11.2 * 100      y = (66.6 - lat) / 3.3 * 100
 */
const ICELAND: Array<[number, number]> = [
  [17.0, 84.8], // Reykjanes
  [17.9, 78.8], // Keflavík
  [5.4, 53.0], // Snæfellsnes tip
  [23.2, 54.5], // Snæfellsnes base
  [25.0, 39.4], // Breiðafjörður
  [9.8, 33.3], // Westfjords, south shore
  [0.9, 33.3], // Látrabjarg, westernmost point
  [14.3, 15.2], // Westfjords, north-west
  [19.6, 4.5], // Hornstrandir
  [27.7, 27.3], // Westfjords, eastern base
  [33.9, 30.3], // Húnaflói
  [40.2, 15.2], // Skagi
  [50.9, 12.1], // Tröllaskagi
  [58.0, 24.2], // Eyjafjörður
  [72.3, 3.0], // Melrakkaslétta
  [85.7, 15.2], // north-east
  [98.2, 42.4], // easternmost point
  [97.3, 57.6], // eastern fjords
  [90.2, 69.7], // south-east
  [67.9, 86.4], // south coast
  [50.0, 97.0], // Vík
  [36.6, 90.9], // south-west coast
];

export const iceland: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  stroke(ctx, 2.4);

  ctx.beginPath();
  ICELAND.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
};

/** Morph order on the interior page headers. */
export const SHAPES: ShapePainter[] = [brain, network, waveform];

/** Morph order in the hero: who, where, what he studies. */
export const HERO_SHAPES: ShapePainter[] = [initials, iceland, waveform];
