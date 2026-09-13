"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Cloud,
  ShieldCheck,
  Cpu,
  Workflow,
} from "lucide-react";

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

function GlassCard({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        repeat: Infinity,
        duration: 4,
      }}
      className={`absolute rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl shadow-2xl ${className}`}
    >
      <div className="mb-2 text-green-400">{icon}</div>
      <h3 className="font-semibold text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-400">
        {subtitle}
      </p>
    </motion.div>
  );
}

export default function AINetwork() {
  return (
    <div className="relative h-[600px] w-full">

      {/* Glow */}

      <div className="absolute inset-0 rounded-full bg-green-500/10 blur-[120px]" />

      {/* Connections */}

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

      {/* Nodes */}

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

      {/* Center */}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-green-500/40 bg-gradient-to-br from-green-500/20 to-black/60 text-2xl font-black text-green-300 backdrop-blur-2xl shadow-[0_0_80px_rgba(34,197,94,.35)]"
      >
        AI
      </motion.div>

      <GlassCard
        icon={<Bot size={24} />}
        title="AI Agent"
        subtitle="24/7 avtomatizacija"
        className="left-0 top-10"
      />
      <GlassCard
        icon={<Workflow size={24} />}
        title="Automation"
        subtitle="Pametni procesi"
        className="right-0 top-24"
      />
      <GlassCard
        icon={<Cloud size={24} />}
        title="Cloud"
        subtitle="Visoka razpoložljivost"
        className="left-10 bottom-20"
      />
      <GlassCard
        icon={<ShieldCheck size={24} />}
        title="Cyber Security"
        subtitle="Enterprise Ready"
        className="right-10 bottom-10"
      />
      <GlassCard
        icon={<Cpu size={24} />}
        title="Software"
        subtitle="Custom Development"
        className="left-1/2 top-0 -translate-x-1/2"
      />

    </div>
  );
}
