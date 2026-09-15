import { heroCopy } from "./copy";

export default function HeroPills() {
  return (
    <ul className="mt-7 flex flex-wrap gap-2" aria-label="Ključne rešitve">
      {heroCopy.pills.map((pill) => (
        <li key={pill}>
          <span className="inline-flex min-h-9 items-center rounded-full border border-green-500/25 bg-green-500/10 px-3.5 py-1.5 text-[13px] font-medium text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.08)] backdrop-blur-md">
            {pill}
          </span>
        </li>
      ))}
    </ul>
  );
}
