"use client";

import { useState } from "react";
import DeleteDialog from "@/components/platform/DeleteDialog";
import ConfirmDialog from "@/components/platform/ConfirmDialog";
import { archiveOfferAction, sendOfferAction } from "@/src/services/offerActions";
import { ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

export default function OfferFlowControls({
  offerId,
  title,
  canSend,
}: {
  offerId: string;
  title: string;
  canSend: boolean;
}) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  return (
    <>
      <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.ghost)} onClick={() => setArchiveOpen(true)}>
        Arhiviraj
      </button>
      {canSend ? (
        <button type="button" className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)} onClick={() => setSendOpen(true)}>
          Pošlji
        </button>
      ) : null}
      <DeleteDialog
        open={archiveOpen}
        name={title}
        onCancel={() => setArchiveOpen(false)}
        onConfirm={() => {
          void archiveOfferAction(offerId);
          setArchiveOpen(false);
        }}
      />
      <ConfirmDialog
        open={sendOpen}
        title="Pošlji ponudbo"
        description="E-pošta gre ven šele po odobritvi in z dovoljenjem Offer.Send."
        confirmLabel="Pošlji"
        onCancel={() => setSendOpen(false)}
        onConfirm={() => {
          const data = new FormData();
          data.set("offerId", offerId);
          void sendOfferAction(data);
          setSendOpen(false);
        }}
      />
    </>
  );
}
