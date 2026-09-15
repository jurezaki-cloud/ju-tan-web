import { heroCopy } from "./copy";

export default function HeroPills() {
  return (
    <p
      className="mt-6 text-[13px] font-medium tracking-[0.03em] text-slate-500"
      aria-label="Ključne rešitve"
    >
      {heroCopy.pills.join("  ·  ")}
    </p>
  );
}
