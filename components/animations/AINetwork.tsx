"use client";

import { motion } from "framer-motion";

const nodes = [
  { x: "50%", y: "50%", size: 18 },
  { x: "22%", y: "22%", size: 10 },
  { x: "78%", y: "22%", size: 10 },
  { x: "22%", y: "78%", size: 10 },
  { x: "78%", y: "78%", size: 10 },
  { x: "50%", y: "12%", size: 8 },
  { x: "12%", y: "50%", size: 8 },
  { x: "88%", y: "50%", size: 8 },
  { x: "50%", y: "88%", size: 8 },
];

export default function AINetwork() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 rounded-full bg-green-500/10 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/35 blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {nodes.slice(1).map((node, index) => (
          <motion.line
            key={index}
            x1="50"
            y1="50"
            x2={parseFloat(node.x)}
            y2={parseFloat(node.y)}
            stroke="rgba(34,197,94,0.35)"
            strokeWidth="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>

      {nodes.map((node, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + index * 0.25,
          }}
          className="absolute rounded-full bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.8)]"
          style={{
            width: node.size,
            height: node.size,
            left: node.x,
            top: node.y,
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-green-500/40 bg-gradient-to-br from-green-500/20 to-black/60 text-center shadow-[0_0_80px_rgba(34,197,94,.35)] backdrop-blur-2xl sm:h-36 sm:w-36"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-green-300">
            JU-TAN
          </p>
          <p className="mt-1 text-sm font-black leading-tight text-green-300 sm:text-base">
            AI Control
            <br />
            Center
          </p>
        </div>
      </motion.div>
    </div>
  );
}
