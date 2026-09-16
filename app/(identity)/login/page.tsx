import IdentityFrame from "@/components/identity/IdentityFrame";
import LoginForm from "@/components/identity/LoginForm";
import { metaClass } from "@/design";
import { identityDemoEnabled } from "@/src/identity/config";
import { safeNextPath } from "@/src/identity/redirects";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; resetToken?: string }>;
}) {
  const params = await searchParams;
  const resetToken = typeof params.resetToken === "string" ? params.resetToken.trim() : "";
  return (
    <IdentityFrame title="Prijava">
      <LoginForm nextPath={safeNextPath(params.next)} resetToken={resetToken || undefined} />
      {identityDemoEnabled() ? (
        <p className={`mt-6 ${metaClass}`}>
          Lokalni računi: owner@ju-tan.com, admin@ju-tan.com, manager@ju-tan.com,
          employee@ju-tan.com, client@ju-tan.com · geslo demo
        </p>
      ) : null}
    </IdentityFrame>
  );
}
