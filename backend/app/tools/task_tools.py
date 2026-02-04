"""Tool execution functions for task management."""
from typing import Any, Dict, Optional
from sqlmodel import Session, select
from datetime import datetime
from app.models.task import Task
import json


def create_task_tool(
    session: Session,
    user_id: str,
    title: str,
    description: Optional[str] = None,
    priority: str = "medium",
    due_date: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new task."""
    try:
        # Parse due_date if provided
        parsed_due_date = None
        if due_date:
            try:
                parsed_due_date = datetime.fromisoformat(due_date)
            except ValueError:
                return {
                    "success": False,
                    "error": f"Invalid due_date format: {due_date}. Use YYYY-MM-DD format."
                }

        # Validate priority
        if priority not in ["low", "medium", "high"]:
            priority = "medium"

        # Create task
        task = Task(
            title=title,
            description=description,
            priority=priority,
            due_date=parsed_due_date,
            user_id=user_id
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed": task.completed,
                "created_at": task.created_at.isoformat()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def list_tasks_tool(
    session: Session,
    user_id: str,
    status: Optional[str] = None,
    priority: Optional[str] = None
) -> Dict[str, Any]:
    """List tasks with optional filters."""
    try:
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters
        if status == "completed":
            statement = statement.where(Task.completed == True)
        elif status == "pending":
            statement = statement.where(Task.completed == False)

        if priority:
            statement = statement.where(Task.priority == priority)

        tasks = session.exec(statement).all()

        return {
            "success": True,
            "count": len(tasks),
            "tasks": [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "priority": task.priority,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def get_task_tool(
    session: Session,
    user_id: str,
    task_id: str
) -> Dict[str, Any]:
    """Get a specific task by ID."""
    try:
        task = session.get(Task, task_id)

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found"
            }

        # Validate ownership
        if task.user_id != user_id:
            return {
                "success": False,
                "error": "Not authorized to access this task"
            }

        return {
            "success": True,
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed": task.completed,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def update_task_tool(
    session: Session,
    user_id: str,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    completed: Optional[bool] = None
) -> Dict[str, Any]:
    """Update task fields."""
    try:
        task = session.get(Task, task_id)

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found"
            }

        # Validate ownership
        if task.user_id != user_id:
            return {
                "success": False,
                "error": "Not authorized to modify this task"
            }

        # Update fields
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if priority is not None and priority in ["low", "medium", "high"]:
            task.priority = priority
        if due_date is not None:
            try:
                task.due_date = datetime.fromisoformat(due_date)
            except ValueError:
                return {
                    "success": False,
                    "error": f"Invalid due_date format: {due_date}"
                }
        if completed is not None:
            task.completed = completed

        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed": task.completed,
                "updated_at": task.updated_at.isoformat()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def delete_task_tool(
    session: Session,
    user_id: str,
    task_id: str
) -> Dict[str, Any]:
    """Delete a task."""
    try:
        task = session.get(Task, task_id)

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found"
            }

        # Validate ownership
        if task.user_id != user_id:
            return {
                "success": False,
                "error": "Not authorized to delete this task"
            }

        session.delete(task)
        session.commit()

        return {
            "success": True,
            "message": f"Task '{task.title}' has been deleted"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def toggle_task_complete_tool(
    session: Session,
    user_id: str,
    task_id: str
) -> Dict[str, Any]:
    """Toggle task completion status."""
    try:
        task = session.get(Task, task_id)

        if not task:
            return {
                "success": False,
                "error": f"Task with ID {task_id} not found"
            }

        # Validate ownership
        if task.user_id != user_id:
            return {
                "success": False,
                "error": "Not authorized to modify this task"
            }

        task.completed = not task.completed
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "task": {
                "id": task.id,
                "title": task.title,
                "completed": task.completed,
                "updated_at": task.updated_at.isoformat()
            },
            "message": f"Task '{task.title}' marked as {'completed' if task.completed else 'pending'}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def execute_tool(
    tool_name: str,
    tool_input: Dict[str, Any],
    session: Session,
    user_id: str
) -> Dict[str, Any]:
    """
    Execute a tool by name with given input.

    Args:
        tool_name: Name of the tool to execute
        tool_input: Tool input parameters
        session: Database session
        user_id: Current user ID

    Returns:
        Tool execution result
    """
    tool_map = {
        "create_task": create_task_tool,
        "list_tasks": list_tasks_tool,
        "get_task": get_task_tool,
        "update_task": update_task_tool,
        "delete_task": delete_task_tool,
        "toggle_task_complete": toggle_task_complete_tool
    }

    if tool_name not in tool_map:
        return {
            "success": False,
            "error": f"Unknown tool: {tool_name}"
        }

    try:
        return tool_map[tool_name](session, user_id, **tool_input)
    except Exception as e:
        return {
            "success": False,
            "error": f"Tool execution error: {str(e)}"
        }
