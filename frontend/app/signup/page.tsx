"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { auth } from "@/lib/auth";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await auth.signup(formData.name, formData.email, formData.password);
      toast.success("Neural interface initialized!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Initialization failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Robotic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
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
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/30">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block">
                NEURAL TASK
              </span>
              <span className="text-xs text-cyan-300/60">AI-Powered System</span>
            </div>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Initialize Neural Interface
            </h1>
            <p className="text-sm text-cyan-300/60">
              Create your neural system account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Commander Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@neural.system"
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Access Code
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20 text-white font-medium py-3"
              disabled={loading}
            >
              {loading ? "Initializing..." : "Initialize System"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-cyan-300/60">
              Already connected?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Access System
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-purple-900/20 backdrop-blur-sm rounded-lg border border-purple-500/30">
          <p className="text-xs text-purple-300 font-medium mb-2 flex items-center gap-2">
            <Lock className="h-3 w-3" />
            Secure Neural Connection
          </p>
          <p className="text-xs text-purple-400/80">
            Your data is encrypted with quantum-level security protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
