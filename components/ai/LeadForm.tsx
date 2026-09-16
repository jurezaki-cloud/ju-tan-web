"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import CTAButton from "@/components/navbar/CTAButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { contactSchema } from "@/lib/validation/contact";
import {
  budgetOptions,
  deadlineOptions,
  serviceOptions,
} from "./content";

export type LeadPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  budget: string;
  deadline: string;
};

type LeadFormProps = {
  onSubmit: (payload: LeadPayload) => void;
};

export function formatLeadSummary(data: LeadPayload) {
  return `Hvala, ${data.name}. Povzetek povpraševanja:

• Podjetje: ${data.company || "—"}
• E-pošta: ${data.email}
• Telefon: ${data.phone || "—"}
• Storitev: ${data.service}
• Opis: ${data.description}
• Proračun: ${data.budget}
• Rok izvedbe: ${data.deadline}

Kmalu vas kontaktiramo.`;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentAt, setConsentAt] = useState("");
  const [form, setForm] = useState<LeadPayload>({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const update =
    (key: keyof LeadPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.budget || !form.deadline) {
      setError("Izberite proračun in rok izvedbe.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
    };

    const parsed = contactSchema.safeParse({
      name: payload.name,
      company: payload.company || undefined,
      email: payload.email,
      phone: payload.phone || undefined,
      service: payload.service,
      message: [
        payload.description,
        `Proračun: ${payload.budget}`,
        `Rok izvedbe: ${payload.deadline}`,
      ].join("\n"),
      consent,
      consentAt: consent ? consentAt || new Date().toISOString() : "",
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Preverite vnesena polja.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        setError(
          response.status === 429
            ? "Preveč poskusov. Poskusite znova čez nekaj minut."
            : response.status === 503
              ? "Pošiljanje trenutno ni na voljo. Pišite nam na e-pošto."
              : "Pošiljanje povpraševanja ni uspelo.",
        );
        return;
      }

      onSubmit(payload);
    } catch {
      setError("Pošiljanje povpraševanja ni uspelo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Povpraševanje za ponudbo"
      className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md light:border-slate-200 light:bg-white"
    >
      <p className="text-[13px] font-medium text-green-600">Povpraševanje za ponudbo</p>
      <Input
        required
        name="name"
        autoComplete="name"
        inputMode="text"
        enterKeyHint="next"
        placeholder="Ime"
        aria-label="Ime"
        value={form.name}
        onChange={update("name")}
      />
      <Input
        name="organization"
        autoComplete="organization"
        inputMode="text"
        enterKeyHint="next"
        placeholder="Podjetje"
        aria-label="Podjetje"
        value={form.company}
        onChange={update("company")}
      />
      <Input
        type="email"
        required
        name="email"
        autoComplete="email"
        inputMode="email"
        enterKeyHint="next"
        placeholder="E-pošta"
        aria-label="E-pošta"
        value={form.email}
        onChange={update("email")}
      />
      <Input
        type="tel"
        name="tel"
        autoComplete="tel"
        inputMode="tel"
        enterKeyHint="next"
        placeholder="Telefon"
        aria-label="Telefon"
        value={form.phone}
        onChange={update("phone")}
      />
      <Select
        required
        name="service"
        aria-label="Storitev"
        value={form.service}
        onChange={update("service")}
      >
        <option value="" className="bg-[#050816]">
          Storitev
        </option>
        {serviceOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </Select>
      <Textarea
        required
        rows={3}
        enterKeyHint="send"
        placeholder="Opis projekta"
        aria-label="Opis projekta"
        value={form.description}
        onChange={update("description")}
        className="min-h-20"
      />
      <Select
        required
        aria-label="Proračun"
        value={form.budget}
        onChange={update("budget")}
      >
        <option value="" className="bg-[#050816]">
          Proračun
        </option>
        {budgetOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </Select>
      <Select
        required
        aria-label="Rok izvedbe"
        value={form.deadline}
        onChange={update("deadline")}
      >
        <option value="" className="bg-[#050816]">
          Rok izvedbe
        </option>
        {deadlineOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </Select>
      {error ? (
        <p role="alert" className="min-h-5 text-[13px] text-red-400">
          {error}
        </p>
      ) : (
        <p className="min-h-5" aria-hidden />
      )}
      <label className="flex items-start gap-2 text-[12px] leading-5 text-slate-300">
        <Checkbox
          required
          checked={consent}
          onChange={(event) => {
            const checked = event.target.checked;
            setConsent(checked);
            setConsentAt(checked ? new Date().toISOString() : "");
          }}
        />
        <span>
          Soglašam z obdelavo podatkov skladno s{" "}
          <Link href="/politika-zasebnosti" className="text-green-600 underline-offset-2 hover:underline">
            Politiko zasebnosti
          </Link>
          .
        </span>
      </label>
      <CTAButton type="submit" disabled={loading || !consent} className="w-full">
        {loading ? "Pošiljam ..." : "Pošlji povpraševanje"}
      </CTAButton>
    </form>
  );
}
