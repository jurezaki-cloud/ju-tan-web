"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/lib/data/services";
import {
  contactSchema,
  flattenContactErrors,
  type ContactFieldKey,
} from "@/lib/validation/contact";
import ContactSuccess from "./ContactSuccess";

const fieldClass =
  "h-11 w-full rounded-[10px] border border-white/10 bg-transparent px-4 text-[16px] text-white shadow-none outline-none transition duration-200 placeholder:text-slate-500 focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-green-700/80 aria-invalid:border-red-400 aria-invalid:ring-1 aria-invalid:ring-red-400/40 md:text-[16px] light:border-slate-200 light:bg-white light:text-slate-900";

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

  if (success) {
    return <ContactSuccess />;
  }

  const summaryItems = Object.entries(errors).filter(
    ([, message]) => Boolean(message),
  );

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Kontaktni obrazec"
      aria-busy={loading}
      className="relative border-t border-white/[0.08] pt-8"
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Spletna stran</label>
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
          role="alert"
          className="mb-4 rounded-[10px] border border-red-400/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300"
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
          <label htmlFor={`${formId}-name`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            Ime in priimek
          </label>
          <Input
            id={`${formId}-name`}
            required
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy(`${formId}-name-error`, "name")}
            className={fieldClass}
          />
          {errors.name ? (
            <p id={`${formId}-name-error`} className="mt-1 text-[13px] text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-company`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            Podjetje
          </label>
          <Input
            id={`${formId}-company`}
            name="organization"
            autoComplete="organization"
            value={form.company}
            onChange={update("company")}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy(`${formId}-company-error`, "company")}
            className={fieldClass}
          />
          {errors.company ? (
            <p id={`${formId}-company-error`} className="mt-1 text-[13px] text-red-400">
              {errors.company}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            E-pošta
          </label>
          <Input
            id={`${formId}-email`}
            type="email"
            required
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(`${formId}-email-error`, "email")}
            className={fieldClass}
          />
          {errors.email ? (
            <p id={`${formId}-email-error`} className="mt-1 text-[13px] text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            Telefon
          </label>
          <Input
            id={`${formId}-phone`}
            type="tel"
            name="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(`${formId}-phone-error`, "phone")}
            className={fieldClass}
          />
          {errors.phone ? (
            <p id={`${formId}-phone-error`} className="mt-1 text-[13px] text-red-400">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-service`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            Storitev
          </label>
          <select
            id={`${formId}-service`}
            required
            value={form.service}
            onChange={update("service")}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={describedBy(`${formId}-service-error`, "service")}
            className={`${fieldClass} sm:col-span-2`}
          >
            <option value="" className="bg-[#050816]">
              Izberite storitev
            </option>
            {services.map((service) => (
              <option
                key={service.title}
                value={service.title}
                className="bg-[#050816]"
              >
                {service.title}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p id={`${formId}-service-error`} className="mt-1 text-[13px] text-red-400">
              {errors.service}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-message`} className="mb-1.5 block text-[14px] font-medium text-slate-300">
            Sporočilo
          </label>
          <Textarea
            id={`${formId}-message`}
            required
            name="message"
            placeholder="Sistem, število uporabnikov, rok."
            value={form.message}
            onChange={update("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy(`${formId}-message-error`, "message")}
            className={`${fieldClass} min-h-[132px] py-3`}
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
          <input
            type="checkbox"
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
            className="mt-1 h-5 w-5 shrink-0 rounded-[4px] border-white/30 accent-[#16a34a]"
          />
          <span>
            Soglašam z obdelavo osebnih podatkov skladno s{" "}
            <Link
              href="/#privacy"
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

      <div className="mt-6 flex justify-center pb-[env(safe-area-inset-bottom,0px)] sm:justify-start">
        <Button
          type="submit"
          size="lg"
          disabled={loading || !consent}
          className="h-11 min-h-11 w-full rounded-[10px] bg-[#16a34a] px-6 text-[16px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.32)] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:bg-[#15803d] hover:shadow-[0_10px_28px_rgba(22,163,74,0.22)] disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Pošiljam ..." : "Pošlji povpraševanje"}
        </Button>
      </div>
    </form>
  );
}
