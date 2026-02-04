"""Chat API endpoints."""
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.api.deps import SessionDep, CurrentUserDep
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationSummary,
    ConversationDetail,
    MessageDetail,
    ToolCallSummary
)
from app.services import chat_service
from app.agents.todo_agent import chat_with_agent_async, prepare_chat_history
from app.tools.task_tools import execute_tool
from functools import partial
import time


router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> ChatResponse:
    """Send a chat message and receive AI response."""

    # Get or create conversation
    if request.conversation_id:
        conversation = chat_service.get_conversation(
            session, request.conversation_id, current_user_id
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        # Create new conversation with title from first message
        title = request.message[:50] + "..." if len(request.message) > 50 else request.message
        conversation = chat_service.create_conversation(
            session, current_user_id, title
        )

    # Save user message
    user_message = chat_service.save_message(
        session=session,
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )

    # Load conversation history
    history_messages = chat_service.get_conversation_history(
        session, conversation.id, limit=20
    )

    # Prepare chat history for Cohere
    chat_history = prepare_chat_history([
        {"role": msg.role, "content": msg.content}
        for msg in history_messages
    ])

    # Create tool executor with session and user_id
    def tool_executor(tool_name: str, tool_input: dict):
        return execute_tool(tool_name, tool_input, session, current_user_id)

    try:
        # Call agent with tool execution
        agent_response = await chat_with_agent_async(
            message=request.message,
            chat_history=chat_history,
            tool_executor=tool_executor
        )

        # Extract token counts safely
        token_count = agent_response.get("token_count")
        prompt_tokens = None
        completion_tokens = None
        total_tokens = None

        if token_count and isinstance(token_count, dict):
            prompt_tokens = token_count.get("input_tokens")
            completion_tokens = token_count.get("output_tokens")
            if prompt_tokens and completion_tokens:
                total_tokens = prompt_tokens + completion_tokens

        # Save assistant message
        assistant_message = chat_service.save_message(
            session=session,
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response["text"],
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens
        )

        # Save tool calls
        tool_call_summaries = []
        for tool_call in agent_response.get("tool_calls", []):
            chat_service.save_tool_call(
                session=session,
                message_id=assistant_message.id,
                tool_name=tool_call["tool_name"],
                input_data=tool_call["input"],
                output_data=tool_call["output"],
                status="success" if tool_call["output"].get("success") else "error"
            )
            tool_call_summaries.append(
                ToolCallSummary(
                    tool_name=tool_call["tool_name"],
                    status="success" if tool_call["output"].get("success") else "error"
                )
            )

        return ChatResponse(
            conversation_id=conversation.id,
            message_id=assistant_message.id,
            role="assistant",
            content=agent_response["text"],
            created_at=assistant_message.created_at,
            tool_calls=tool_call_summaries
        )

    except Exception as e:
        # Save error message
        error_message = f"I encountered an error: {str(e)}"
        assistant_message = chat_service.save_message(
            session=session,
            conversation_id=conversation.id,
            role="assistant",
            content=error_message
        )

        return ChatResponse(
            conversation_id=conversation.id,
            message_id=assistant_message.id,
            role="assistant",
            content=error_message,
            created_at=assistant_message.created_at,
            tool_calls=[]
        )


@router.get("/conversations", response_model=List[ConversationSummary])
def list_user_conversations(
    session: SessionDep,
    current_user_id: CurrentUserDep,
    skip: int = 0,
    limit: int = 100
) -> List[ConversationSummary]:
    """List all conversations for the authenticated user."""
    conversations = chat_service.list_conversations(
        session, current_user_id, skip, limit
    )

    # Add message count for each conversation
    result = []
    for conv in conversations:
        messages = chat_service.get_conversation_history(session, conv.id, limit=1000)
        result.append(
            ConversationSummary(
                id=conv.id,
                title=conv.title,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
                message_count=len(messages)
            )
        )

    return result


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation_with_messages(
    conversation_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> ConversationDetail:
    """Get a conversation with all messages."""
    conversation = chat_service.get_conversation(
        session, conversation_id, current_user_id
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    messages = chat_service.get_conversation_history(session, conversation_id)

    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[
            MessageDetail(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at,
                prompt_tokens=msg.prompt_tokens,
                completion_tokens=msg.completion_tokens,
                total_tokens=msg.total_tokens
            )
            for msg in messages
        ]
    )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_conversation(
    conversation_id: str,
    session: SessionDep,
    current_user_id: CurrentUserDep
) -> None:
    """Delete a conversation."""
    success = chat_service.delete_conversation(
        session, conversation_id, current_user_id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
