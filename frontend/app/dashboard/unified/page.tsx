"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, ListTodo, Sparkles } from "lucide-react";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { api } from "@/lib/api";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "todos" | "chat" | "split";

export default function UnifiedDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  useEffect(() => {
    loadTasks();
  }, []);

  // Auto-switch to split view on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode("split");
      } else if (viewMode === "split") {
        setViewMode("todos");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

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
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(id);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task reopened"
      );
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex">
          <button
            onClick={() => setViewMode("todos")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              viewMode === "todos"
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <ListTodo className="h-4 w-4" />
            <span>Tasks</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                {pendingCount}
              </span>
            )}
            {viewMode === "todos" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
          <button
            onClick={() => setViewMode("chat")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              viewMode === "chat"
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Chat</span>
            {viewMode === "chat" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tasks Panel */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-300",
            viewMode === "chat" && "hidden lg:flex lg:w-1/2",
            viewMode === "todos" && "flex",
            viewMode === "split" && "lg:w-1/2"
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 lg:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
                    My Tasks
                  </h1>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    size="sm"
                    className="hidden lg:flex"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pendingCount} pending {pendingCount === 1 ? "task" : "tasks"}
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  variant={filter === "all" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="whitespace-nowrap"
                >
                  All Tasks
                </Button>
                <Button
                  variant={filter === "pending" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                  className="whitespace-nowrap"
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "completed" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className="whitespace-nowrap"
                >
                  Completed
                </Button>
              </div>

              {/* Task List */}
              <TaskList
                tasks={filteredTasks}
                loading={loading}
                onToggleComplete={handleToggleComplete}
                onTaskClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Divider (Desktop Only) */}
        {viewMode === "split" && (
          <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-800" />
        )}

        {/* Chat Panel */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-300",
            viewMode === "todos" && "hidden lg:flex lg:w-1/2",
            viewMode === "chat" && "flex",
            viewMode === "split" && "lg:w-1/2"
          )}
        >
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-shrink-0 p-4 lg:p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    AI Assistant
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your tasks with natural language
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow onTaskUpdate={loadTasks} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      {viewMode === "todos" && (
        <button
          onClick={() => setIsFormOpen(true)}
          aria-label="Add new task"
          className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-premium hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 z-40"
        >
          <Plus className="h-6 w-6 mx-auto" />
        </button>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />
    </div>
  );
}
