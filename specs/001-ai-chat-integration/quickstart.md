# Quickstart Guide: AI Chat Integration

**Feature**: 001-ai-chat-integration
**Date**: 2026-02-03
**Audience**: Developers implementing the chat feature

## Overview

This guide walks you through setting up the AI chat integration feature from scratch. Follow these steps to get the chat agent running locally and test the complete flow.

**Estimated Time**: 30-45 minutes

---

## Prerequisites

Before starting, ensure you have:

- ✅ Python 3.12+ installed
- ✅ Node.js 18+ and npm installed
- ✅ Git repository cloned
- ✅ Existing Phase II implementation (User auth + Task CRUD)
- ✅ Cohere API key (provided: `u56D2kyDMjjeH1KVRzul803x04F3GY276sGz64lU`)

---

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend

# Install Cohere SDK
pip install cohere

# Verify installation
python -c "import cohere; print('Cohere SDK installed successfully')"
```

### 1.2 Configure Environment Variables

Create or update `.env` file in the `backend/` directory:

```bash
# backend/.env

# Existing variables
DATABASE_URL=sqlite:///./todo_app.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# NEW: Cohere API Configuration
COHERE_API_KEY=your_cohere_api_key_here
COHERE_MODEL=command-r-plus
```

**Security Note**: Never commit `.env` to version control. Ensure `.env` is in `.gitignore`.

### 1.3 Update Configuration

Update `backend/app/config.py` to include Cohere settings:

```python
# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Existing settings
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # NEW: Cohere settings
    COHERE_API_KEY: str
    COHERE_MODEL: str = "command-r-plus"

    class Config:
        env_file = ".env"

settings = Settings()
```

### 1.4 Create Database Models

The new models are already defined in `data-model.md`. Create the files:

```bash
# Create model files
touch backend/app/models/conversation.py
touch backend/app/models/message.py
touch backend/app/models/tool_call.py
```

Copy the SQLModel definitions from `data-model.md` into these files.

### 1.5 Initialize Database Tables

Update `backend/app/database.py` to create new tables:

```python
# backend/app/database.py
from sqlmodel import SQLModel, create_engine, Session
from app.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)

def init_db():
    """Initialize database tables."""
    # Import all models
    from app.models.user import User
    from app.models.task import Task
    from app.models.conversation import Conversation  # NEW
    from app.models.message import Message  # NEW
    from app.models.tool_call import ToolCall  # NEW

    SQLModel.metadata.create_all(engine)

def get_session():
    """Get database session."""
    with Session(engine) as session:
        yield session
```

Run the initialization:

```bash
cd backend
python -c "from app.database import init_db; init_db()"
```

**Expected Output**:
```
CREATE TABLE conversations (...)
CREATE TABLE messages (...)
CREATE TABLE tool_calls (...)
Tables created successfully
```

---

## Step 2: Implement Backend Components

### 2.1 Create Agent Module

```bash
mkdir -p backend/app/agents
touch backend/app/agents/__init__.py
touch backend/app/agents/todo_agent.py
touch backend/app/agents/prompts.py
```

### 2.2 Create Tool Execution Module

```bash
mkdir -p backend/app/tools
touch backend/app/tools/__init__.py
touch backend/app/tools/task_tools.py
```

### 2.3 Create Chat Service

```bash
touch backend/app/services/chat_service.py
```

### 2.4 Create Chat API Endpoint

```bash
touch backend/app/api/chat.py
```

### 2.5 Register Chat Router

Update `backend/app/main.py`:

```python
# backend/app/main.py
from fastapi import FastAPI
from app.api import auth, tasks, chat  # Add chat import

app = FastAPI(title="Todo App API")

# Existing routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

# NEW: Chat router
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
```

---

## Step 3: Test Backend

### 3.1 Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### 3.2 Test Authentication

```bash
# Register a test user
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Login and get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Save the token for next steps.

### 3.3 Test Chat Endpoint

```bash
# Set your token
TOKEN="your-token-here"

# Send a chat message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "Create a task to buy groceries",
    "conversation_id": null
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "message_id": "770e8400-e29b-41d4-a716-446655440002",
    "role": "assistant",
    "content": "I'll create that task for you. Task 'Buy groceries' has been created successfully.",
    "created_at": "2026-02-03T10:30:05Z",
    "tool_calls": [
      {
        "tool_name": "create_task",
        "status": "success"
      }
    ]
  }
}
```

### 3.4 Verify Task Creation

```bash
# List tasks to verify
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: You should see the "Buy groceries" task in the list.

---

## Step 4: Frontend Setup

### 4.1 Install Dependencies

No new dependencies needed! All required libraries are already installed:
- `tailwindcss`: ^3.4.19
- `framer-motion`: ^12.26.1
- `lucide-react`: ^0.562.0

### 4.2 Create Chat Components

```bash
cd frontend
mkdir -p components/chat
touch components/chat/ChatWindow.tsx
touch components/chat/MessageList.tsx
touch components/chat/MessageBubble.tsx
touch components/chat/MessageInput.tsx
touch components/chat/TypingIndicator.tsx
```

### 4.3 Create Chat Page

```bash
mkdir -p app/dashboard/chat
touch app/dashboard/chat/page.tsx
```

### 4.4 Create Chat Types

```bash
touch types/chat.ts
```

### 4.5 Update API Client

Update `frontend/lib/api.ts` to add chat methods:

```typescript
// Add to ApiClient class
async sendChatMessage(message: string, conversationId?: string | null) {
  return this.request('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId })
  });
}

async listConversations() {
  return this.request('/chat/conversations');
}

async getConversation(conversationId: string) {
  return this.request(`/chat/conversations/${conversationId}`);
}

async deleteConversation(conversationId: string) {
  return this.request(`/chat/conversations/${conversationId}`, {
    method: 'DELETE'
  });
}
```

### 4.6 Update Navigation

Update `frontend/components/layout/Sidebar.tsx` to add chat link:

```typescript
// Add to navigation items
{
  name: 'Chat',
  href: '/dashboard/chat',
  icon: MessageSquare,  // Import from lucide-react
}
```

---

## Step 5: Test Frontend

### 5.1 Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected Output**:
```
▲ Next.js 16.1.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 5.2 Test Chat UI

1. Open browser: `http://localhost:3000`
2. Login with test credentials
3. Navigate to "Chat" in sidebar
4. Type: "Create a task to buy groceries"
5. Press Send

**Expected Behavior**:
- User message appears immediately (optimistic update)
- Loading indicator shows while processing
- Assistant response appears with confirmation
- Task is created in database

### 5.3 Verify Multi-Turn Conversation

Continue the conversation:
- "Mark it as high priority"
- "Show me all my tasks"
- "Delete the groceries task"

**Expected**: Agent should maintain context and execute operations correctly.

---

## Step 6: End-to-End Testing

### 6.1 Test Complete Flow

1. **Create Task via Chat**:
   - Message: "Create a task to finish the report by Friday"
   - Verify: Task appears in /dashboard

2. **List Tasks via Chat**:
   - Message: "What are my pending tasks?"
   - Verify: Agent lists all pending tasks

3. **Update Task via Chat**:
   - Message: "Change the report task to high priority"
   - Verify: Task priority updated in database

4. **Complete Task via Chat**:
   - Message: "Mark the report task as done"
   - Verify: Task status changed to completed

5. **Delete Task via Chat**:
   - Message: "Delete the report task"
   - Verify: Task removed from database

### 6.2 Test User Isolation

1. Create second user account
2. Login as second user
3. Try to access first user's conversation
4. **Expected**: 404 Not Found (security working)

### 6.3 Test Error Handling

1. **Invalid Task ID**:
   - Message: "Show me task with ID 12345"
   - Expected: "I couldn't find that task..."

2. **Empty Message**:
   - Send empty message
   - Expected: 400 Bad Request

3. **Invalid Token**:
   - Send request with invalid JWT
   - Expected: 401 Unauthorized

---

## Step 7: Verify Database

### 7.1 Check Tables

```bash
# For SQLite
sqlite3 backend/todo_app.db

# Run queries
SELECT COUNT(*) FROM conversations;
SELECT COUNT(*) FROM messages;
SELECT COUNT(*) FROM tool_calls;

# View sample data
SELECT * FROM conversations LIMIT 5;
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
SELECT * FROM tool_calls ORDER BY started_at DESC LIMIT 10;
```

### 7.2 Verify Relationships

```sql
-- Check conversation with messages
SELECT
  c.id,
  c.title,
  COUNT(m.id) as message_count
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY c.id;

-- Check messages with tool calls
SELECT
  m.id,
  m.role,
  m.content,
  COUNT(tc.id) as tool_call_count
FROM messages m
LEFT JOIN tool_calls tc ON tc.message_id = m.id
WHERE m.role = 'assistant'
GROUP BY m.id;
```

---

## Troubleshooting

### Issue: "Module 'cohere' not found"

**Solution**:
```bash
pip install cohere
# Or if using virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install cohere
```

### Issue: "COHERE_API_KEY not found"

**Solution**:
- Verify `.env` file exists in `backend/` directory
- Check that `COHERE_API_KEY` is set correctly
- Restart the backend server after updating `.env`

### Issue: "Table 'conversations' doesn't exist"

**Solution**:
```bash
cd backend
python -c "from app.database import init_db; init_db()"
```

### Issue: "401 Unauthorized" on chat endpoint

**Solution**:
- Verify JWT token is valid (not expired)
- Check Authorization header format: `Bearer <token>`
- Re-login to get fresh token

### Issue: Agent not executing tools

**Solution**:
- Check Cohere API key is valid
- Verify tool definitions match schema
- Check backend logs for tool execution errors
- Ensure `user_id` is being injected correctly

### Issue: Frontend not connecting to backend

**Solution**:
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser console for CORS errors
- Verify API client is using correct base URL

---

## Performance Benchmarks

After setup, verify performance meets requirements:

### Response Time
```bash
# Test chat endpoint response time
time curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "List my tasks", "conversation_id": null}'
```

**Target**: < 5 seconds

### Database Queries
```bash
# Test conversation list query
time curl -X GET http://localhost:8000/api/chat/conversations \
  -H "Authorization: Bearer $TOKEN"
```

**Target**: < 1 second

---

## Next Steps

After completing this quickstart:

1. **Run Tests**: Execute unit and integration tests
2. **Review Code**: Ensure code follows constitutional standards
3. **Security Audit**: Verify user isolation and input validation
4. **Performance Testing**: Test with 50+ concurrent users
5. **Demo Preparation**: Prepare demo scenarios for hackathon

---

## Useful Commands

### Backend
```bash
# Start server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest

# Check database
sqlite3 todo_app.db
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Database
```bash
# Backup database
cp todo_app.db todo_app.backup.db

# Reset database (CAUTION: Deletes all data)
rm todo_app.db
python -c "from app.database import init_db; init_db()"
```

---

## Support

If you encounter issues not covered in this guide:

1. Check the specification: `specs/001-ai-chat-integration/spec.md`
2. Review the plan: `specs/001-ai-chat-integration/plan.md`
3. Check research: `specs/001-ai-chat-integration/research.md`
4. Review API contracts: `specs/001-ai-chat-integration/contracts/`

---

**Quickstart Status**: ✅ COMPLETE
**Ready for Implementation**: YES
**Estimated Setup Time**: 30-45 minutes
