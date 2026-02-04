"use client";

import Link from "next/link";
import { Zap, Shield, Cpu, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ChatbotWidget } from "@/components/chat/ChatbotWidget";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Robotic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        <ParticleBackground />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        {/* Glowing Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-32 animate-scan" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 border border-cyan-400/30">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                NEURAL TASK
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent block mt-2">
                Management System v2.0
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-cyan-100/80 mb-8 max-w-3xl mx-auto">
              AI-powered task orchestration with quantum-level security protocols.
              <br />
              <span className="text-cyan-300/60">Your neural interface to productivity.</span>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">99.9%</div>
                <div className="text-xs text-cyan-300/60">Uptime</div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">&lt;50ms</div>
                <div className="text-xs text-cyan-300/60">Response</div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">10K+</div>
                <div className="text-xs text-cyan-300/60">Users</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/30 text-white font-medium px-8 py-4 text-lg"
                >
                  Initialize System
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-medium px-8 py-4 text-lg backdrop-blur-xl"
                >
                  Access System
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Neural System Features
              </h2>
              <p className="text-lg text-cyan-300/60 max-w-2xl mx-auto">
                Advanced capabilities designed for maximum productivity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="group bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">
                  AI-Powered Intelligence
                </h3>
                <p className="text-sm text-cyan-300/60">
                  Neural network-driven task management with predictive analytics and smart automation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">
                  Quantum Security
                </h3>
                <p className="text-sm text-cyan-300/60">
                  Military-grade encryption with quantum-resistant protocols protecting your data.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">
                  Lightning Performance
                </h3>
                <p className="text-sm text-cyan-300/60">
                  Sub-50ms response times with distributed edge computing architecture.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2">
                  Neural Interface
                </h3>
                <p className="text-sm text-cyan-300/60">
                  Intuitive command system with natural language processing and voice control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-12 text-center shadow-2xl shadow-cyan-500/20">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Ready to Initialize?
              </h2>
              <p className="text-lg text-cyan-300/60 mb-8 max-w-2xl mx-auto">
                Join the neural network. Experience the future of task management.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-cyan-100">Instant activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-cyan-100">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-cyan-100">Full feature access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-cyan-100">24/7 neural support</span>
                </div>
              </div>

              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/30 text-white font-medium px-8 py-4 text-lg"
                >
                  Initialize Neural Interface
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-cyan-300/40">
              © 2026 Neural Task Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </main>
  );
}
