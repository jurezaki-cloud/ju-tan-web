import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import PageLoader from "./PageLoader";

export type PageStatus = "loading" | "empty" | "error" | "ready";

type PageStateProps = {
  status: PageStatus;
  children: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
};

export default function PageState({
  status,
  children,
  emptyTitle = "Ni podatkov",
  emptyDescription = "Za ta pogled trenutno ni zapisov.",
  errorTitle,
  errorDescription,
}: PageStateProps) {
  if (status === "loading") return <PageLoader />;
  if (status === "error") {
    return <ErrorState title={errorTitle} description={errorDescription} />;
  }
  if (status === "empty") {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return children;
}
