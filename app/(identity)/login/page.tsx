import IdentityFrame from "@/components/identity/IdentityFrame";
import LoginForm from "@/components/identity/LoginForm";
import { metaClass } from "@/design";
import { safeNextPath } from "@/src/identity/redirects";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <IdentityFrame title="Prijava">
      <LoginForm nextPath={safeNextPath(params.next)} />
      <p className={`mt-6 ${metaClass}`}>
        Demo: owner@ju-tan.com, admin@ju-tan.com, manager@ju-tan.com, employee@ju-tan.com,
        client@ju-tan.com · geslo demo
      </p>
    </IdentityFrame>
  );
}
