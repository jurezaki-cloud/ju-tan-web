"use client";

import { useState } from "react";
import { Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Reveal } from "@/components/animations";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-[16px] text-white shadow-none outline-none transition duration-[250ms] placeholder:text-slate-500 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:shadow-[0_0_20px_rgba(34,197,94,0.12)]";

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

const details = [
  {
    icon: Phone,
    title: company.contact.phoneLabel,
    value: company.contact.phone,
    href: company.contact.phoneTel,
  },
  {
    icon: Phone,
    title: company.contact.phoneSecondaryLabel,
    value: company.contact.phoneSecondary,
    href: company.contact.phoneSecondaryTel,
  },
  {
    icon: Mail,
    title: "E-pošta",
    value: company.contact.email,
    href: `mailto:${company.contact.email}`,
  },
  {
    icon: Clock,
    title: "Delovni čas",
    value: company.contact.hours,
  },
];

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update =
    (key: keyof typeof emptyForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({ ...current, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name.trim()) {
      setError("Vnesite svoje ime.");
      return;
    }

    if (!form.email.trim()) {
      setError("Vnesite e-poštni naslov.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Vnesite veljaven e-poštni naslov.");
      return;
    }

    if (!form.service) {
      setError("Izberite storitev.");
      return;
    }

    if (!form.message.trim()) {
      setError("Vnesite sporočilo.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || undefined,
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      service: form.service,
      message: form.message.trim(),
      website: honeypot,
    };

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError(
          response.status === 429
            ? "Preveč poskusov. Poskusite znova čez nekaj minut."
            : "Pošiljanje povpraševanja ni uspelo.",
        );
        return;
      }

      setSuccess(true);
      setForm(emptyForm);
      setHoneypot("");
    } catch {
      setError("Priprava povpraševanja ni uspela.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-[#08101f]" />

      <div className="container relative overflow-x-hidden">
        <FadeIn>
          <SectionTitle
            badge="Kontakt"
            title="Pogovorimo se o vašem projektu"
            description="Ne glede na to, ali potrebujete novo spletno stran, AI avtomatizacijo ali razvoj poslovnega sistema, smo pripravljeni pomagati."
          />
        </FadeIn>

        <div className="grid items-start gap-6 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-2">
            <Reveal>
              <div className="grid gap-4">
                {details.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 py-0 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-[250ms] hover:-translate-y-1 hover:border-green-400/40 hover:shadow-[0_20px_50px_rgba(34,197,94,0.18)]"
                    >
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                          <Icon className="h-7 w-7" aria-hidden />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[14px] font-medium text-green-400">
                            {item.title}
                          </p>
                          {"href" in item && item.href ? (
                            <a
                              href={item.href}
                              {...(item.href.startsWith("http")
                                ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  }
                                : {})}
                              className="whitespace-pre-line text-[16px] font-semibold text-white transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="whitespace-pre-line text-[16px] font-semibold text-white">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-3">
            <Reveal delay={0.12}>
              <form
              id="contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Kontaktni obrazec"
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label htmlFor="company-website">Spletna stran</label>
                <input
                  id="company-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="Podjetje (opcijsko)"
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
                  placeholder="Telefon (opcijsko)"
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
                  className={`${fieldClass} sm:col-span-2`}
                >
                  <option value="" className="bg-[#050816]">
                    Storitev
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
                <Textarea
                  required
                  rows={5}
                  placeholder="Sporočilo"
                  aria-label="Sporočilo"
                  value={form.message}
                  onChange={update("message")}
                  className={`${fieldClass} min-h-[132px] py-3 sm:col-span-2`}
                />
              </div>

              <div className="mt-6 flex justify-center sm:justify-start">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="h-11 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 text-[16px] font-semibold text-white shadow-lg shadow-green-600/30 transition duration-[250ms] hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-60"
                >
                  {loading ? "Pošiljam ..." : "Pošlji povpraševanje"}
                </Button>
              </div>

              {success ? (
                <p role="status" className="mt-4 text-[14px] text-green-400">
                  Povpraševanje je pripravljeno. Kmalu vas bomo kontaktirali.
                </p>
              ) : null}

              {error ? (
                <p role="alert" className="mt-4 text-[14px] text-red-400">
                  {error}
                </p>
              ) : null}

              <p className="mt-6 text-center text-[16px] font-medium tracking-wide text-green-400/90">
                Od ideje do izvedbe.
              </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
