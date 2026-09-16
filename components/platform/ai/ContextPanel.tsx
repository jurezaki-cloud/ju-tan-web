import { cardSurface, headingCard, metaClass, cardBodyClass } from "@/design";
import ActivityFeed from "./ActivityFeed";
import type { AiActivityItem, AiContext } from "@/src/ai/types";

type ContextPanelProps = {
  context: AiContext;
  activity: AiActivityItem[];
};

export default function ContextPanel({ context, activity }: ContextPanelProps) {
  return (
    <aside className={`${cardSurface} flex h-full flex-col gap-6 p-5`} aria-label="Kontekst">
      <div>
        <h2 className={headingCard}>Kontekst</h2>
        <dl className="mt-4 space-y-3 text-[14px]">
          <div>
            <dt className={metaClass}>Aktivni projekt</dt>
            <dd className="mt-0.5 text-slate-200 light:text-slate-800">{context.project}</dd>
          </div>
          <div>
            <dt className={metaClass}>Aktivna stranka</dt>
            <dd className="mt-0.5 text-slate-200 light:text-slate-800">{context.client}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className={metaClass}>Priponke</h3>
        <ul className="mt-2 space-y-1">
          {context.attachments.map((item) => (
            <li key={item} className={cardBodyClass}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={metaClass}>Zgodovina</h3>
        <ul className="mt-2 space-y-1">
          {context.history.map((item) => (
            <li key={item} className={cardBodyClass}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={`${headingCard} text-[16px]`}>Zadnje AI akcije</h3>
        <div className="mt-3">
          <ActivityFeed items={activity} />
        </div>
      </div>
    </aside>
  );
}
