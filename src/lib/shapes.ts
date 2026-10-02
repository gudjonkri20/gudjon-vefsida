/**
 * Shape painters for the constellation canvas.
 *
 * Each painter strokes a silhouette into an offscreen 2D context. The canvas
 * component then rasterises that drawing and samples the surviving pixels into
 * a point cloud, so these only need to produce a recognisable outline — the
 * webbing between points is generated later from point proximity.
 *
 * Outlines are stroked rather than filled on purpose: a filled glyph samples
 * into a solid blob, while an outline leaves the interior open for the link
 * lines to span.
 */

export type ShapePainter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) => void;

/** Fits a 0-100 normalised design box into the canvas, preserving aspect. */
function fit(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const size = Math.min(w, h) * 0.78;
  const scale = size / 100;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate((w - size) / 2, (h - size) / 2);
  ctx.scale(scale, scale);
}

function strokeStyle(ctx: CanvasRenderingContext2D, width = 2.2) {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

/** The initials, stroked so they sample as an outline. */
export const initials: ShapePainter = (ctx, w, h) => {
  const size = Math.min(w, h) * 0.66;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 ${size}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  strokeStyle(ctx, 3.2);
  ctx.strokeText('GK', w / 2, h / 2);
};

/**
 * Brain silhouette plus cortical folds, drawn in a 0-100 box.
 * The folds matter: without them the outline alone reads as a blob.
 */
export const brain: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  strokeStyle(ctx);

  const outline = new Path2D(
    'M50 8 C68 8 82 17 84 31 C93 37 93 52 84 59 C84 72 72 83 56 83 ' +
      'C50 89 38 89 32 83 C18 81 8 69 10 55 C1 47 3 32 14 27 ' +
      'C18 13 32 8 50 8 Z',
  );
  ctx.stroke(outline);

  const folds = [
    'M50 10 C51 30 49 52 48 82',
    'M26 25 C37 31 35 44 26 49',
    'M65 23 C56 32 61 44 71 46',
    'M30 57 C41 60 45 68 41 79',
    'M63 59 C57 65 59 72 65 75',
    'M16 40 C24 41 28 36 27 31',
    'M78 38 C71 40 68 35 70 30',
  ];
  ctx.lineWidth = 2;
  for (const d of folds) ctx.stroke(new Path2D(d));

  // Brain stem, so the silhouette does not read as a plain blob.
  ctx.lineWidth = 2.2;
  ctx.stroke(new Path2D('M44 83 C44 90 48 94 54 95'));
};

/**
 * A feed-forward network diagram: three layers, fully connected.
 * Deterministic layout so the cloud never reshuffles between builds.
 */
export const network: ShapePainter = (ctx, w, h) => {
  fit(ctx, w, h);
  strokeStyle(ctx, 0.9);

  const layers = [4, 5, 4];
  const xs = [14, 50, 86];
  const nodes = layers.map((count, li) => {
    const span = 70;
    const step = span / (count - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: xs[li],
      y: 15 + i * step,
    }));
  });

  // Each node reaches only its two nearest neighbours in the next layer.
  // A fully connected mesh contributes so many pixels that sampling buries
  // the nodes themselves and the cloud reads as noise.
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

/** Morph order for the hero. */
export const SHAPES: ShapePainter[] = [initials, brain, network];
