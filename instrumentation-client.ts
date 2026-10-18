if (
  window.location.pathname !== "/magic" &&
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true" &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      beforeSend: (event) =>
        window.location.pathname === "/magic" ? null : event,
      beforeSendTransaction: (event) =>
        window.location.pathname === "/magic" ? null : event,
      beforeBreadcrumb: (breadcrumb) => {
        if (window.location.pathname === "/magic") return null;
        if (
          breadcrumb.category === "navigation" &&
          [breadcrumb.data?.to, breadcrumb.data?.from].some(
            (value) => typeof value === "string" && value.includes("/magic"),
          )
        )
          return null;
        return breadcrumb;
      },
    });
  });
}
