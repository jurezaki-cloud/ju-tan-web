"use client";

import { motion } from "framer-motion";
import { ArrowRight, FolderOpen } from "lucide-react";
import AINetwork from "@/components/animations/AINetwork";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-36 lg:pt-44">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-green-500/40 blur-3xl" />

      <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-red-500/30 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[85vh] max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        <div>
        <div className="mb-6 inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold tracking-widest uppercase text-green-400">
          AI • Software • Automation
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-6xl font-black leading-[1.05] tracking-tight md:text-8xl"
        >
          AI rešitve,
          <br />
          ki spreminjajo
          <br />
          <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-300 bg-clip-text text-transparent">
            vaše poslovanje.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.3 }}
          className="mt-8 max-w-2xl text-xl leading-8 text-gray-300"
        >
          Razvijamo umetno inteligenco, avtomatizacije, poslovno
          programsko opremo, spletne aplikacije in IT infrastrukturo,
          ki podjetjem prihranijo čas, zmanjšajo stroške ter
          pospešijo rast.
        </motion.p>

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:.5 }}
          className="mt-12 flex flex-wrap gap-5"
        >
          <a
            href="#contact"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:shadow-green-500/50"
          >
            Brezplačen posvet
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </a>
          <button className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-white/10">
            Oglej si projekte
            <FolderOpen className="transition-transform group-hover:scale-110" size={20} />
          </button>
        </motion.div>

        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-4xl font-black text-green-500">500+</h2>
            <p className="mt-2 text-gray-400">Zaključenih projektov</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-4xl font-black text-green-500">50+</h2>
            <p className="mt-2 text-gray-400">Zadovoljnih strank</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-4xl font-black text-green-500">10+</h2>
            <p className="mt-2 text-gray-400">Let izkušenj</p>
          </div>
        </div>
        </div>

        <AINetwork />

      </div>

    </section>
  );
}