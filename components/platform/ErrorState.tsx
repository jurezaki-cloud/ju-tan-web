import { AlertCircle } from "lucide-react";
import { cardBodyClass, headingCard } from "@/design";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export default function ErrorState({
  title = "Podatkov ni mogoče prikazati",
  description = "Poskusite znova. Povezava z backendom še ni aktivna.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center" role="alert">
      <AlertCircle className="h-8 w-8 text-red-400" strokeWidth={1.6} aria-hidden />
      <p className={`mt-4 ${headingCard}`}>{title}</p>
      <p className={`mt-1.5 max-w-sm ${cardBodyClass}`}>{description}</p>
    </div>
  );
}
