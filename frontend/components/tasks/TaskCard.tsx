"use client";

import { motion } from "framer-motion";
import { Calendar, Flag, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onClick, onDelete }: TaskCardProps) {
  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-cyan-500",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative p-4 md:p-4 rounded-lg border-l-4 transition-all duration-200 ease-premium cursor-pointer touch-manipulation",
        "bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30",
        "shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 active:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
        priorityColors[task.priority],
        task.completed && "opacity-60"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Task: ${task.title}. ${task.completed ? "Completed" : "Pending"}. Priority: ${task.priority}.`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="touch-manipulation"
        >
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete?.(task.id)}
            aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-base font-medium text-cyan-100 mb-1 break-words",
              task.completed && "line-through text-cyan-400/60"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-cyan-300/60 mb-2 line-clamp-2 break-words">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={task.priority} size="sm">
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-cyan-300/60">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
