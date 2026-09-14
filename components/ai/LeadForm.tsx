"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const fieldClass =
  "h-11 rounded-xl border-white/10 bg-black/30 text-[16px] text-white light:border-slate-200 light:bg-white light:text-slate-900";

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Vnesite ime.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Vnesite veljaven e-poštni naslov.");
      return;
    }
    if (!form.service) {
      setError("Izberite storitev.");
      return;
    }
    if (!form.description.trim()) {
      setError("Opišite projekt.");
      return;
    }
    if (!form.budget || !form.deadline) {
      setError("Izberite proračun in rok izvedbe.");
      return;
    }
    setError("");
    onSubmit({
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md light:border-slate-200 light:bg-white"
    >
      <p className="text-[13px] font-medium text-[#22c55e]">Povpraševanje za ponudbo</p>
      <Input
        required
        autoComplete="name"
        placeholder="Ime"
        aria-label="Ime"
        value={form.name}
        onChange={update("name")}
        className={fieldClass}
      />
      <Input
        autoComplete="organization"
        placeholder="Podjetje"
        aria-label="Podjetje"
        value={form.company}
        onChange={update("company")}
        className={fieldClass}
      />
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder="E-pošta"
        aria-label="E-pošta"
        value={form.email}
        onChange={update("email")}
        className={fieldClass}
      />
      <Input
        type="tel"
        autoComplete="tel"
        placeholder="Telefon"
        aria-label="Telefon"
        value={form.phone}
        onChange={update("phone")}
        className={fieldClass}
      />
      <select
        required
        aria-label="Storitev"
        value={form.service}
        onChange={update("service")}
        className={`${fieldClass} w-full px-3`}
      >
        <option value="" className="bg-[#050816]">
          Storitev
        </option>
        {serviceOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </select>
      <Textarea
        required
        rows={3}
        placeholder="Opis projekta"
        aria-label="Opis projekta"
        value={form.description}
        onChange={update("description")}
        className="min-h-20 rounded-xl border-white/10 bg-black/30 text-white light:border-slate-200 light:bg-white light:text-slate-900"
      />
      <select
        required
        aria-label="Proračun"
        value={form.budget}
        onChange={update("budget")}
        className={`${fieldClass} w-full px-3`}
      >
        <option value="" className="bg-[#050816]">
          Proračun
        </option>
        {budgetOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </select>
      <select
        required
        aria-label="Rok izvedbe"
        value={form.deadline}
        onChange={update("deadline")}
        className={`${fieldClass} w-full px-3`}
      >
        <option value="" className="bg-[#050816]">
          Rok izvedbe
        </option>
        {deadlineOptions.map((item) => (
          <option key={item} value={item} className="bg-[#050816]">
            {item}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="text-[13px] text-red-400">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        className="h-11 w-full rounded-xl border-0 bg-[#16a34a] text-white hover:bg-[#15803d]"
      >
        Pošlji povpraševanje
      </Button>
    </form>
  );
}
