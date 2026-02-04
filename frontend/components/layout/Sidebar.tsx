"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckCircle2, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "All Missions", href: "/dashboard", icon: Home, color: "cyan" },
  { name: "Today", href: "/dashboard/today", icon: Calendar, color: "blue" },
  { name: "Completed", href: "/dashboard/completed", icon: CheckCircle2, color: "purple" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
      {/* Branding */}
      <div className="px-4 py-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              TODO MANAGEMENT
            </span>
            <span className="font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight -mt-0.5">
              SYSTEM
            </span>
            <span className="text-[10px] text-cyan-300/60">v2.0.1</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const colorClasses = {
            cyan: {
              active: "bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/20",
              inactive: "text-cyan-300/60 hover:bg-cyan-500/10 hover:text-cyan-300 border-l-4 border-transparent"
            },
            blue: {
              active: "bg-blue-500/20 text-blue-300 border-l-4 border-blue-400 shadow-lg shadow-blue-500/20",
              inactive: "text-blue-300/60 hover:bg-blue-500/10 hover:text-blue-300 border-l-4 border-transparent"
            },
            purple: {
              active: "bg-purple-500/20 text-purple-300 border-l-4 border-purple-400 shadow-lg shadow-purple-500/20",
              inactive: "text-purple-300/60 hover:bg-purple-500/10 hover:text-purple-300 border-l-4 border-transparent"
            },
            pink: {
              active: "bg-pink-500/20 text-pink-300 border-l-4 border-pink-400 shadow-lg shadow-pink-500/20",
              inactive: "text-pink-300/60 hover:bg-pink-500/10 hover:text-pink-300 border-l-4 border-transparent"
            }
          };

          const colors = colorClasses[item.color as keyof typeof colorClasses];

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? colors.active : colors.inactive
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-cyan-500/20 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-300/60 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200 border-l-4 border-transparent"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <button
          onClick={() => {
            // Mock logout
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300/60 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border-l-4 border-transparent"
        >
          <LogOut className="h-5 w-5" />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
