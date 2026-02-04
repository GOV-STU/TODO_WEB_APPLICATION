"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { api } from "@/lib/api";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { CelebrationModal } from "@/components/ui/CelebrationModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [showCelebration, setShowCelebration] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    taskId: string | null;
  }>({ isOpen: false, taskId: null });

  useEffect(() => {
    loadTasks();

    // Listen for task updates from chatbot
    const handleTaskUpdate = () => {
      loadTasks();
    };

    window.addEventListener('taskUpdated', handleTaskUpdate);
    return () => window.removeEventListener('taskUpdated', handleTaskUpdate);
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getAllTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      const newTask = await api.createTask(data as CreateTaskDto);
      setTasks([newTask, ...tasks]);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(id);
      const updatedTasks = tasks.map((task) => (task.id === id ? updatedTask : task));
      setTasks(updatedTasks);

      toast.success(
        updatedTask.completed ? "Task completed!" : "Task reopened"
      );

      // Check if all tasks are completed
      const allCompleted = updatedTasks.every((task) => task.completed);
      if (allCompleted && updatedTasks.length > 0) {
        setShowCelebration(true);
      }
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("Task deleted successfully!");
      setDeleteConfirm({ isOpen: false, taskId: null });
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleTaskClick = (task: Task) => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="w-full pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Neural Task Dashboard
          </h1>
          <p className="text-sm md:text-base text-cyan-200 font-medium">
            {tasks.filter((t) => !t.completed).length} active missions
          </p>
        </div>

        {/* Add Task Button */}
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20 text-white font-medium whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task Manually
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        <Button
          variant={filter === "all" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className={cn(
            "whitespace-nowrap",
            filter === "all"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
              : "border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          )}
        >
          All
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("pending")}
          className={cn(
            "whitespace-nowrap",
            filter === "pending"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
              : "border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          )}
        >
          Pending
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("completed")}
          className={cn(
            "whitespace-nowrap",
            filter === "completed"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
              : "border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          )}
        >
          Completed
        </Button>
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onTaskClick={handleTaskClick}
        onDelete={(id) => setDeleteConfirm({ isOpen: true, taskId: id })}
      />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, taskId: null })}
        onConfirm={() => {
          if (deleteConfirm.taskId) {
            handleDeleteTask(deleteConfirm.taskId);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
