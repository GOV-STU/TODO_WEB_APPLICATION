"""Message model for conversation history."""
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import Text
from datetime import datetime
from typing import Optional
from uuid import uuid4


class Message(SQLModel, table=True):
    """Message model for conversation history."""
    __tablename__ = "messages"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversations.id", index=True, nullable=False)
    role: str = Field(max_length=20, nullable=False)  # user, assistant, system
    content: str = Field(sa_column=Column(Text, nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Optional: Token tracking
    prompt_tokens: Optional[int] = Field(default=None)
    completion_tokens: Optional[int] = Field(default=None)
    total_tokens: Optional[int] = Field(default=None)

    # Optional: Metadata
    metadata_json: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
