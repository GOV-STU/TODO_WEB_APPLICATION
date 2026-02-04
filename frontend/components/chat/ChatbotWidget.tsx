"use client";

import { useState } from "react";
import { X, Zap, Sparkles } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { motion, AnimatePresence } from "framer-motion";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-24 right-4 lg:bottom-4 lg:right-4 w-[calc(100vw-2rem)] lg:w-[420px] h-[600px] max-h-[calc(100vh-8rem)] lg:max-h-[700px] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Zap className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Neural AI Assistant
                    </h3>
                    <p className="text-xs text-purple-300/60">Online • Ready to assist</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-300 transition-all flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="h-[calc(100%-4rem)]">
                <ChatWindow onTaskUpdate={() => {
                  // Emit custom event to refresh tasks
                  window.dispatchEvent(new CustomEvent('taskUpdated'));
                }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 border-2 border-purple-400/30 z-40 group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-purple-500 animate-ping opacity-20" />
        </div>

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-7 w-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Zap className="h-7 w-7 text-white animate-pulse" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-cyan-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50"
          >
            <span className="text-[10px] font-bold text-white">AI</span>
          </motion.div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-24 px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20 backdrop-blur-sm pointer-events-none hidden lg:block"
        >
          <p className="text-sm text-purple-300 whitespace-nowrap">
            Need help? Ask our AI! 🤖
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-purple-500/30" />
          </div>
        </motion.div>
      )}
    </>
  );
}
