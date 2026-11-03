import { isPrivateToolPath } from "@/lib/private-tool-path";

if (
  !isPrivateToolPath(window.location.pathname) &&
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true" &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      beforeSend: (event) =>
        isPrivateToolPath(window.location.pathname) ? null : event,
      beforeSendTransaction: (event) =>
        isPrivateToolPath(window.location.pathname) ? null : event,
      beforeBreadcrumb: (breadcrumb) => {
        if (isPrivateToolPath(window.location.pathname)) return null;
        if (
          breadcrumb.category === "navigation" &&
          [breadcrumb.data?.to, breadcrumb.data?.from].some(
            (value) => typeof value === "string" && isPrivateToolPath(value),
          )
        )
          return null;
        return breadcrumb;
      },
    });
  });
}
