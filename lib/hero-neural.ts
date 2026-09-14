export type NeuralNode = {
  x: number;
  y: number;
  z: number;
  r: number;
  rim: boolean;
};

export type NeuralEdge = {
  a: number;
  b: number;
};

/** Right-facing human head profile in 100×100 space. */
export const headProfile: [number, number][] = [
  [48, 7],
  [38, 9],
  [29, 14],
  [23, 22],
  [19, 32],
  [18, 42],
  [16, 47],
  [17, 53],
  [20, 56],
  [22, 58],
  [24, 64],
  [28, 71],
  [32, 78],
  [34, 86],
  [35, 94],
  [47, 96],
  [56, 94],
  [57, 86],
  [56, 78],
  [58, 71],
  [64, 67],
  [71, 63],
  [69, 58],
  [70, 54],
  [79, 49],
  [72, 45],
  [69, 40],
  [68, 33],
  [66, 24],
  [61, 15],
  [54, 9],
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function insideHead(x: number, y: number) {
  let inside = false;
  for (let i = 0, j = headProfile.length - 1; i < headProfile.length; j = i++) {
    const [xi, yi] = headProfile[i];
    const [xj, yj] = headProfile[j];
    const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0001) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function sampleOutline(spacing: number) {
  const points: { x: number; y: number }[] = [];
  const ring = headProfile;

  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    const length = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.round(length / spacing));
    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
      });
    }
  }

  return points;
}

export function createNeuralGraph(interior: number, spacing: number, seed = 42) {
  const rand = mulberry32(seed);
  const nodes: NeuralNode[] = [];

  for (const point of sampleOutline(spacing)) {
    nodes.push({
      x: point.x,
      y: point.y,
      z: ((point.x - 48) / 50) * 0.22,
      r: 1.05 + rand() * 0.55,
      rim: true,
    });
  }

  const rimCount = nodes.length;
  let guard = 0;

  while (nodes.length < rimCount + interior && guard < interior * 50) {
    guard += 1;
    const x = 18 + rand() * 62;
    const y = 10 + rand() * 84;
    if (!insideHead(x, y)) continue;

    const tooClose = nodes.some((item) => {
      const dx = item.x - x;
      const dy = item.y - y;
      return dx * dx + dy * dy < (item.rim ? 22 : 16);
    });
    if (tooClose) continue;

    nodes.push({
      x,
      y,
      z: ((x - 48) / 50) * 0.35 + ((y - 48) / 50) * 0.12,
      r: 1.05 + rand() * 1.2,
      rim: false,
    });
  }

  const edges: NeuralEdge[] = [];
  const degree = nodes.map(() => 0);

  for (let i = 0; i < rimCount; i += 1) {
    const next = (i + 1) % rimCount;
    edges.push({ a: i, b: next });
    degree[i] += 1;
    degree[next] += 1;
  }

  const maxDist = spacing * 3.4;

  for (let i = 0; i < nodes.length; i += 1) {
    const candidates: { j: number; d: number }[] = [];
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (i < rimCount && j === (i + 1) % rimCount) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < maxDist) candidates.push({ j, d });
    }
    candidates.sort((a, b) => a.d - b.d);
    const cap = nodes[i].rim ? 2 : 3;
    for (const candidate of candidates.slice(0, cap)) {
      if (degree[i] >= 5 || degree[candidate.j] >= 5) continue;
      edges.push({ a: i, b: candidate.j });
      degree[i] += 1;
      degree[candidate.j] += 1;
    }
  }

  return { nodes, edges, rimCount };
}

export const neuralGraphDesktop = createNeuralGraph(28, 4.6, 42);
export const neuralGraphMobile = createNeuralGraph(14, 6.1, 42);
