"use client";

import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggleComplete?: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskList({
  tasks,
  loading,
  onToggleComplete,
  onTaskClick,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return <LoadingSkeleton count={5} />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onClick={() => onTaskClick?.(task)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
