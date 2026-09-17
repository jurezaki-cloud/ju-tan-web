import { heroCopy } from "./copy";

export default function HeroPills() {
  return (
    <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.16em] text-slate-500 light:text-slate-600">
      <span className="sr-only">Ključna področja: </span>
      {heroCopy.pills.join("  ·  ")}
    </p>
  );
}
