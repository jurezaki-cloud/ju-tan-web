import type { ReactNode } from "react";

export default function ErrorMessage({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} className="mt-1.5 text-[13px] text-red-400" role="alert">
      {children}
    </p>
  );
}
