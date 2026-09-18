"use client";

import { useId, useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import CTAButton from "@/components/navbar/CTAButton";
import { contactServiceOptions } from "@/lib/data/services";
import {
  contactSchema,
  flattenContactErrors,
  type ContactFieldKey,
} from "@/lib/validation/contact";
import ContactSuccess from "./ContactSuccess";
import { labelClass } from "@/design";

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

type FieldErrors = Partial<Record<ContactFieldKey | "form", string>>;

export default function ContactForm() {
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(emptyForm);
  const [consent, setConsent] = useState(false);
  const [consentAt, setConsentAt] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const update =
    (key: keyof typeof emptyForm) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value;
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        delete next.form;
        return next;
      });
    };

  const describedBy = (id: string, key: ContactFieldKey) =>
    errors[key] ? id : undefined;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      service: form.service,
      message: form.message,
      consent,
      consentAt: consent ? consentAt || new Date().toISOString() : "",
      website: honeypot,
    });

    if (!parsed.success) {
      setErrors(flattenContactErrors(parsed.error));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        setErrors({
          form:
            response.status === 429
              ? "Preveč poskusov. Poskusite znova čez nekaj minut."
              : response.status === 503
                ? "Pošiljanje trenutno ni na voljo. Pišite nam na e-pošto."
                : response.status === 400
                  ? "Potrdite soglasje in preverite vnesena polja."
                  : "Pošiljanje povpraševanja ni uspelo.",
        });
        return;
      }

      setSuccess(true);
      setForm(emptyForm);
      setConsent(false);
      setConsentAt("");
      setHoneypot("");
    } catch {
      setErrors({ form: "Priprava povpraševanja ni uspela." });
    } finally {
      setLoading(false);
    }
  };

  const summaryItems = Object.entries(errors).filter(
    ([, message]) => Boolean(message),
  );

  useEffect(() => {
    if (summaryItems.length === 0) return;
    summaryRef.current?.focus();
  }, [summaryItems.length]);

  if (success) {
    return <ContactSuccess />;
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Kontaktni obrazec"
      aria-busy={loading}
      className="relative"
    >
      <div className="pointer-events-none absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <input
          id={`${formId}-website`}
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {summaryItems.length > 0 ? (
        <div
          id={`${formId}-summary`}
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          <p className="font-semibold">Obrazec vsebuje napake:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {summaryItems.map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Ime in priimek
          </label>
          <Input
            id={`${formId}-name`}
            required
            name="name"
            autoComplete="name"
            enterKeyHint="next"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy(`${formId}-name-error`, "name")}
          />
          {errors.name ? (
            <p id={`${formId}-name-error`} className="mt-1 text-[13px] text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-company`} className={labelClass}>
            Podjetje
          </label>
          <Input
            id={`${formId}-company`}
            name="organization"
            autoComplete="organization"
            enterKeyHint="next"
            value={form.company}
            onChange={update("company")}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy(`${formId}-company-error`, "company")}
          />
          {errors.company ? (
            <p id={`${formId}-company-error`} className="mt-1 text-[13px] text-red-400">
              {errors.company}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className={labelClass}>
            E-pošta
          </label>
          <Input
            id={`${formId}-email`}
            type="email"
            required
            name="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(`${formId}-email-error`, "email")}
          />
          {errors.email ? (
            <p id={`${formId}-email-error`} className="mt-1 text-[13px] text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className={labelClass}>
            Telefon
          </label>
          <Input
            id={`${formId}-phone`}
            type="tel"
            name="tel"
            autoComplete="tel"
            inputMode="tel"
            enterKeyHint="next"
            value={form.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(`${formId}-phone-error`, "phone")}
          />
          {errors.phone ? (
            <p id={`${formId}-phone-error`} className="mt-1 text-[13px] text-red-400">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-service`} className={labelClass}>
            Storitev
          </label>
          <Select
            id={`${formId}-service`}
            name="service"
            autoComplete="off"
            required
            value={form.service}
            onChange={update("service")}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={describedBy(`${formId}-service-error`, "service")}
          >
            <option value="" className="bg-[#050816]">
              Izberite storitev
            </option>
            {contactServiceOptions.map((service) => (
              <option
                key={service}
                value={service}
                className="bg-[#050816]"
              >
                {service}
              </option>
            ))}
          </Select>
          {errors.service ? (
            <p id={`${formId}-service-error`} className="mt-1 text-[13px] text-red-400">
              {errors.service}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-message`} className={labelClass}>
            Sporočilo
          </label>
          <Textarea
            id={`${formId}-message`}
            required
            name="message"
            placeholder="Sistem, število uporabnikov, rok."
            enterKeyHint="send"
            value={form.message}
            onChange={update("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy(`${formId}-message-error`, "message")}
          />
          {errors.message ? (
            <p id={`${formId}-message-error`} className="mt-1 text-[13px] text-red-400">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-3 text-[14px] leading-[1.55] text-slate-300">
          <Checkbox
            required
            checked={consent}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? `${formId}-consent-error` : undefined
            }
            onChange={(event) => {
              const checked = event.target.checked;
              setConsent(checked);
              setConsentAt(checked ? new Date().toISOString() : "");
              setErrors((current) => {
                const next = { ...current };
                delete next.consent;
                delete next.consentAt;
                delete next.form;
                return next;
              });
            }}
          />
          <span>
            Soglašam z obdelavo osebnih podatkov skladno s{" "}
            <Link
              href="/politika-zasebnosti"
              className="font-medium text-slate-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              Politiko zasebnosti
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p id={`${formId}-consent-error`} className="mt-1 text-[13px] text-red-400">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-center pb-[env(safe-area-inset-bottom,0px)]">
        <CTAButton
          type="submit"
          disabled={loading || !consent}
          className="w-full sm:w-auto"
        >
          {loading ? "Pošiljam ..." : "Pošlji povpraševanje"}
        </CTAButton>
      </div>
    </form>
  );
}
