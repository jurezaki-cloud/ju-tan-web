"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import {
  bookingEmployees,
  bookingServices,
  defaultEmployeeId,
  formatDay,
  isSlotOpen,
  timeSlots,
  upcomingWeekdays,
} from "@/lib/data/booking";

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-[16px] text-white outline-none transition placeholder:text-slate-500 focus-visible:border-green-500 md:text-[16px] light:border-slate-200 light:bg-white light:text-slate-900";

const chipBase =
  "min-h-11 rounded-xl border px-4 py-3 text-left text-[14px] transition duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500";

type Draft = {
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  name: string;
  email: string;
};

const emptyDraft: Draft = {
  serviceId: "",
  employeeId: defaultEmployeeId,
  date: "",
  time: "",
  name: "",
  email: "",
};

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => upcomingWeekdays(), []);
  const service = bookingServices.find((item) => item.id === draft.serviceId);
  const employee = bookingEmployees.find((item) => item.id === draft.employeeId);
  const team = bookingEmployees.filter((item) =>
    draft.serviceId ? item.services.includes(draft.serviceId) : true,
  );

  useEffect(() => {
    wizardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (step === 4) {
      window.requestAnimationFrame(() => nameRef.current?.focus());
    }
  }, [step]);

  const goNext = () => {
    setError("");
    if (step === 0 && !draft.serviceId) {
      setError("Izberite storitev.");
      return;
    }
    if (step === 1 && !draft.employeeId) {
      setError("Izberite svetovalca.");
      return;
    }
    if (step === 2 && !draft.date) {
      setError("Izberite datum.");
      return;
    }
    if (step === 3 && !draft.time) {
      setError("Izberite uro.");
      return;
    }
    setStep((current) => current + 1);
  };

  const confirm = async () => {
    setError("");
    if (!draft.name.trim()) {
      setError("Vnesite ime.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError("Vnesite veljaven e-poštni naslov.");
      return;
    }
    if (!service || !employee) {
      setError("Izberite storitev in svetovalca.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          email: draft.email.trim(),
          service: service.title,
          message: [
            "Rezervacija termina",
            `Svetovalec: ${employee.name}`,
            `Datum: ${formatDay(draft.date)}`,
            `Ura: ${draft.time}`,
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        setError(
          response.status === 429
            ? "Preveč poskusov. Poskusite znova čez nekaj minut."
            : response.status === 503
              ? "Pošiljanje trenutno ni na voljo. Pišite nam na e-pošto."
              : "Rezervacije ni bilo mogoče poslati.",
        );
        return;
      }

      setDone(true);
    } catch {
      setError("Rezervacije ni bilo mogoče poslati.");
    } finally {
      setLoading(false);
    }
  };

  if (done && service && employee) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-400/30 bg-white/5 px-6 py-12 text-center shadow-xl backdrop-blur-xl light:bg-white"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white"
        >
          <Check className="h-8 w-8" />
        </motion.div>
        <h3 className="font-heading text-[28px] font-semibold text-white light:text-slate-900">
          Termin je rezerviran
        </h3>
        <p className="mx-auto mt-3 max-w-md text-slate-300 light:text-slate-600">
          {service.title} s {employee.name}, {formatDay(draft.date)} ob {draft.time}.
          Potrditev pošljemo na {draft.email}.
        </p>
      </motion.div>
    );
  }

  return (
    <div
      ref={wizardRef}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-8 light:border-slate-200 light:bg-white"
    >
      <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.16em] text-green-400">
        Korak {step + 1} / 5
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {step === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {bookingServices.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${chipBase} ${
                    draft.serviceId === item.id
                      ? "border-green-400/60 bg-green-500/15 text-white"
                      : "border-white/10 bg-black/20 text-slate-200 hover:border-green-400/30 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
                  }`}
                  onClick={() => {
                    setError("");
                    setDraft((current) => ({
                      ...current,
                      serviceId: item.id,
                      employeeId: defaultEmployeeId,
                      time: "",
                    }));
                    setStep(1);
                  }}
                >
                  <span className="block font-semibold">{item.title}</span>
                  <span className="text-[12px] text-green-300">{item.duration}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            team.length === 0 ? (
              <p role="status" className="text-slate-400">
                Za to storitev trenutno ni razpoložljivega svetovalca.
              </p>
            ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {team.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${chipBase} ${
                    draft.employeeId === item.id
                      ? "border-green-400/60 bg-green-500/15 text-white"
                      : "border-white/10 bg-black/20 text-slate-200 hover:border-green-400/30 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
                  }`}
                  onClick={() => {
                    setError("");
                    setDraft((current) => ({ ...current, employeeId: item.id }));
                    setStep(2);
                  }}
                >
                  <span className="block font-semibold">{item.name}</span>
                  <span className="text-[12px] text-slate-400">{item.role}</span>
                </button>
              ))}
            </div>
            )
          ) : null}

          {step === 2 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {dates.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`${chipBase} ${
                    draft.date === day
                      ? "border-green-400/60 bg-green-500/15 text-white"
                      : "border-white/10 bg-black/20 text-slate-200 hover:border-green-400/30 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
                  }`}
                  onClick={() => {
                    setError("");
                    setDraft((current) => ({ ...current, date: day, time: "" }));
                    setStep(3);
                  }}
                >
                  {formatDay(day)}
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            timeSlots.every(
              (slot) => !isSlotOpen(draft.employeeId, draft.date, slot),
            ) ? (
              <p role="status" className="text-slate-400">
                Za izbrani dan ni prostih terminov. Izberite drug datum.
              </p>
            ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {timeSlots.map((slot) => {
                const open = isSlotOpen(draft.employeeId, draft.date, slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!open}
                    className={`${chipBase} disabled:cursor-not-allowed disabled:opacity-40 ${
                      draft.time === slot
                        ? "border-green-400/60 bg-green-500/15 text-white"
                        : "border-white/10 bg-black/20 text-slate-200 hover:border-green-400/30 light:border-slate-200 light:bg-slate-50 light:text-slate-800"
                    }`}
                    onClick={() => {
                      setError("");
                      setDraft((current) => ({ ...current, time: slot }));
                      setStep(4);
                    }}
                  >
                    {slot}
                    {open ? "" : " — zasedeno"}
                  </button>
                );
              })}
            </div>
            )
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-[15px] text-slate-200 light:border-slate-200 light:bg-slate-50 light:text-slate-800">
                <p>
                  <strong>Storitev:</strong> {service?.title}
                </p>
                <p>
                  <strong>Svetovalec:</strong> {employee?.name}
                </p>
                <p>
                  <strong>Termin:</strong> {draft.date ? formatDay(draft.date) : ""}{" "}
                  ob {draft.time}
                </p>
              </div>
              <input
                ref={nameRef}
                className={fieldClass}
                name="name"
                autoComplete="name"
                inputMode="text"
                enterKeyHint="next"
                placeholder="Ime in priimek"
                aria-label="Ime in priimek"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
              <input
                className={fieldClass}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                enterKeyHint="send"
                placeholder="E-pošta"
                aria-label="E-pošta"
                value={draft.email}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void confirm();
                  }
                }}
              />
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p role="alert" className="mt-4 min-h-5 text-[14px] text-red-400">
          {error}
        </p>
      ) : (
        <p className="mt-4 min-h-5" aria-hidden />
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap">
        {step > 0 ? (
          <button
            type="button"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white transition hover:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:w-auto light:text-slate-800"
            onClick={() => {
              setError("");
              setStep((current) => current - 1);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Nazaj
          </button>
        ) : null}
        {step < 4 ? (
          <button
            type="button"
            className="min-h-11 w-full rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30 sm:w-auto"
            onClick={goNext}
          >
            Nadaljuj
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            aria-busy={loading}
            className="min-h-11 w-full rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30 disabled:opacity-60 sm:w-auto"
            onClick={() => void confirm()}
          >
            {loading ? "Pošiljam ..." : "Potrdi rezervacijo"}
          </button>
        )}
      </div>
    </div>
  );
}
