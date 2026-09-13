"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Reveal } from "@/components/animations";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

    if (form.message.trim().length < 10) {
      setError("Sporočilo mora vsebovati vsaj 10 znakov.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setError("Pri pošiljanju je prišlo do napake.");
      }
    } catch {
      setError("Napaka strežnika.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-[#050816] to-[#08101f] py-32"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">

        <FadeIn>
          <SectionTitle
            badge="Kontakt"
            title="Začnimo vaš naslednji projekt"
            description="Povejte nam svojo idejo. Skupaj bomo ustvarili rešitev."
          />
        </FadeIn>

        <Reveal delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
          >
            <div className="grid gap-8 md:grid-cols-2">

              <input
                required
                autoComplete="name"
                placeholder="Ime"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-green-500"
              />

              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-green-500"
              />

            </div>

            <textarea
              required
              minLength={10}
              rows={6}
              placeholder="Vaše sporočilo..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="mt-8 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-green-500"
            />

            <div className="mt-10 flex justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Pošiljam..." : "Pošlji povpraševanje"}
              </Button>
            </div>

            {success && (
              <p className="mt-6 text-center text-green-400">
                ✅ Povpraševanje je bilo uspešno poslano.
              </p>
            )}

            {error && (
              <p className="mt-6 text-center text-red-400">
                {error}
              </p>
            )}

          </form>
        </Reveal>

      </div>
    </section>
  );
}