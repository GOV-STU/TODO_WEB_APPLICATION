# Data Model: AI Chat Agent & Integration

**Feature**: 001-ai-chat-integration
**Date**: 2026-02-03
**Status**: Design Complete

## Overview

This document defines the database schema for the AI chat integration feature. The design adds three new tables to support conversation management, message history, and tool call auditing while maintaining compatibility with existing User and Task models.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│  (existing) │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│   Conversation      │
│  - id (PK)          │
│  - user_id (FK)     │
│  - title            │
│  - created_at       │
│  - updated_at       │
└──────┬──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│     Message         │
│  - id (PK)          │
│  - conversation_id  │
│  - role             │
│  - content          │
│  - created_at       │
│  - metadata_json    │
└──────┬──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│    ToolCall         │
│  - id (PK)          │
│  - message_id (FK)  │
│  - tool_name        │
│  - input_json       │
│  - output_json      │
│  - status           │
│  - started_at       │
│  - duration_ms      │
└─────────────────────┘
```

## Table Definitions

### 1. Conversation Table

**Purpose**: Stores chat sessions between users and the AI agent.

**Table Name**: `conversations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 identifier |
| user_id | VARCHAR(36) | FOREIGN KEY → users.id, NOT NULL, INDEX | Owner of conversation |
| title | VARCHAR(200) | NULLABLE | Auto-generated or user-provided title |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Conversation creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last message timestamp |

**Indexes**:
```sql
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);
```

**Constraints**:
```sql
ALTER TABLE conversations
ADD CONSTRAINT fk_conversations_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

**SQLModel Definition**:
```python
# backend/app/models/conversation.py
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
```

**Business Rules**:
- Each user can have multiple conversations
- Conversations are soft-deleted (future enhancement)
- Title auto-generated from first user message if not provided
- `updated_at` updated on each new message

**Sample Data**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Task Management - Feb 3",
  "created_at": "2026-02-03T10:30:00Z",
  "updated_at": "2026-02-03T10:35:00Z"
}
```

---

### 2. Message Table

**Purpose**: Stores individual messages within conversations (user messages, assistant responses, system messages).

**Table Name**: `messages`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 identifier |
| conversation_id | VARCHAR(36) | FOREIGN KEY → conversations.id, NOT NULL, INDEX | Parent conversation |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('user', 'assistant', 'system') | Message sender role |
| content | TEXT | NOT NULL | Message text content |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Message timestamp |
| prompt_tokens | INTEGER | NULLABLE | Tokens in prompt (for cost tracking) |
| completion_tokens | INTEGER | NULLABLE | Tokens in completion |
| total_tokens | INTEGER | NULLABLE | Total tokens used |
| metadata_json | TEXT | NULLABLE | Additional metadata (JSON) |

**Indexes**:
```sql
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
```

**Constraints**:
```sql
ALTER TABLE messages
ADD CONSTRAINT fk_messages_conversation
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE messages
ADD CONSTRAINT chk_messages_role
CHECK (role IN ('user', 'assistant', 'system'));
```

**SQLModel Definition**:
```python
# backend/app/models/message.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4

class Message(SQLModel, table=True):
    """Message model for conversation history."""
    __tablename__ = "messages"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversations.id", index=True, nullable=False)
    role: str = Field(max_length=20, nullable=False)
    content: str = Field(nullable=False, sa_column_kwargs={"type_": "TEXT"})
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Optional: Token tracking
    prompt_tokens: Optional[int] = Field(default=None)
    completion_tokens: Optional[int] = Field(default=None)
    total_tokens: Optional[int] = Field(default=None)

    # Optional: Metadata
    metadata_json: Optional[str] = Field(default=None, sa_column_kwargs={"type_": "TEXT"})
```

**Business Rules**:
- Messages are immutable (no updates after creation)
- Messages ordered chronologically within conversation
- `role` must be one of: 'user', 'assistant', 'system'
- Token counts populated for assistant messages only
- Cascade delete when conversation deleted

**Sample Data**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "user",
  "content": "Create a task to buy groceries",
  "created_at": "2026-02-03T10:30:00Z",
  "prompt_tokens": null,
  "completion_tokens": null,
  "total_tokens": null,
  "metadata_json": null
}
```

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "assistant",
  "content": "I'll create that task for you. Task 'Buy groceries' has been created successfully.",
  "created_at": "2026-02-03T10:30:05Z",
  "prompt_tokens": 150,
  "completion_tokens": 25,
  "total_tokens": 175,
  "metadata_json": "{\"model\": \"command-r-plus\", \"temperature\": 0.7}"
}
```

---

### 3. ToolCall Table

**Purpose**: Audit log for tool invocations by the AI agent.

**Table Name**: `tool_calls`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID v4 identifier |
| message_id | VARCHAR(36) | FOREIGN KEY → messages.id, NOT NULL, INDEX | Associated assistant message |
| tool_name | VARCHAR(100) | NOT NULL, INDEX | Name of tool invoked |
| input_json | TEXT | NOT NULL | Tool input parameters (JSON) |
| output_json | TEXT | NULLABLE | Tool output result (JSON) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'success', CHECK IN ('success', 'error') | Execution status |
| started_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Tool execution start time |
| duration_ms | INTEGER | NULLABLE | Execution duration in milliseconds |

**Indexes**:
```sql
CREATE INDEX idx_tool_calls_message_id ON tool_calls(message_id);
CREATE INDEX idx_tool_calls_tool_name ON tool_calls(tool_name);
CREATE INDEX idx_tool_calls_started_at ON tool_calls(started_at DESC);
```

**Constraints**:
```sql
ALTER TABLE tool_calls
ADD CONSTRAINT fk_tool_calls_message
FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;

ALTER TABLE tool_calls
ADD CONSTRAINT chk_tool_calls_status
CHECK (status IN ('success', 'error'));
```

**SQLModel Definition**:
```python
# backend/app/models/tool_call.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4

class ToolCall(SQLModel, table=True):
    """Tool call audit log."""
    __tablename__ = "tool_calls"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    message_id: str = Field(foreign_key="messages.id", index=True, nullable=False)
    tool_name: str = Field(max_length=100, nullable=False, index=True)
    input_json: str = Field(nullable=False, sa_column_kwargs={"type_": "TEXT"})
    output_json: Optional[str] = Field(default=None, sa_column_kwargs={"type_": "TEXT"})
    status: str = Field(default="success", max_length=20)
    started_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    duration_ms: Optional[int] = Field(default=None)
```

**Business Rules**:
- One message can have multiple tool calls
- Tool calls are immutable (audit trail)
- `status` must be 'success' or 'error'
- `duration_ms` calculated from execution time
- Cascade delete when message deleted

**Sample Data**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "message_id": "770e8400-e29b-41d4-a716-446655440002",
  "tool_name": "create_task",
  "input_json": "{\"title\": \"Buy groceries\", \"priority\": \"medium\"}",
  "output_json": "{\"id\": \"990e8400-e29b-41d4-a716-446655440004\", \"title\": \"Buy groceries\", \"status\": \"pending\"}",
  "status": "success",
  "started_at": "2026-02-03T10:30:03Z",
  "duration_ms": 45
}
```

---

## Relationships

### User → Conversation (1:N)
- One user can have many conversations
- Cascade delete: Deleting user deletes all conversations
- Enforced by foreign key constraint

### Conversation → Message (1:N)
- One conversation contains many messages
- Cascade delete: Deleting conversation deletes all messages
- Messages ordered by `created_at` ASC

### Message → ToolCall (1:N)
- One assistant message can trigger multiple tool calls
- Cascade delete: Deleting message deletes all tool calls
- Tool calls ordered by `started_at` ASC

---

## Query Patterns

### 1. List User's Conversations

```python
from sqlmodel import select

statement = select(Conversation).where(
    Conversation.user_id == current_user_id
).order_by(Conversation.updated_at.desc())

conversations = session.exec(statement).all()
```

**Expected Performance**: < 50ms for 100 conversations
**Index Used**: `idx_conversations_user_updated`

---

### 2. Get Conversation History

```python
statement = select(Message).where(
    Message.conversation_id == conversation_id
).order_by(Message.created_at.asc())

messages = session.exec(statement).all()
```

**Expected Performance**: < 100ms for 100 messages
**Index Used**: `idx_messages_conversation_created`

---

### 3. Get Recent Messages (Context Window)

```python
statement = select(Message).where(
    Message.conversation_id == conversation_id
).order_by(Message.created_at.desc()).limit(20)

recent_messages = list(reversed(session.exec(statement).all()))
```

**Expected Performance**: < 50ms
**Index Used**: `idx_messages_conversation_created`

---

### 4. Get Tool Calls for Message

```python
statement = select(ToolCall).where(
    ToolCall.message_id == message_id
).order_by(ToolCall.started_at.asc())

tool_calls = session.exec(statement).all()
```

**Expected Performance**: < 20ms
**Index Used**: `idx_tool_calls_message_id`

---

### 5. Tool Usage Analytics

```python
from sqlmodel import func

statement = select(
    ToolCall.tool_name,
    func.count(ToolCall.id).label("count"),
    func.avg(ToolCall.duration_ms).label("avg_duration")
).group_by(ToolCall.tool_name)

stats = session.exec(statement).all()
```

**Expected Performance**: < 200ms for 10,000 tool calls
**Index Used**: `idx_tool_calls_tool_name`

---

## Data Validation

### Conversation Validation
- `user_id` must exist in users table
- `title` max length 200 characters
- `updated_at` >= `created_at`

### Message Validation
- `conversation_id` must exist in conversations table
- `role` must be 'user', 'assistant', or 'system'
- `content` cannot be empty
- Token counts must be non-negative if provided

### ToolCall Validation
- `message_id` must exist in messages table
- `tool_name` must match registered tool names
- `input_json` and `output_json` must be valid JSON
- `status` must be 'success' or 'error'
- `duration_ms` must be non-negative if provided

---

## Migration Strategy

### Development (SQLite)

```python
# backend/app/database.py
from sqlmodel import SQLModel, create_engine

def init_db():
    """Initialize database tables."""
    from app.models.user import User
    from app.models.task import Task
    from app.models.conversation import Conversation
    from app.models.message import Message
    from app.models.tool_call import ToolCall

    SQLModel.metadata.create_all(engine)
```

### Production (PostgreSQL)

```bash
# Using Alembic for version control
alembic revision --autogenerate -m "Add conversation, message, and tool_call tables"
alembic upgrade head
```

---

## Performance Considerations

### Indexing Strategy
- **Primary Keys**: Automatic B-tree indexes
- **Foreign Keys**: Explicit indexes for join performance
- **Composite Indexes**: For common query patterns (user_id + updated_at)

### Query Optimization
- Use `LIMIT` for pagination
- Avoid `SELECT *` in production
- Use cursor-based pagination for messages
- Implement connection pooling

### Storage Estimates
- **Conversation**: ~200 bytes per row
- **Message**: ~500 bytes per row (average)
- **ToolCall**: ~300 bytes per row

**Example**: 1000 users, 10 conversations each, 50 messages per conversation
- Conversations: 10,000 × 200 bytes = 2 MB
- Messages: 500,000 × 500 bytes = 250 MB
- Tool Calls: 100,000 × 300 bytes = 30 MB
- **Total**: ~282 MB

---

## Security Considerations

### User Isolation
- **CRITICAL**: Always filter by `user_id` in conversation queries
- Validate conversation ownership before accessing messages
- Never expose other users' data

### Data Sanitization
- Sanitize message content before display (XSS prevention)
- Validate JSON in `metadata_json` and tool call fields
- Escape special characters in SQL queries (use parameterized queries)

### Audit Trail
- Tool calls provide complete audit log
- Track all AI operations for debugging and compliance
- Immutable records (no updates after creation)

---

## Future Enhancements

### Soft Deletes
Add `deleted_at` column to Conversation table:
```python
deleted_at: Optional[datetime] = Field(default=None)
```

### Conversation Metadata
Add `metadata_json` to Conversation for tags, pinned status, etc.

### Message Reactions
Add `reactions` table for user feedback on messages.

### Conversation Sharing
Add `shared_with` table for multi-user conversations.

---

## Summary

This data model provides:
- ✅ Complete conversation history tracking
- ✅ User isolation and security
- ✅ Tool call audit trail
- ✅ Efficient query performance
- ✅ Scalable design
- ✅ Type-safe SQLModel definitions

**Status**: Ready for implementation
**Next Step**: Generate API contracts
