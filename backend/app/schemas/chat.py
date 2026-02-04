"""Chat API request and response schemas."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ChatRequest(BaseModel):
    """Schema for chat message request."""
    message: str = Field(min_length=1, max_length=5000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID (null for new conversation)")


class ToolCallSummary(BaseModel):
    """Summary of a tool call."""
    tool_name: str
    status: str


class ChatResponse(BaseModel):
    """Schema for chat message response."""
    conversation_id: str
    message_id: str
    role: str
    content: str
    created_at: datetime
    tool_calls: List[ToolCallSummary] = []

    model_config = {"from_attributes": True}


class MessageDetail(BaseModel):
    """Detailed message information."""
    id: str
    role: str
    content: str
    created_at: datetime
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    total_tokens: Optional[int] = None

    model_config = {"from_attributes": True}


class ConversationSummary(BaseModel):
    """Summary of a conversation."""
    id: str
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = {"from_attributes": True}


class ConversationDetail(BaseModel):
    """Detailed conversation with messages."""
    id: str
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageDetail]

    model_config = {"from_attributes": True}
