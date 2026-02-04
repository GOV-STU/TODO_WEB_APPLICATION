"""Cohere agent initialization and tool definitions."""
import cohere
from cohere import Tool, ToolParameterDefinitionsValue
from app.config import settings
from typing import Any, Dict, List
import asyncio
from functools import partial
from app.agents.prompts import SYSTEM_PROMPT


# Initialize Cohere client
cohere_client = cohere.Client(api_key=settings.COHERE_API_KEY)


# Tool definitions for Cohere using proper Tool objects
COHERE_TOOLS = [
    Tool(
        name="create_task",
        description="Create a new task for the user with title, optional description, priority, and due date",
        parameter_definitions={
            "title": ToolParameterDefinitionsValue(
                description="The task title (required)",
                type="str",
                required=True
            ),
            "description": ToolParameterDefinitionsValue(
                description="Optional task description",
                type="str",
                required=False
            ),
            "priority": ToolParameterDefinitionsValue(
                description="Task priority: low, medium, or high (default: medium)",
                type="str",
                required=False
            ),
            "due_date": ToolParameterDefinitionsValue(
                description="Due date in ISO format (YYYY-MM-DD) or null",
                type="str",
                required=False
            )
        }
    ),
    Tool(
        name="list_tasks",
        description="List all tasks for the user with optional filters",
        parameter_definitions={
            "status": ToolParameterDefinitionsValue(
                description="Filter by status: 'pending' (not completed) or 'completed'",
                type="str",
                required=False
            ),
            "priority": ToolParameterDefinitionsValue(
                description="Filter by priority: low, medium, or high",
                type="str",
                required=False
            )
        }
    ),
    Tool(
        name="get_task",
        description="Get details of a specific task by ID",
        parameter_definitions={
            "task_id": ToolParameterDefinitionsValue(
                description="The task ID",
                type="str",
                required=True
            )
        }
    ),
    Tool(
        name="update_task",
        description="Update task fields (title, description, priority, due_date, completed status)",
        parameter_definitions={
            "task_id": ToolParameterDefinitionsValue(
                description="The task ID to update",
                type="str",
                required=True
            ),
            "title": ToolParameterDefinitionsValue(
                description="New task title",
                type="str",
                required=False
            ),
            "description": ToolParameterDefinitionsValue(
                description="New task description",
                type="str",
                required=False
            ),
            "priority": ToolParameterDefinitionsValue(
                description="New priority: low, medium, or high",
                type="str",
                required=False
            ),
            "due_date": ToolParameterDefinitionsValue(
                description="New due date in ISO format (YYYY-MM-DD)",
                type="str",
                required=False
            ),
            "completed": ToolParameterDefinitionsValue(
                description="New completion status (true or false)",
                type="bool",
                required=False
            )
        }
    ),
    Tool(
        name="delete_task",
        description="Delete a task by ID",
        parameter_definitions={
            "task_id": ToolParameterDefinitionsValue(
                description="The task ID to delete",
                type="str",
                required=True
            )
        }
    ),
    Tool(
        name="toggle_task_complete",
        description="Toggle task completion status (mark as complete or incomplete)",
        parameter_definitions={
            "task_id": ToolParameterDefinitionsValue(
                description="The task ID to toggle",
                type="str",
                required=True
            )
        }
    )
]


def prepare_chat_history(messages: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Convert Message objects to Cohere chat history format.

    Args:
        messages: List of message dictionaries with 'role' and 'content'

    Returns:
        List of chat history in Cohere format
    """
    chat_history = []

    for msg in messages[:-1]:  # Exclude the current message
        role = "USER" if msg["role"] == "user" else "CHATBOT"
        chat_history.append({
            "role": role,
            "message": msg["content"]
        })

    return chat_history


def chat_with_agent(
    message: str,
    chat_history: List[Dict[str, str]],
    tool_executor: Any
) -> Dict[str, Any]:
    """
    Execute chat with Cohere agent and handle tool calls.

    Args:
        message: User message
        chat_history: Previous conversation history
        tool_executor: Function to execute tools

    Returns:
        Dictionary with response text and tool calls
    """
    tool_calls_made = []

    # Initial chat call with forced tool use
    response = cohere_client.chat(
        model=settings.COHERE_MODEL,
        message=message,
        chat_history=chat_history,
        tools=COHERE_TOOLS,
        # Remove preamble to let tool definitions guide behavior
        force_single_step=False,  # Allow tool calls in first response
        temperature=0.3  # Lower temperature for more deterministic tool use
    )

    # Handle tool execution - check for tool_calls existence, not finish_reason
    # In newer Cohere SDK, finish_reason can be COMPLETE even with tool calls
    while hasattr(response, 'tool_calls') and response.tool_calls:
        tool_results = []

        for tool_call in response.tool_calls:
            # Execute the tool
            tool_result = tool_executor(
                tool_name=tool_call.name,
                tool_input=tool_call.parameters
            )

            tool_calls_made.append({
                "tool_name": tool_call.name,
                "input": tool_call.parameters,
                "output": tool_result
            })

            tool_results.append({
                "call": tool_call,
                "outputs": [tool_result]
            })

        # Continue conversation with tool results
        response = cohere_client.chat(
            model=settings.COHERE_MODEL,
            message="",
            chat_history=response.chat_history,
            tools=COHERE_TOOLS,
            tool_results=tool_results
        )

    # Extract token information safely
    token_info = None
    if hasattr(response, 'meta') and hasattr(response.meta, 'tokens'):
        tokens = response.meta.tokens
        token_info = {
            "input_tokens": getattr(tokens, 'input_tokens', 0),
            "output_tokens": getattr(tokens, 'output_tokens', 0)
        }

    return {
        "text": response.text,
        "tool_calls": tool_calls_made,
        "token_count": token_info
    }


async def chat_with_agent_async(
    message: str,
    chat_history: List[Dict[str, str]],
    tool_executor: Any
) -> Dict[str, Any]:
    """
    Async wrapper for chat_with_agent.

    Args:
        message: User message
        chat_history: Previous conversation history
        tool_executor: Function to execute tools

    Returns:
        Dictionary with response text and tool calls
    """
    loop = asyncio.get_event_loop()
    func = partial(chat_with_agent, message, chat_history, tool_executor)
    return await loop.run_in_executor(None, func)
