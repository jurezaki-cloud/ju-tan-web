export type NeuralNode = {
  x: number;
  y: number;
  z: number;
  r: number;
};

export type NeuralEdge = {
  a: number;
  b: number;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function insideBrain(x: number, y: number) {
  const nx = x / 100;
  const ny = y / 100;
  const left = ((nx - 0.38) / 0.3) ** 2 + ((ny - 0.46) / 0.34) ** 2;
  const right = ((nx - 0.62) / 0.3) ** 2 + ((ny - 0.46) / 0.34) ** 2;
  const stem = ((nx - 0.5) / 0.12) ** 2 + ((ny - 0.76) / 0.14) ** 2;
  const cleft = Math.abs(nx - 0.5) < 0.032 && ny < 0.4;
  return (left <= 1 || right <= 1 || stem <= 1) && !cleft;
}

export function createNeuralGraph(count: number, seed = 42) {
  const rand = mulberry32(seed);
  const nodes: NeuralNode[] = [];
  let guard = 0;

  while (nodes.length < count && guard < count * 40) {
    guard += 1;
    const x = 12 + rand() * 76;
    const y = 10 + rand() * 78;
    if (!insideBrain(x, y)) continue;

    const tooClose = nodes.some((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return dx * dx + dy * dy < 18;
    });
    if (tooClose) continue;

    const z = ((x - 50) / 50) * 0.35 + ((y - 48) / 50) * 0.15;
    nodes.push({
      x,
      y,
      z,
      r: 1.15 + rand() * 1.35,
    });
  }

  const edges: NeuralEdge[] = [];
  const degree = nodes.map(() => 0);
  const maxDist = count > 30 ? 22 : 26;

  for (let i = 0; i < nodes.length; i += 1) {
    const candidates: { j: number; d: number }[] = [];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < maxDist) candidates.push({ j, d });
    }
    candidates.sort((a, b) => a.d - b.d);
    for (const candidate of candidates.slice(0, 3)) {
      if (degree[i] >= 4 || degree[candidate.j] >= 4) continue;
      edges.push({ a: i, b: candidate.j });
      degree[i] += 1;
      degree[candidate.j] += 1;
    }
  }

  return { nodes, edges };
}

export const neuralGraphDesktop = createNeuralGraph(42, 42);
export const neuralGraphMobile = createNeuralGraph(24, 42);
