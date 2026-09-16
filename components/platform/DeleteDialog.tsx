"use client";

import ConfirmDialog from "./ConfirmDialog";

type DeleteDialogProps = {
  open: boolean;
  name?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteDialog({
  open,
  name,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Izbriši zapis"
      description={
        name
          ? `Zapis »${name}« bo arhiviran (soft delete).`
          : "Zapis bo arhiviran (soft delete)."
      }
      confirmLabel="Izbriši"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
