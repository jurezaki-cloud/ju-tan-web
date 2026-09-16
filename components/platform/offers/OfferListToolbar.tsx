import type { ReactNode } from "react";
import CRMListToolbar from "@/components/platform/crm/CRMListToolbar";

export default function OfferListToolbar({ actions }: { actions?: ReactNode }) {
  return <CRMListToolbar actions={actions} placeholder="Iskanje ponudb" />;
}
