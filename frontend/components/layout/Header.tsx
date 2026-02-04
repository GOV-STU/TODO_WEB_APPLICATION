"use client";

import Link from "next/link";
import { Search, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileSidebar } from "./MobileSidebar";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { Neural3D } from "@/components/ui/Neural3D";

export function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = auth.getCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3 md:gap-8">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden w-9 h-9 p-0 -ml-2 text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/30 group-hover:shadow-cyan-500/50 transition-all">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm md:text-base bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                    TO DO WEB
                  </span>
                  <span className="font-bold text-xs md:text-sm bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight -mt-0.5">
                    APPLICATION
                  </span>
                </div>
              </Link>

              {/* 3D Neural Network Animation - Desktop XL+ */}
              <div className="hidden xl:flex items-center">
                <Neural3D />
              </div>

              {/* Search - Desktop */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/60" />
                  <input
                    type="text"
                    placeholder="Search neural database..."
                    aria-label="Search tasks"
                    className="w-64 xl:w-80 h-9 pl-9 pr-4 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-sm text-cyan-100 placeholder:text-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* User Info - Desktop */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-cyan-500/30">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/30">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm text-cyan-100 font-medium">{user?.name || "Commander"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </>
  );
}
