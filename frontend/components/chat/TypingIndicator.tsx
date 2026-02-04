"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 relative">
        <Zap className="h-4 w-4 text-white animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse opacity-20" />
      </div>

      {/* Typing Animation */}
      <div className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg shadow-purple-500/10">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-sm shadow-purple-500/50"
              animate={{
                y: [0, -6, 0],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
