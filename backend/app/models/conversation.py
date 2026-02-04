"""Conversation model for chat sessions."""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4


class Conversation(SQLModel, table=True):
    """Conversation model for chat sessions."""
    __tablename__ = "conversations"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    title: Optional[str] = Field(default=None, max_length=200)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
