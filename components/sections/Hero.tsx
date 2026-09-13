"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center bg-[#050816] pt-32 text-white overflow-hidden">

      {/* Background glow */}
      <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-green-500/40 blur-3xl" />

      <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-red-500/30 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">

        <div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="max-w-4xl text-6xl font-black leading-tight md:text-8xl"
        >
          Gradimo prihodnost z
          <span className="block text-green-500">
            umetno inteligenco.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.3 }}
          className="mt-8 max-w-2xl text-xl leading-8 text-gray-300"
        >
          Razvijamo AI avtomatizacije, poslovno programsko opremo,
          moderne spletne strani, grafično oblikovanje,
          video produkcijo in IT infrastrukturo.
        </motion.p>

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:.5 }}
          className="mt-12 flex flex-wrap gap-5"
        >
          <button className="rounded-xl bg-green-600 px-8 py-4 font-semibold transition hover:bg-green-500">
            Začni projekt
          </button>

          <button className="rounded-xl border border-white/20 px-8 py-4 hover:bg-white/10">
            Naše storitve
          </button>
        </motion.div>

        <div className="mt-20 grid grid-cols-3 gap-10 max-w-3xl">

          <div>
            <h2 className="text-5xl font-black text-green-500">500+</h2>
            <p className="mt-2 text-gray-400">
              Zaključenih projektov
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-black text-green-500">50+</h2>
            <p className="mt-2 text-gray-400">
              Zadovoljnih strank
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-black text-green-500">10+</h2>
            <p className="mt-2 text-gray-400">
              Let izkušenj
            </p>
          </div>

        </div>
        </div>

        <div className="relative hidden h-[600px] lg:block">

          <div className="absolute inset-0 rounded-full bg-green-500/10 blur-3xl"></div>

          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/40"></div>

          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/30"></div>

          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/20"></div>

          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 shadow-[0_0_60px_20px_rgba(34,197,94,0.8)]"></div>

        </div>

      </div>

    </section>
  );
}