import { heroCopy } from "./copy";

export default function HeroPills() {
  return (
    <p className="mt-5 text-[13px] font-medium tracking-[0.03em] text-slate-400 light:text-slate-600">
      <span className="sr-only">Ključne rešitve: </span>
      {heroCopy.pills.join("  ·  ")}
    </p>
  );
}
