"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CreateTaskDto, UpdateTaskDto, Task } from "@/types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
  task?: Task;
  mode?: "create" | "edit";
}

const priorityOptions: SelectOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode = "create",
}: TaskFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate || "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority as "low" | "medium" | "high",
        dueDate: formData.dueDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Task" : "Edit Task"}
      description={
        mode === "create"
          ? "Add a new task to your list"
          : "Update task details"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          error={errors.title}
          placeholder="Enter task title"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add more details (optional)"
          rows={4}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => setFormData({ ...formData, priority: value as "low" | "medium" | "high" })}
        />

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          placeholder="Select due date (optional)"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
          >
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
