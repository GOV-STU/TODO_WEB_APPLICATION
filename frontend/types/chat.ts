"""Chat-related TypeScript types."""

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  tool_calls?: ToolCallSummary[];
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

export interface ToolCallSummary {
  tool_name: string;
  status: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string | null;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  role: string;
  content: string;
  created_at: string;
  tool_calls: ToolCallSummary[];
}
