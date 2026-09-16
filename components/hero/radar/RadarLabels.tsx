import { POINTS, RADAR_NODES } from "./geometry";

type RadarLabelsProps = {
  hovered: boolean;
};

export default function RadarLabels({ hovered }: RadarLabelsProps) {
  return (
    <>
      {RADAR_NODES.map((label, index) => {
        const point = POINTS[index];
        if (!point) return null;

        return (
          <div
            key={label}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-[8px] font-medium uppercase tracking-[0.16em] sm:text-[10px] ${
              hovered
                ? "text-slate-300 light:text-slate-600"
                : "text-slate-400 light:text-slate-500"
            }`}
            style={{
              left: `${point.left}%`,
              top: `${point.top}%`,
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
}
