"use client";

import { motion } from "framer-motion";
import { ArrowRight, FolderOpen } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <motion.a
        href="#contact"
        aria-label="Oddajte povpraševanje za brezplačen posvet"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition duration-[250ms] hover:shadow-xl hover:shadow-green-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        Brezplačen posvet
        <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
      </motion.a>

      <motion.a
        href="#projects"
        aria-label="Oglej si projekte JU-TAN"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white shadow-md shadow-black/20 backdrop-blur-sm transition duration-[250ms] hover:border-green-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        Oglej si projekte
        <FolderOpen
          className="transition-transform duration-[250ms] group-hover:scale-110"
          size={20}
        />
      </motion.a>
    </div>
  );
}
