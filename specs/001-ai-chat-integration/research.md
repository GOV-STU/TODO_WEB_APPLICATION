# Research: AI Chat Agent & Integration

**Feature**: 001-ai-chat-integration
**Date**: 2026-02-03
**Status**: Complete

## Executive Summary

This document consolidates all Phase 0 research findings for implementing an AI-powered chat agent in the Todo application. Key decisions:

1. **AI Provider**: Cohere API (Command R+ model) with manual tool execution loop
2. **Chat UI**: Custom components using existing Tailwind CSS + Framer Motion stack
3. **Database Schema**: Conversation, Message, and ToolCall tables with proper indexing
4. **Architecture**: Stateless FastAPI endpoint with conversation persistence

---

## 1. AI Provider Selection: Cohere API

### Decision: Use Cohere API

**Rationale**:
- User has Cohere API key available
- No OpenAI API key available
- Cost-effective for hackathon demo
- Native stateless design aligns with architecture

### Cohere Chat API Capabilities

**Tool Calling Support**: ✅ YES
- Native function/tool calling via Chat API v2
- Tools defined using JSON Schema (OpenAPI compatible)
- Similar to OpenAI's function calling pattern

**Key Features**:
- Command R+ model optimized for tool use
- Stateless by design (perfect for FastAPI)
- Conversation history via messages array
- Streaming support (optional for future)

**Python SDK**:
```python
# Installation
pip install cohere

# Basic usage
import cohere

client = cohere.Client(api_key="YOUR_API_KEY")

response = client.chat(
    model="command-r-plus",
    message="Create a task to buy groceries",
    chat_history=[...],  # Previous messages
    tools=[...],  # Tool definitions
)
```

### Implementation Requirements

**Manual Tool Execution Loop** (No Agents SDK equivalent):

```python
def chat_with_tools(message: str, chat_history: list, tools: list):
    """Execute chat with tool calling loop."""

    while True:
        # 1. Send message to Cohere
        response = client.chat(
            model="command-r-plus",
            message=message,
            chat_history=chat_history,
            tools=tools
        )

        # 2. Check if tool calls are needed
        if response.finish_reason == "COMPLETE":
            return response.text

        if response.finish_reason == "TOOL_CALL":
            # 3. Execute tool calls
            tool_results = []
            for tool_call in response.tool_calls:
                result = execute_tool(tool_call.name, tool_call.parameters)
                tool_results.append({
                    "call": tool_call,
                    "outputs": [result]
                })

            # 4. Continue conversation with tool results
            message = ""  # Empty for continuation
            chat_history = response.chat_history
            # Add tool_results to next call
        else:
            raise Exception(f"Unexpected finish_reason: {response.finish_reason}")
```

**Async Wrapper for FastAPI**:

```python
import asyncio
from functools import partial

async def chat_async(message: str, chat_history: list, tools: list):
    """Async wrapper for Cohere chat."""
    loop = asyncio.get_event_loop()
    func = partial(chat_with_tools, message, chat_history, tools)
    return await loop.run_in_executor(None, func)
```

### Tool Definition Format

```python
tools = [
    {
        "name": "create_task",
        "description": "Create a new task for the user",
        "parameter_definitions": {
            "title": {
                "description": "The task title",
                "type": "str",
                "required": True
            },
            "description": {
                "description": "Optional task description",
                "type": "str",
                "required": False
            },
            "priority": {
                "description": "Task priority: low, medium, or high",
                "type": "str",
                "required": False
            }
        }
    }
]
```

### Conversation History Format

```python
chat_history = [
    {
        "role": "USER",
        "message": "Create a task to buy groceries"
    },
    {
        "role": "CHATBOT",
        "message": "I'll create that task for you.",
        "tool_calls": [...]  # Optional
    }
]
```

### Cost Comparison

| Provider | Model | Input (1M tokens) | Output (1M tokens) |
|----------|-------|-------------------|-------------------|
| Cohere | Command R+ | $2.50 | $10.00 |
| OpenAI | GPT-4 Turbo | $10.00 | $30.00 |
| OpenAI | GPT-3.5 Turbo | $0.50 | $1.50 |

**Estimated Demo Cost**: $5-10 for 100-200 conversations

### Implementation Complexity

**Additional Development Required**:
1. Tool execution loop (1-2 hours)
2. Async wrapper for FastAPI (30 minutes)
3. Error handling and retries (1 hour)
4. Conversation state management (30 minutes)

**Total Additional Effort**: 3-4 hours compared to OpenAI Agents SDK

### Limitations

- No automatic tool execution (manual loop required)
- No built-in conversation management
- Limited documentation compared to OpenAI
- No MCP (Model Context Protocol) support

### Recommendation

**APPROVED**: Use Cohere API with manual tool execution loop

**Justification**:
- User has Cohere API key (no OpenAI key)
- 3-4 hours additional development is acceptable
- Cost savings beneficial for demo
- Stateless design aligns perfectly with architecture

---

## 2. Chat UI Component Selection

### Decision: Build Custom Components

**Rationale**:
- No suitable third-party library exists ("ChatKit" does not exist)
- Full compatibility with Next.js 16 + React 19 + Tailwind CSS
- Zero new dependencies required
- Complete control over styling and behavior

### Evaluated Alternatives

**Stream Chat React** ❌
- Requires Stream backend service (commercial)
- Cannot work with FastAPI backend
- Architectural mismatch

**React Chat Elements** ❌
- Irregular maintenance
- React 19 compatibility unknown
- Inline styles conflict with Tailwind CSS

**ChatUI (Alibaba)** ❌
- Documentation in Chinese
- Custom CSS-in-JS conflicts with Tailwind
- Heavy dependencies

### Custom Component Architecture

```
components/chat/
├── ChatWindow.tsx          # Main container
├── ChatInterface.tsx       # Client component wrapper
├── MessageList.tsx         # Scrollable message container
├── MessageBubble.tsx       # Individual message display
├── MessageInput.tsx        # Input field with send button
├── TypingIndicator.tsx     # Loading state
└── ConversationList.tsx    # Conversation sidebar (future)
```

### Existing Dependencies to Use

All required libraries already installed:
- `tailwindcss`: ^3.4.19 - Styling
- `framer-motion`: ^12.26.1 - Animations
- `lucide-react`: ^0.562.0 - Icons
- `sonner`: ^2.0.7 - Toast notifications

### Component Examples

**MessageBubble Component**:
```typescript
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[70%] rounded-lg p-4 ${
        isUser
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      }`}>
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-70 mt-2 block">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
}
```

**MessageInput Component**:
```typescript
interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !message.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
```

### Accessibility Features

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels for screen readers
- ✅ Focus management
- ✅ Color contrast compliance (WCAG 2.1 AA)
- ✅ Semantic HTML

### Performance Optimizations

- Optimistic updates (show user message immediately)
- Auto-scroll to bottom on new messages
- Virtual scrolling (if needed for 1000+ messages)
- Message pagination (load more on scroll)

### Estimated Effort

- Component development: 4-6 hours
- Testing: 2-3 hours
- **Total**: 6-9 hours (1-2 development sessions)

---

## 3. Database Schema Design

### Decision: Three-Table Schema

**Tables**:
1. `conversations` - Chat sessions
2. `messages` - Message history
3. `tool_calls` - Tool execution audit log (optional but recommended)

### Conversation Table

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

**Indexes**:
```sql
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);
```

### Message Table

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
    role: str = Field(max_length=20, nullable=False)  # user, assistant, system
    content: str = Field(nullable=False, sa_column_kwargs={"type_": "TEXT"})
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Optional: Token tracking
    prompt_tokens: Optional[int] = Field(default=None)
    completion_tokens: Optional[int] = Field(default=None)
    total_tokens: Optional[int] = Field(default=None)

    # Optional: Metadata (tool calls, model info)
    metadata_json: Optional[str] = Field(default=None, sa_column_kwargs={"type_": "TEXT"})
```

**Indexes**:
```sql
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
```

### Tool Call Table (Optional but Recommended)

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
    status: str = Field(default="success", max_length=20)  # success, error
    started_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    duration_ms: Optional[int] = Field(default=None)
```

**Indexes**:
```sql
CREATE INDEX idx_tool_calls_message_id ON tool_calls(message_id);
CREATE INDEX idx_tool_calls_tool_name ON tool_calls(tool_name);
```

### Cascade Deletes

```sql
-- User deleted → Conversations deleted
ALTER TABLE conversations
ADD CONSTRAINT fk_conversations_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Conversation deleted → Messages deleted
ALTER TABLE messages
ADD CONSTRAINT fk_messages_conversation
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- Message deleted → Tool calls deleted
ALTER TABLE tool_calls
ADD CONSTRAINT fk_tool_calls_message
FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;
```

### Query Patterns

**List user conversations**:
```python
statement = select(Conversation).where(
    Conversation.user_id == current_user_id
).order_by(Conversation.updated_at.desc())

conversations = session.exec(statement).all()
```

**Get conversation history**:
```python
statement = select(Message).where(
    Message.conversation_id == conversation_id
).order_by(Message.created_at.asc())

messages = session.exec(statement).all()
```

**Get recent messages (context window)**:
```python
statement = select(Message).where(
    Message.conversation_id == conversation_id
).order_by(Message.created_at.desc()).limit(20)

recent_messages = list(reversed(session.exec(statement).all()))
```

### Performance Considerations

- **Pagination**: Cursor-based for messages, offset-based for conversations
- **Context Window**: Limit to last 20 messages or 4000 tokens
- **Archival**: Soft delete old conversations after 90 days
- **Cleanup**: Hard delete after 30 days of soft delete

---

## 4. Agent Prompt Engineering

### System Prompt Design

```python
SYSTEM_PROMPT = """You are a helpful AI assistant for a task management application.

Your role is to help users manage their tasks through natural language conversation.

Available tools:
- create_task: Create a new task
- list_tasks: List user's tasks with optional filters
- get_task: Get details of a specific task
- update_task: Update task fields
- delete_task: Delete a task
- toggle_task_complete: Mark task as complete or incomplete

Guidelines:
1. Always confirm task operations with the user
2. Use clear, concise language
3. When listing tasks, format them in a readable way
4. Ask for clarification if the user's request is ambiguous
5. Be proactive in suggesting task management actions
6. Respect user privacy - never access other users' data

Examples:
- User: "Create a task to buy groceries"
  → Use create_task tool with title "Buy groceries"

- User: "What are my tasks for today?"
  → Use list_tasks tool with due_date filter

- User: "Mark the groceries task as done"
  → Use toggle_task_complete tool

Remember: You can only manage tasks. For other requests, politely explain your limitations.
"""
```

### Context Window Management

**Strategy**: Last 20 messages or 4000 tokens (whichever is smaller)

```python
def prepare_chat_history(messages: list[Message], max_tokens: int = 4000) -> list[dict]:
    """Prepare chat history for Cohere API."""

    # Get last 20 messages
    recent_messages = messages[-20:] if len(messages) > 20 else messages

    # Convert to Cohere format
    chat_history = []
    for msg in recent_messages[:-1]:  # Exclude current message
        chat_history.append({
            "role": "USER" if msg.role == "user" else "CHATBOT",
            "message": msg.content
        })

    # Optional: Trim to token budget
    # (Implement token counting if needed)

    return chat_history
```

### Tool Use Instructions

**Embedded in System Prompt**:
- Clear tool descriptions
- Parameter requirements
- Expected behavior
- Error handling guidance

**User Confirmation Pattern**:
```
User: "Delete all my tasks"
Assistant: "I can help you delete tasks. However, I need you to confirm:
- Do you want to delete ALL tasks, or just completed ones?
- This action cannot be undone. Are you sure?"
```

---

## 5. Database Migration Strategy

### Decision: Dual Database Support

**Development**: SQLite (existing)
**Production**: PostgreSQL (Neon Serverless)

### Migration Approach

**Option 1: Alembic Migrations** (Recommended)

```bash
# Install Alembic
pip install alembic

# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add conversation and message tables"

# Apply migration
alembic upgrade head
```

**Option 2: SQLModel create_all()** (Simpler for hackathon)

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

### Migration Timing

**For Hackathon**:
1. Use SQLite for development
2. Add new tables via `create_all()`
3. Test locally
4. Deploy to Neon PostgreSQL for demo

**Post-Hackathon**:
1. Implement Alembic migrations
2. Version control schema changes
3. Add rollback capabilities

### Database Configuration

```python
# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Existing settings
    DATABASE_URL: str = "sqlite:///./todo_app.db"

    # New settings
    COHERE_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
```

```bash
# .env
DATABASE_URL=sqlite:///./todo_app.db
# DATABASE_URL=postgresql://user:pass@host/db  # For production

COHERE_API_KEY=your_cohere_api_key_here
```

---

## 6. Architecture Decisions Summary

### Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| AI Provider | Cohere API (Command R+) | User has API key, cost-effective |
| Chat UI | Custom Tailwind components | No suitable library, full control |
| Database | PostgreSQL (SQLite dev) | Existing choice, proven |
| ORM | SQLModel | Existing choice, type-safe |
| Backend | FastAPI | Existing choice, async support |
| Frontend | Next.js 16 App Router | Existing choice, modern |

### Architecture Pattern

```
Frontend (Next.js)
    ↓ HTTP POST /api/chat
Backend (FastAPI)
    ↓ Load conversation history
Database (PostgreSQL)
    ↓ Return messages
Backend
    ↓ Prepare chat history
Cohere API
    ↓ Process message + tools
Backend (Tool Execution Loop)
    ↓ Execute tool calls
Backend Services
    ↓ Perform task operations
Database
    ↓ Save message + tool calls
Backend
    ↓ Return response
Frontend
    ↓ Display message
```

### Key Design Principles

1. **Stateless API**: No session state in FastAPI
2. **User Isolation**: All queries filtered by user_id
3. **Conversation Persistence**: All context stored in database
4. **Tool-Based Operations**: Agent uses tools, never direct DB access
5. **Type Safety**: Pydantic schemas throughout
6. **Error Handling**: Graceful degradation, user-friendly messages

---

## 7. Implementation Estimates

### Backend (8-12 hours)

- Database models: 2 hours
- Cohere integration: 3-4 hours (tool loop)
- Chat API endpoint: 2 hours
- Service layer: 2 hours
- Testing: 2-3 hours

### Frontend (6-9 hours)

- Chat components: 4-6 hours
- Chat page: 1 hour
- API client: 1 hour
- Navigation updates: 30 minutes
- Testing: 2-3 hours

### Integration (2-3 hours)

- End-to-end testing: 2 hours
- Bug fixes: 1 hour

**Total**: 16-24 hours (2-3 development days)

---

## 8. Risks and Mitigations

### Technical Risks

1. **Cohere Tool Execution Complexity**
   - Risk: Manual loop may have edge cases
   - Mitigation: Thorough testing, error handling
   - Fallback: Simplify to single-turn responses

2. **Agent Response Time**
   - Risk: May exceed 5-second target
   - Mitigation: Optimize context window, use faster model
   - Fallback: Implement timeout with retry

3. **Database Performance**
   - Risk: Conversation history queries may be slow
   - Mitigation: Proper indexing, pagination
   - Fallback: Limit history to last 20 messages

### Business Risks

1. **Demo Readiness**
   - Risk: Implementation may not complete in time
   - Mitigation: Prioritize P1 features, incremental testing
   - Fallback: Demo with reduced feature set

2. **API Costs**
   - Risk: Cohere API costs may exceed budget
   - Mitigation: Monitor usage, set rate limits
   - Fallback: Use smaller model (Command R)

---

## 9. Next Steps

### Phase 1: Design & Contracts

1. Generate `data-model.md` with complete schema
2. Generate API contracts in `contracts/`
3. Generate `quickstart.md` with setup instructions
4. Update agent context file

### Phase 2: Implementation

1. Backend: Models → Tools → Agent → API → Tests
2. Frontend: Components → Page → API Client → Tests
3. Integration: E2E tests → Bug fixes → Demo prep

---

## References

- Cohere API Documentation: https://docs.cohere.com/
- Cohere Python SDK: https://github.com/cohere-ai/cohere-python
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Next.js 16 Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**Research Status**: ✅ COMPLETE
**Ready for Phase 1**: YES
**Blockers**: NONE
