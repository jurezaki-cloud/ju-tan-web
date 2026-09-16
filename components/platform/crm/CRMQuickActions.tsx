import Link from "next/link";
import { textLinkClass } from "@/design";

export default function CRMQuickActions({ clientId }: { clientId?: string }) {
  const prefix = clientId ? `?clientId=${clientId}` : "";
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/crm/leads${prefix}`} className={textLinkClass}>
        Leadi
      </Link>
      <Link href={`/crm/opportunities${prefix}`} className={textLinkClass}>
        Priložnosti
      </Link>
      <Link href={`/crm/tasks${prefix}`} className={textLinkClass}>
        Naloge
      </Link>
      <Link href={`/crm/quotes${prefix}`} className={textLinkClass}>
        Quote zapisi
      </Link>
      <Link href={`/crm/offers${prefix}`} className={textLinkClass}>
        Ponudbe
      </Link>
      <Link href={`/crm/activities${prefix}`} className={textLinkClass}>
        Aktivnosti
      </Link>
      <Link href={`/crm/notes${prefix}`} className={textLinkClass}>
        Opombe
      </Link>
    </div>
  );
}
