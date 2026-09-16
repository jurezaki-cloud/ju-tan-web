"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IdentityFrame from "@/components/identity/IdentityFrame";
import FormActions from "@/components/platform/FormActions";
import ErrorState from "@/components/platform/ErrorState";
import { ctaBase, ctaSizes, ctaVariants, metaClass } from "@/design";
import { cn } from "@/lib/utils";

export default function InviteTokenPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ emailMasked?: string; role?: string; workspaceId?: string } | null>(null);

  useEffect(() => {
    void fetch(`/api/invite/${params.token}`)
      .then(async (response) => {
        const body = (await response.json()) as {
          ok?: boolean;
          error?: string;
          data?: { emailMasked?: string; role?: string; workspaceId?: string };
        };
        if (!response.ok || !body.ok) {
          setError(body.error ?? "Povabilo ni veljavno.");
          return;
        }
        setData(body.data ?? {});
      })
      .catch(() => setError("Povabilo ni veljavno."));
  }, [params.token]);

  return (
    <IdentityFrame title="Povabilo">
      {error ? <ErrorState description={error} /> : null}
      {!error && !data ? <p className={metaClass}>Preverjam povabilo…</p> : null}
      {!error && data ? (
        <>
          <p className={metaClass}>Račun: {data.emailMasked}</p>
          <p className={`mt-2 ${metaClass}`}>Vloga: {data.role ?? "—"}</p>
          <p className={`mt-2 ${metaClass}`}>Workspace: {data.workspaceId ?? "—"}</p>
          <FormActions>
            <button
              type="button"
              className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}
              onClick={() => router.push(`/invite/${params.token}/accept`)}
            >
              Nastavi geslo
            </button>
          </FormActions>
        </>
      ) : null}
    </IdentityFrame>
  );
}
