import type { ReactNode } from "react";
import SectionCard from "@/components/platform/SectionCard";

export default function CRMDetailPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <SectionCard title={title}>{children}</SectionCard>;
}
