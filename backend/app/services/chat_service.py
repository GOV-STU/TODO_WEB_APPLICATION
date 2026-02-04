"""Chat service for conversation and message management."""
from sqlmodel import Session, select
from datetime import datetime
from typing import Optional, List
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.tool_call import ToolCall
import json


def create_conversation(
    session: Session,
    user_id: str,
    title: Optional[str] = None
) -> Conversation:
    """Create a new conversation."""
    conversation = Conversation(
        user_id=user_id,
        title=title or "New Conversation"
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversation(
    session: Session,
    conversation_id: str,
    user_id: str
) -> Optional[Conversation]:
    """Get a conversation by ID with ownership validation."""
    conversation = session.get(Conversation, conversation_id)

    if not conversation:
        return None

    # Validate ownership
    if conversation.user_id != user_id:
        return None

    return conversation


def list_conversations(
    session: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[Conversation]:
    """List all conversations for a user."""
    statement = (
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .offset(skip)
        .limit(limit)
    )
    conversations = session.exec(statement).all()
    return list(conversations)


def delete_conversation(
    session: Session,
    conversation_id: str,
    user_id: str
) -> bool:
    """Delete a conversation with ownership validation."""
    conversation = get_conversation(session, conversation_id, user_id)

    if not conversation:
        return False

    session.delete(conversation)
    session.commit()
    return True


def save_message(
    session: Session,
    conversation_id: str,
    role: str,
    content: str,
    prompt_tokens: Optional[int] = None,
    completion_tokens: Optional[int] = None,
    total_tokens: Optional[int] = None,
    metadata: Optional[dict] = None
) -> Message:
    """Save a message to a conversation."""
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total_tokens,
        metadata_json=json.dumps(metadata) if metadata else None
    )
    session.add(message)
    session.commit()
    session.refresh(message)

    # Update conversation updated_at
    conversation = session.get(Conversation, conversation_id)
    if conversation:
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)
        session.commit()

    return message


def get_conversation_history(
    session: Session,
    conversation_id: str,
    limit: int = 100
) -> List[Message]:
    """Get conversation message history."""
    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .limit(limit)
    )
    messages = session.exec(statement).all()
    return list(messages)


def save_tool_call(
    session: Session,
    message_id: str,
    tool_name: str,
    input_data: dict,
    output_data: dict,
    status: str = "success",
    duration_ms: Optional[int] = None
) -> ToolCall:
    """Save a tool call audit record."""
    tool_call = ToolCall(
        message_id=message_id,
        tool_name=tool_name,
        input_json=json.dumps(input_data),
        output_json=json.dumps(output_data),
        status=status,
        duration_ms=duration_ms
    )
    session.add(tool_call)
    session.commit()
    session.refresh(tool_call)
    return tool_call


def update_conversation_title(
    session: Session,
    conversation_id: str,
    title: str
) -> Optional[Conversation]:
    """Update conversation title."""
    conversation = session.get(Conversation, conversation_id)

    if not conversation:
        return None

    conversation.title = title
    conversation.updated_at = datetime.utcnow()
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation
