"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative pointer-events-auto">
              {/* Fire Ring Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12;
                  const radius = 150;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;

                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0.8],
                        y: [0, -20, -40],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <Flame className="h-8 w-8 text-orange-500" fill="currentColor" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Center Content */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-2 border-cyan-400/50 rounded-2xl p-8 shadow-2xl shadow-cyan-500/50 backdrop-blur-xl">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-yellow-400 blur-xl"
                    />
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                    🎉 Mission Complete! 🎉
                  </h2>
                  <p className="text-lg text-cyan-100/80 mb-2">
                    All tasks are completed!
                  </p>
                  <p className="text-sm text-purple-300/60">
                    Outstanding work, Commander! 🚀
                  </p>
                </motion.div>

                {/* Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: [0, -50],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Close Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
