import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface BackendTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Merge with any additional headers from options
    if (options?.headers) {
      const optionsHeaders = new Headers(options.headers);
      optionsHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          window.location.href = "/login";
        }
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
      }

      // Handle 204 No Content responses immediately
      if (response.status === 204) {
        return undefined as T;
      }

      // Parse response body
      const contentType = response.headers.get("content-type");
      let responseData: any;

      if (contentType && contentType.includes("application/json")) {
        // Handle case where JSON response might be empty (like some 204 responses that have content-type but no body)
        const text = await response.text();

        // If body is empty, treat as 204 No Content
        if (!text.trim()) {
          if (response.ok) {
            return undefined as T;
          }
          throw new ApiError(
            response.status,
            "UNKNOWN_ERROR",
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        // Parse the JSON text
        try {
          responseData = JSON.parse(text);
        } catch (parseError) {
          throw new ApiError(
            response.status,
            "PARSE_ERROR",
            `Failed to parse JSON response: ${parseError}`
          );
        }
      } else {
        // Handle non-JSON responses
        if (response.ok) {
          return undefined as T;
        }
        throw new ApiError(
          response.status,
          "UNKNOWN_ERROR",
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Handle error responses from auth endpoints (HTTP error status)
      if (!response.ok) {
        const error = responseData.error || {
          code: "UNKNOWN_ERROR",
          message: `HTTP ${response.status}: ${response.statusText}`,
        };

        throw new ApiError(
          response.status,
          error.code,
          error.message,
          error.details
        );
      }

      // Handle auth response format (wrapped in {success: true, data: ...})
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        if (!responseData.success) {
          const error = responseData.error || {
            code: "UNKNOWN_ERROR",
            message: "Request failed",
          };
          throw new ApiError(
            response.status,
            error.code,
            error.message,
            error.details
          );
        }
        return responseData.data as T;
      }

      // Handle direct response format (task endpoints return raw data/arrays)
      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network errors or other fetch errors
      throw new ApiError(
        0,
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  // Convert snake_case backend response to camelCase frontend format
  private mapBackendTaskToFrontend(backendTask: BackendTask): Task {
    return {
      id: backendTask.id,
      title: backendTask.title,
      description: backendTask.description,
      completed: backendTask.completed,
      priority: backendTask.priority,
      dueDate: backendTask.due_date,
      userId: backendTask.user_id,
      createdAt: backendTask.created_at,
      updatedAt: backendTask.updated_at,
    };
  }

  // Convert camelCase frontend request to snake_case backend format
  private mapFrontendTaskToBackend(
    frontendTask: CreateTaskDto | UpdateTaskDto
  ): any {
    const backendTask: any = {};

    if ("title" in frontendTask && frontendTask.title !== undefined) {
      backendTask.title = frontendTask.title;
    }
    if ("description" in frontendTask && frontendTask.description !== undefined) {
      backendTask.description = frontendTask.description;
    }
    if ("priority" in frontendTask && frontendTask.priority !== undefined) {
      backendTask.priority = frontendTask.priority;
    }
    if ("dueDate" in frontendTask && frontendTask.dueDate !== undefined) {
      backendTask.due_date = frontendTask.dueDate;
    }
    if ("completed" in frontendTask && frontendTask.completed !== undefined) {
      backendTask.completed = frontendTask.completed;
    }

    return backendTask;
  }

  async getAllTasks(): Promise<Task[]> {
    const backendTasks = await this.request<BackendTask[]>("/api/tasks");
    return backendTasks.map((task) => this.mapBackendTaskToFrontend(task));
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const backendTask = await this.request<BackendTask>(`/api/tasks/${id}`);
      return this.mapBackendTaskToFrontend(backendTask);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const backendData = this.mapFrontendTaskToBackend(data);
    const backendTask = await this.request<BackendTask>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
    return this.mapBackendTaskToFrontend(backendTask);
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const backendData = this.mapFrontendTaskToBackend(data);
    const backendTask = await this.request<BackendTask>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    });
    return this.mapBackendTaskToFrontend(backendTask);
  }

  async deleteTask(id: string): Promise<void> {
    await this.request<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    const backendTask = await this.request<BackendTask>(
      `/api/tasks/${id}/complete`,
      {
        method: "PATCH",
      }
    );
    return this.mapBackendTaskToFrontend(backendTask);
  }

  // Chat API
  async sendChatMessage(
    content: string,
    conversationId?: string | null
  ): Promise<{
    message_id: string;
    role: string;
    content: string;
    created_at: string;
    conversation_id: string;
    tool_calls?: Array<{
      tool_name: string;
      status: string;
    }>;
  }> {
    const payload: any = { message: content };
    if (conversationId) {
      payload.conversation_id = conversationId;
    }

    return this.request("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();
export { ApiError };
