"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  cardBodyClass,
  ctaBase,
  ctaSizes,
  ctaVariants,
  fieldClass,
  headingCard,
  labelClass,
} from "@/design";
import { lockBodyScroll } from "@/lib/lock-body-scroll";
import { cn } from "@/lib/utils";

type OfficeDownloadDialogProps = {
  open: boolean;
  onClose: () => void;
};

function startAuthorizedDownload() {
  const anchor = document.createElement("a");
  anchor.href = "/api/office/download";
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function OfficeDownloadDialogPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unlock = lockBodyScroll();
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [onClose, pending]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/office/download/authorize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });

      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !body?.ok) {
        setError(body?.error ?? "Geslo ni pravilno.");
        setPending(false);
        return;
      }

      startAuthorizedDownload();
      onClose();
    } catch {
      setError("Geslo ni pravilno.");
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Zapri"
        className="absolute inset-0 bg-[#050816]/72 backdrop-blur-[2px] light:bg-slate-900/40"
        onClick={() => {
          if (!pending) onClose();
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-card border border-white/10 bg-[#0a1024] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] light:border-slate-200 light:bg-white light:shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className={headingCard}>
            Prenos JU-TAN Office
          </h2>
          <button
            type="button"
            aria-label="Zapri dialog"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white light:text-slate-500 light:hover:bg-slate-100 light:hover:text-slate-900"
            onClick={() => {
              if (!pending) onClose();
            }}
            disabled={pending}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className={`mt-2 ${cardBodyClass} light:text-slate-600`}>
          Vnesite geslo za prenos namizne aplikacije.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {error ? (
            <p className="text-[14px] text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <div>
            <label className={labelClass} htmlFor={inputId}>
              Geslo za prenos
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id={inputId}
                className={cn(fieldClass, "pr-12")}
                type={showPassword ? "text" : "password"}
                name="office-download-password"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={pending}
                aria-invalid={error ? true : undefined}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:text-white light:text-slate-500 light:hover:text-slate-900"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Skrij geslo" : "Prikaži geslo"}
                disabled={pending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={cn(ctaBase, ctaSizes.default, ctaVariants.secondary)}
              onClick={() => {
                if (!pending) onClose();
              }}
              disabled={pending}
            >
              Prekliči
            </button>
            <button
              type="submit"
              className={cn(ctaBase, ctaSizes.default, ctaVariants.primary)}
              disabled={pending || password.length === 0}
            >
              {pending ? "Preverjam…" : "Prenesi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OfficeDownloadDialog({
  open,
  onClose,
}: OfficeDownloadDialogProps) {
  if (!open) return null;
  return <OfficeDownloadDialogPanel onClose={onClose} />;
}
