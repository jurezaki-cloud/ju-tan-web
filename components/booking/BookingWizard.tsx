"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import {
  bookingEmployees,
  bookingServices,
  formatDay,
  isSlotOpen,
  timeSlots,
  upcomingWeekdays,
} from "@/lib/data/booking";

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-[16px] text-white outline-none transition placeholder:text-slate-500 focus-visible:border-green-500 light:border-slate-200 light:bg-white light:text-slate-900";

const chipBase =
  "rounded-xl border px-4 py-3 text-left text-[14px] transition duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500";

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
  employeeId: "",
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

  const dates = useMemo(() => upcomingWeekdays(), []);
  const service = bookingServices.find((item) => item.id === draft.serviceId);
  const employee = bookingEmployees.find((item) => item.id === draft.employeeId);
  const team = bookingEmployees.filter((item) =>
    draft.serviceId ? item.services.includes(draft.serviceId) : true,
  );

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

  const confirm = () => {
    setError("");
    if (!draft.name.trim()) {
      setError("Vnesite ime.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError("Vnesite veljaven e-poštni naslov.");
      return;
    }
    setDone(true);
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-8 light:border-slate-200 light:bg-white">
      <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.16em] text-green-400">
        Korak {step + 1} / 5
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
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
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      serviceId: item.id,
                      employeeId: "",
                      time: "",
                    }))
                  }
                >
                  <span className="block font-semibold">{item.title}</span>
                  <span className="text-[12px] text-green-300">{item.duration}</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
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
                  onClick={() =>
                    setDraft((current) => ({ ...current, employeeId: item.id }))
                  }
                >
                  <span className="block font-semibold">{item.name}</span>
                  <span className="text-[12px] text-slate-400">{item.role}</span>
                </button>
              ))}
            </div>
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
                  onClick={() =>
                    setDraft((current) => ({ ...current, date: day, time: "" }))
                  }
                >
                  {formatDay(day)}
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
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
                    onClick={() =>
                      setDraft((current) => ({ ...current, time: slot }))
                    }
                  >
                    {slot}
                    {open ? "" : " — zasedeno"}
                  </button>
                );
              })}
            </div>
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
                className={fieldClass}
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
                placeholder="E-pošta"
                aria-label="E-pošta"
                value={draft.email}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p role="alert" className="mt-4 text-[14px] text-red-400">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white transition hover:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 light:text-slate-800"
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
            className="rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30"
            onClick={goNext}
          >
            Nadaljuj
          </button>
        ) : (
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30"
            onClick={confirm}
          >
            Potrdi rezervacijo
          </button>
        )}
      </div>
    </div>
  );
}
