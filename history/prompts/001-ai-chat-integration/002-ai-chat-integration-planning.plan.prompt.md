---
id: 002
title: AI Chat Integration Planning
stage: plan
date: 2026-02-03
surface: agent
model: claude-sonnet-4-5
feature: 001-ai-chat-integration
branch: 001-ai-chat-integration
user: KHI Store
command: /sp.plan
labels: ["planning", "ai-chat", "cohere", "architecture", "design"]
links:
  spec: specs/001-ai-chat-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-chat-integration/plan.md
  - specs/001-ai-chat-integration/research.md
  - specs/001-ai-chat-integration/data-model.md
  - specs/001-ai-chat-integration/contracts/chat-api.yaml
  - specs/001-ai-chat-integration/contracts/cohere-tools.md
  - specs/001-ai-chat-integration/quickstart.md
  - CLAUDE.md (updated)
tests:
  - None (planning phase)
---

## Prompt

User requested implementation planning for AI Chat Integration feature with the following context:

**High-level outline:**
- Define agent prompt and behavior
- Build stateless chat API endpoint
- Persist conversations and messages
- Connect ChatKit frontend to chat API
- Validate tool calls and responses

**Context from codebase review:**
- Backend: FastAPI with SQLModel, JWT auth already implemented, User and Task models exist
- Frontend: Next.js 16 App Router, no ChatKit yet, custom API client and auth client exist
- No MCP tools configured yet
- No chat/conversation models exist yet
- Database: Currently SQLite, supports PostgreSQL

**Critical constraint:** User has Cohere API key instead of OpenAI key. Plan must use Cohere API.

## Response snapshot

Successfully completed Phase 0 (Research) and Phase 1 (Design & Contracts) of the implementation planning workflow.

**Phase 0: Research - Key Decisions:**

1. **AI Provider: Cohere API (Command R+)**
   - Rationale: User has Cohere API key, no OpenAI key available
   - Implementation: Manual tool execution loop (no Agents SDK equivalent)
   - Additional effort: 3-4 hours compared to OpenAI Agents SDK
   - Cost: $2.50/1M input tokens, $10/1M output tokens

2. **Chat UI: Custom Tailwind Components**
   - Rationale: "ChatKit" library does not exist
   - Evaluated alternatives: Stream Chat React, React Chat Elements, ChatUI (all unsuitable)
   - Implementation: Build custom components using existing stack (Tailwind, Framer Motion, Lucide React)
   - Estimated effort: 6-9 hours

3. **Database Schema: Three-Table Design**
   - Conversation table: id, user_id, title, created_at, updated_at
   - Message table: id, conversation_id, role, content, created_at, token tracking
   - ToolCall table: id, message_id, tool_name, input_json, output_json, status, duration_ms
   - Proper indexing for performance, cascade deletes for data integrity

4. **Architecture: Stateless FastAPI + Manual Tool Loop**
   - Stateless chat endpoint (no session state)
   - Conversation history loaded from database
   - Manual tool execution loop for Cohere
   - User isolation enforced at service layer

**Phase 1: Design & Contracts - Deliverables:**

1. **data-model.md**: Complete database schema with SQLModel definitions, relationships, indexes, query patterns, and performance considerations

2. **contracts/chat-api.yaml**: OpenAPI 3.1 specification with 4 endpoints:
   - POST /api/chat: Send message and get response
   - GET /api/chat/conversations: List user conversations
   - GET /api/chat/conversations/{id}: Get conversation history
   - DELETE /api/chat/conversations/{id}: Delete conversation

3. **contracts/cohere-tools.md**: Six Cohere tool definitions:
   - create_task, list_tasks, get_task, update_task, delete_task, toggle_task_complete
   - Complete parameter definitions, examples, error cases
   - User isolation patterns documented

4. **quickstart.md**: Comprehensive setup guide with:
   - Environment configuration (Cohere API key)
   - Database initialization steps
   - Backend and frontend setup instructions
   - Testing procedures and troubleshooting

5. **Agent context update**: Successfully updated CLAUDE.md with Python 3.12+, TypeScript 5.9, and PostgreSQL information

**Constitution Check: ✅ PASS**
- All 8 constitutional principles satisfied
- Phase III AI Chatbot requirements met
- No complexity violations

**Implementation Estimates:**
- Backend: 8-12 hours
- Frontend: 6-9 hours
- Integration: 2-3 hours
- Total: 16-24 hours (2-3 development days)

## Outcome

- ✅ Impact: Complete implementation plan with research, design, and contracts ready for task generation
- 🧪 Tests: No tests (planning phase only)
- 📁 Files: 7 files created/updated (plan, research, data-model, 2 contracts, quickstart, agent context)
- 🔁 Next prompts: Run `/sp.tasks` to generate implementation tasks, then `/sp.implement` to execute
- 🧠 Reflection: Successfully adapted plan from OpenAI to Cohere API based on user's available resources. Manual tool execution loop adds 3-4 hours development time but is acceptable for hackathon timeline. Custom chat UI components provide full control and zero new dependencies.

## Evaluation notes (flywheel)

- Failure modes observed: None. Planning workflow executed successfully.
- Graders run and results (PASS/FAIL): N/A (planning phase)
- Prompt variant (if applicable): Standard /sp.plan workflow with Cohere API adaptation
- Next experiment (smallest change to try): Consider evaluating Cohere's streaming API for future enhancement to improve perceived response time
