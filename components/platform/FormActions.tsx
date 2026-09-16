import type { ReactNode } from "react";

export default function FormActions({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}
