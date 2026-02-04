"""Tool call audit log model."""
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import Text
from datetime import datetime
from typing import Optional
from uuid import uuid4


class ToolCall(SQLModel, table=True):
    """Tool call audit log."""
    __tablename__ = "tool_calls"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    message_id: str = Field(foreign_key="messages.id", index=True, nullable=False)
    tool_name: str = Field(max_length=100, nullable=False, index=True)
    input_json: str = Field(sa_column=Column(Text, nullable=False))
    output_json: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    status: str = Field(default="success", max_length=20)  # success, error
    started_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    duration_ms: Optional[int] = Field(default=None)
