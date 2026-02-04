# Cohere Tool Schemas

**Feature**: 001-ai-chat-integration
**Date**: 2026-02-03
**Format**: Cohere Tool Definitions

## Overview

This document defines the tool schemas for the Cohere AI agent. These tools enable the agent to perform task management operations on behalf of the user.

**Important**: All tools enforce user isolation. The `user_id` is automatically injected from the authenticated JWT token and is NOT a parameter the agent can specify.

---

## Tool Definitions

### 1. create_task

**Description**: Create a new task for the user.

**Cohere Schema**:
```python
{
    "name": "create_task",
    "description": "Create a new task for the user. Use this when the user wants to add a task to their todo list.",
    "parameter_definitions": {
        "title": {
            "description": "The task title (required). Should be clear and concise.",
            "type": "str",
            "required": True
        },
        "description": {
            "description": "Optional detailed description of the task.",
            "type": "str",
            "required": False
        },
        "priority": {
            "description": "Task priority level. Must be one of: 'low', 'medium', or 'high'. Defaults to 'medium' if not specified.",
            "type": "str",
            "required": False
        },
        "due_date": {
            "description": "Optional due date in ISO 8601 format (YYYY-MM-DD). Example: '2026-02-10'",
            "type": "str",
            "required": False
        }
    }
}
```

**Example Input**:
```json
{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and vegetables",
    "priority": "high",
    "due_date": "2026-02-05"
}
```

**Example Output**:
```json
{
    "success": true,
    "task": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread, and vegetables",
        "priority": "high",
        "status": "pending",
        "due_date": "2026-02-05",
        "created_at": "2026-02-03T10:30:00Z"
    }
}
```

**Error Cases**:
- Empty title → `{"success": false, "error": "Title is required"}`
- Invalid priority → `{"success": false, "error": "Priority must be low, medium, or high"}`
- Invalid date format → `{"success": false, "error": "Invalid date format. Use YYYY-MM-DD"}`

---

### 2. list_tasks

**Description**: List the user's tasks with optional filters.

**Cohere Schema**:
```python
{
    "name": "list_tasks",
    "description": "List the user's tasks. Can filter by status, priority, or due date. Returns all tasks if no filters specified.",
    "parameter_definitions": {
        "status": {
            "description": "Filter by task status. Options: 'pending', 'completed', or 'all'. Defaults to 'all'.",
            "type": "str",
            "required": False
        },
        "priority": {
            "description": "Filter by priority level. Options: 'low', 'medium', 'high'. If not specified, returns all priorities.",
            "type": "str",
            "required": False
        },
        "due_date": {
            "description": "Filter by due date. Options: 'today', 'overdue', or specific date in YYYY-MM-DD format.",
            "type": "str",
            "required": False
        },
        "limit": {
            "description": "Maximum number of tasks to return. Defaults to 50.",
            "type": "int",
            "required": False
        }
    }
}
```

**Example Input**:
```json
{
    "status": "pending",
    "priority": "high"
}
```

**Example Output**:
```json
{
    "success": true,
    "tasks": [
        {
            "id": "990e8400-e29b-41d4-a716-446655440004",
            "title": "Buy groceries",
            "priority": "high",
            "status": "pending",
            "due_date": "2026-02-05",
            "created_at": "2026-02-03T10:30:00Z"
        },
        {
            "id": "aa0e8400-e29b-41d4-a716-446655440005",
            "title": "Finish project report",
            "priority": "high",
            "status": "pending",
            "due_date": "2026-02-04",
            "created_at": "2026-02-02T14:20:00Z"
        }
    ],
    "total": 2
}
```

**Error Cases**:
- Invalid status → `{"success": false, "error": "Status must be pending, completed, or all"}`
- Invalid priority → `{"success": false, "error": "Priority must be low, medium, or high"}`

---

### 3. get_task

**Description**: Get detailed information about a specific task.

**Cohere Schema**:
```python
{
    "name": "get_task",
    "description": "Get detailed information about a specific task by its ID. Use this when the user asks about a particular task.",
    "parameter_definitions": {
        "task_id": {
            "description": "The UUID of the task to retrieve (required).",
            "type": "str",
            "required": True
        }
    }
}
```

**Example Input**:
```json
{
    "task_id": "990e8400-e29b-41d4-a716-446655440004"
}
```

**Example Output**:
```json
{
    "success": true,
    "task": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread, and vegetables",
        "priority": "high",
        "status": "pending",
        "due_date": "2026-02-05",
        "created_at": "2026-02-03T10:30:00Z",
        "updated_at": "2026-02-03T10:30:00Z"
    }
}
```

**Error Cases**:
- Task not found → `{"success": false, "error": "Task not found"}`
- Task belongs to another user → `{"success": false, "error": "Task not found"}` (security)

---

### 4. update_task

**Description**: Update one or more fields of an existing task.

**Cohere Schema**:
```python
{
    "name": "update_task",
    "description": "Update an existing task. Can update title, description, priority, due date, or status. Only provide the fields you want to change.",
    "parameter_definitions": {
        "task_id": {
            "description": "The UUID of the task to update (required).",
            "type": "str",
            "required": True
        },
        "title": {
            "description": "New task title.",
            "type": "str",
            "required": False
        },
        "description": {
            "description": "New task description.",
            "type": "str",
            "required": False
        },
        "priority": {
            "description": "New priority level: 'low', 'medium', or 'high'.",
            "type": "str",
            "required": False
        },
        "status": {
            "description": "New status: 'pending' or 'completed'.",
            "type": "str",
            "required": False
        },
        "due_date": {
            "description": "New due date in YYYY-MM-DD format, or null to remove due date.",
            "type": "str",
            "required": False
        }
    }
}
```

**Example Input**:
```json
{
    "task_id": "990e8400-e29b-41d4-a716-446655440004",
    "priority": "medium",
    "due_date": "2026-02-06"
}
```

**Example Output**:
```json
{
    "success": true,
    "task": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread, and vegetables",
        "priority": "medium",
        "status": "pending",
        "due_date": "2026-02-06",
        "updated_at": "2026-02-03T10:35:00Z"
    }
}
```

**Error Cases**:
- Task not found → `{"success": false, "error": "Task not found"}`
- Invalid field values → `{"success": false, "error": "Invalid priority value"}`

---

### 5. delete_task

**Description**: Delete a task permanently.

**Cohere Schema**:
```python
{
    "name": "delete_task",
    "description": "Permanently delete a task. This action cannot be undone. Use with caution and confirm with the user first.",
    "parameter_definitions": {
        "task_id": {
            "description": "The UUID of the task to delete (required).",
            "type": "str",
            "required": True
        }
    }
}
```

**Example Input**:
```json
{
    "task_id": "990e8400-e29b-41d4-a716-446655440004"
}
```

**Example Output**:
```json
{
    "success": true,
    "message": "Task deleted successfully"
}
```

**Error Cases**:
- Task not found → `{"success": false, "error": "Task not found"}`

---

### 6. toggle_task_complete

**Description**: Toggle a task's completion status (pending ↔ completed).

**Cohere Schema**:
```python
{
    "name": "toggle_task_complete",
    "description": "Toggle a task between pending and completed status. If the task is pending, it will be marked as completed. If it's completed, it will be marked as pending.",
    "parameter_definitions": {
        "task_id": {
            "description": "The UUID of the task to toggle (required).",
            "type": "str",
            "required": True
        }
    }
}
```

**Example Input**:
```json
{
    "task_id": "990e8400-e29b-41d4-a716-446655440004"
}
```

**Example Output**:
```json
{
    "success": true,
    "task": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "title": "Buy groceries",
        "status": "completed",
        "updated_at": "2026-02-03T10:40:00Z"
    }
}
```

**Error Cases**:
- Task not found → `{"success": false, "error": "Task not found"}`

---

## Implementation Notes

### Tool Registration

```python
# backend/app/agents/todo_agent.py
from app.services.task_service import TaskService

TOOLS = [
    {
        "name": "create_task",
        "description": "Create a new task for the user. Use this when the user wants to add a task to their todo list.",
        "parameter_definitions": {
            "title": {
                "description": "The task title (required). Should be clear and concise.",
                "type": "str",
                "required": True
            },
            "description": {
                "description": "Optional detailed description of the task.",
                "type": "str",
                "required": False
            },
            "priority": {
                "description": "Task priority level. Must be one of: 'low', 'medium', or 'high'. Defaults to 'medium' if not specified.",
                "type": "str",
                "required": False
            },
            "due_date": {
                "description": "Optional due date in ISO 8601 format (YYYY-MM-DD). Example: '2026-02-10'",
                "type": "str",
                "required": False
            }
        }
    },
    # ... other tools
]
```

### Tool Execution

```python
def execute_tool(tool_name: str, parameters: dict, user_id: str, session: Session) -> dict:
    """Execute a tool call with user context."""

    task_service = TaskService(session)

    if tool_name == "create_task":
        return task_service.create_task(user_id=user_id, **parameters)

    elif tool_name == "list_tasks":
        return task_service.list_tasks(user_id=user_id, **parameters)

    elif tool_name == "get_task":
        return task_service.get_task(user_id=user_id, **parameters)

    elif tool_name == "update_task":
        return task_service.update_task(user_id=user_id, **parameters)

    elif tool_name == "delete_task":
        return task_service.delete_task(user_id=user_id, **parameters)

    elif tool_name == "toggle_task_complete":
        return task_service.toggle_task_complete(user_id=user_id, **parameters)

    else:
        return {"success": False, "error": f"Unknown tool: {tool_name}"}
```

### User Isolation

**CRITICAL**: The `user_id` is NEVER a tool parameter. It is always injected from the authenticated JWT token:

```python
# In chat endpoint
current_user = get_current_user(token)  # Extract from JWT
result = execute_tool(tool_name, parameters, user_id=current_user.id, session=session)
```

This ensures:
- Users can only access their own tasks
- Agent cannot specify arbitrary user_id
- Security enforced at the service layer

---

## Agent Behavior Guidelines

### Confirmation Pattern

For destructive operations, the agent should confirm with the user:

```
User: "Delete all my tasks"
Agent: "I can help you delete tasks. However, I need you to confirm:
- Do you want to delete ALL tasks, or just completed ones?
- This action cannot be undone. Are you sure?"

User: "Yes, delete all completed tasks"
Agent: [Uses list_tasks with status=completed, then delete_task for each]
```

### Error Handling

When a tool call fails, the agent should:
1. Explain the error in user-friendly language
2. Suggest corrective action if applicable
3. Ask for clarification if needed

```
Tool Error: {"success": false, "error": "Task not found"}
Agent Response: "I couldn't find that task. It may have been deleted already. Would you like me to show you your current tasks?"
```

### Natural Language Formatting

When listing tasks, format them in a readable way:

```
Agent: "Here are your high-priority tasks:

1. **Buy groceries** (Due: Feb 5)
   - Priority: High
   - Status: Pending

2. **Finish project report** (Due: Feb 4)
   - Priority: High
   - Status: Pending

You have 2 high-priority tasks."
```

---

## Testing

### Unit Tests

```python
# backend/tests/unit/test_tools.py
def test_create_task_tool():
    result = execute_tool(
        "create_task",
        {"title": "Test task", "priority": "high"},
        user_id="test-user-id",
        session=session
    )
    assert result["success"] == True
    assert result["task"]["title"] == "Test task"
```

### Integration Tests

```python
# backend/tests/integration/test_agent_tools.py
def test_agent_creates_task():
    response = client.post(
        "/api/chat",
        json={"message": "Create a task to test the system"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "created successfully" in response.json()["data"]["content"].lower()
```

---

## Summary

This tool schema provides:
- ✅ Complete CRUD operations for tasks
- ✅ User isolation enforced at service layer
- ✅ Clear parameter definitions for Cohere
- ✅ Error handling patterns
- ✅ Natural language guidelines

**Status**: Ready for implementation
**Next Step**: Generate quickstart guide
