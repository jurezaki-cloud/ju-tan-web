import { cardSurface, headingCard, cardBodyClass, metaClass } from "@/design";
import type { Approval } from "@/src/ai/approval/policy";
import StatusBadge from "@/components/platform/StatusBadge";

export default function ApprovalCard({ approval }: { approval: Approval }) {
  return (
    <article className={`${cardSurface} p-4`}>
      <StatusBadge
        label={approval.approved ? "Odobreno" : "Čaka"}
        tone={approval.approved ? "success" : "caution"}
      />
      <h3 className={`${headingCard} mt-3 text-[16px]`}>{approval.title}</h3>
      <p className={`mt-1 ${cardBodyClass}`}>{approval.description}</p>
      <p className={`mt-2 ${metaClass}`}>
        Politika {approval.policyId}
        {approval.approvedBy ? ` · ${approval.approvedBy}` : ""}
      </p>
    </article>
  );
}
