import { heroCopy } from "../copy";

export function q(value: number) {
  return (Math.round(value * 10000) / 10000).toFixed(4);
}

export const CENTER = 50;
export const OUTER = 38;
export const CENTER_ATTR = q(CENTER);

export type RadarPoint = { x: string; y: string; left: string; top: string };

function pointAt(index: number, total: number, radius: number): RadarPoint {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = CENTER + Math.cos(angle) * radius;
  const y = CENTER + Math.sin(angle) * radius;
  const outward = 1.12;
  return {
    x: q(x),
    y: q(y),
    left: q(CENTER + (x - CENTER) * outward),
    top: q(CENTER + (y - CENTER) * outward),
  };
}

export const RADAR_NODES = heroCopy.network.nodes;

export const POINTS: RadarPoint[] = Array.from(
  { length: RADAR_NODES.length },
  (_, index) => pointAt(index, RADAR_NODES.length, OUTER),
);

export const MARKS = Array.from({ length: 72 }, (_, index) => {
  const angle = (index / 72) * Math.PI * 2 - Math.PI / 2;
  const major = index % 6 === 0;
  const inner = OUTER + (major ? 0.35 : 0.8);
  const outer = OUTER + (major ? 3.2 : 1.7);
  return {
    key: index,
    major,
    x1: q(CENTER + Math.cos(angle) * inner),
    y1: q(CENTER + Math.sin(angle) * inner),
    x2: q(CENTER + Math.cos(angle) * outer),
    y2: q(CENTER + Math.sin(angle) * outer),
  };
});
