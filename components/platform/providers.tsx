"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cardSurface, ctaBase, ctaSizes, ctaVariants, headingCard, cardBodyClass } from "@/design";
import { cn } from "@/lib/utils";

type ToastItem = { id: string; message: string };

type ToastContextValue = {
  push: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string) => {
    const id = `${Date.now()}`;
    setItems((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((item) => (
          <p
            key={item.id}
            className={cn(cardSurface, "pointer-events-auto p-4 text-[14px] text-slate-200")}
            role="status"
          >
            {item.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast zahteva ToastProvider.");
  return context;
}

type ModalState = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm?: () => void;
} | null;

type ModalContextValue = {
  openConfirm: (state: Exclude<ModalState, null>) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);

  const close = useCallback(() => setModal(null), []);
  const openConfirm = useCallback((state: Exclude<ModalState, null>) => {
    setModal(state);
  }, []);

  const value = useMemo(() => ({ openConfirm, close }), [openConfirm, close]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050816]/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="platform-modal-title"
            className={cn(cardSurface, "w-full max-w-md p-6")}
          >
            <h2 id="platform-modal-title" className={headingCard}>
              {modal.title}
            </h2>
            <p className={`mt-2 ${cardBodyClass}`}>{modal.description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
                onClick={close}
              >
                Prekliči
              </button>
              <button
                type="button"
                className={cn(ctaBase, ctaSizes.compact, ctaVariants.primary)}
                onClick={() => {
                  modal.onConfirm?.();
                  close();
                }}
              >
                {modal.confirmLabel ?? "Potrdi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal zahteva ModalProvider.");
  return context;
}
