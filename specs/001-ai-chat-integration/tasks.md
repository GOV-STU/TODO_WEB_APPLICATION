# Tasks: AI Chat Agent & Integration

**Input**: Design documents from `/specs/001-ai-chat-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - test tasks omitted per guidelines

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` for application code
- **Frontend**: `frontend/` for Next.js application
- **Tests**: `backend/tests/` for backend tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and environment configuration

- [ ] T001 Install Cohere Python SDK in backend/requirements.txt
- [ ] T002 Add COHERE_API_KEY and COHERE_MODEL to backend/.env configuration
- [ ] T003 Update backend/app/config.py to include Cohere settings (COHERE_API_KEY, COHERE_MODEL)
- [ ] T004 [P] Create backend/app/models/conversation.py file structure
- [ ] T005 [P] Create backend/app/models/message.py file structure
- [ ] T006 [P] Create backend/app/models/tool_call.py file structure
- [ ] T007 [P] Create backend/app/agents/ directory for agent module
- [ ] T008 [P] Create backend/app/tools/ directory for tool execution
- [ ] T009 [P] Create backend/app/services/chat_service.py file structure
- [ ] T010 [P] Create backend/app/api/chat.py file structure
- [ ] T011 [P] Create frontend/components/chat/ directory for chat components
- [ ] T012 [P] Create frontend/app/dashboard/chat/ directory for chat page
- [ ] T013 [P] Create frontend/types/chat.ts file structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Models

- [ ] T014 [P] Implement Conversation model in backend/app/models/conversation.py with SQLModel schema (id, user_id, title, created_at, updated_at)
- [ ] T015 [P] Implement Message model in backend/app/models/message.py with SQLModel schema (id, conversation_id, role, content, created_at, token fields, metadata_json)
- [ ] T016 [P] Implement ToolCall model in backend/app/models/tool_call.py with SQLModel schema (id, message_id, tool_name, input_json, output_json, status, started_at, duration_ms)
- [ ] T017 Update backend/app/database.py to import and create new tables (Conversation, Message, ToolCall)

### Agent Infrastructure

- [ ] T018 Create agent system prompt in backend/app/agents/prompts.py with task management guidelines
- [ ] T019 Implement Cohere client initialization in backend/app/agents/todo_agent.py with API key configuration
- [ ] T020 Define all 6 Cohere tool schemas in backend/app/agents/todo_agent.py (create_task, list_tasks, get_task, update_task, delete_task, toggle_task_complete)

### Tool Execution Framework

- [ ] T021 [P] Implement create_task tool function in backend/app/tools/task_tools.py that calls existing TaskService
- [ ] T022 [P] Implement list_tasks tool function in backend/app/tools/task_tools.py with filtering support
- [ ] T023 [P] Implement get_task tool function in backend/app/tools/task_tools.py with ownership validation
- [ ] T024 [P] Implement update_task tool function in backend/app/tools/task_tools.py with field updates
- [ ] T025 [P] Implement delete_task tool function in backend/app/tools/task_tools.py with confirmation
- [ ] T026 [P] Implement toggle_task_complete tool function in backend/app/tools/task_tools.py
- [ ] T027 Implement execute_tool dispatcher in backend/app/tools/task_tools.py that routes tool calls to appropriate functions with user_id injection

### Chat Service Layer

- [ ] T028 Implement create_conversation method in backend/app/services/chat_service.py
- [ ] T029 Implement get_conversation method in backend/app/services/chat_service.py with user ownership validation
- [ ] T030 Implement list_conversations method in backend/app/services/chat_service.py filtered by user_id
- [ ] T031 Implement delete_conversation method in backend/app/services/chat_service.py with cascade delete
- [ ] T032 Implement save_message method in backend/app/services/chat_service.py
- [ ] T033 Implement get_conversation_history method in backend/app/services/chat_service.py with pagination support
- [ ] T034 Implement save_tool_call method in backend/app/services/chat_service.py for audit logging

### API Schemas

- [ ] T035 [P] Create ChatRequest schema in backend/app/schemas/chat.py (message, conversation_id)
- [ ] T036 [P] Create ChatResponse schema in backend/app/schemas/chat.py (conversation_id, message_id, role, content, created_at, tool_calls)
- [ ] T037 [P] Create ConversationSummary schema in backend/app/schemas/chat.py
- [ ] T038 [P] Create MessageDetail schema in backend/app/schemas/chat.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Send Message and Receive AI Response (Priority: P1) 🎯 MVP

**Goal**: Enable basic chat interaction where users can send messages and receive AI responses

**Independent Test**: Send "Hello" or "What can you do?" and verify agent responds appropriately without executing any tools

### Backend Implementation for US1

- [ ] T039 [US1] Implement chat_with_agent function in backend/app/agents/todo_agent.py that calls Cohere API with message and chat history
- [ ] T040 [US1] Implement manual tool execution loop in backend/app/agents/todo_agent.py to handle Cohere's tool_call finish_reason
- [ ] T041 [US1] Implement async wrapper for Cohere chat in backend/app/agents/todo_agent.py using asyncio.run_in_executor
- [ ] T042 [US1] Implement POST /api/chat endpoint in backend/app/api/chat.py that accepts ChatRequest
- [ ] T043 [US1] Add conversation creation logic in chat endpoint for new conversations (conversation_id is null)
- [ ] T044 [US1] Add conversation history loading in chat endpoint for existing conversations
- [ ] T045 [US1] Add user message saving before agent processing in chat endpoint
- [ ] T046 [US1] Add agent invocation with conversation context in chat endpoint
- [ ] T047 [US1] Add assistant message saving after agent response in chat endpoint
- [ ] T048 [US1] Add error handling for agent failures in chat endpoint with user-friendly messages
- [ ] T049 [US1] Register chat router in backend/app/main.py with /api/chat prefix

### Frontend Implementation for US1

- [ ] T050 [P] [US1] Create ChatMessage interface in frontend/types/chat.ts (id, role, content, created_at)
- [ ] T051 [P] [US1] Create Conversation interface in frontend/types/chat.ts (id, title, created_at, updated_at)
- [ ] T052 [P] [US1] Implement MessageBubble component in frontend/components/chat/MessageBubble.tsx with role-based styling
- [ ] T053 [P] [US1] Implement TypingIndicator component in frontend/components/chat/TypingIndicator.tsx with animated dots
- [ ] T054 [US1] Implement MessageList component in frontend/components/chat/MessageList.tsx with auto-scroll
- [ ] T055 [US1] Implement MessageInput component in frontend/components/chat/MessageInput.tsx with send button and loading state
- [ ] T056 [US1] Implement ChatWindow component in frontend/components/chat/ChatWindow.tsx that combines MessageList and MessageInput
- [ ] T057 [US1] Add sendChatMessage method to frontend/lib/api.ts API client
- [ ] T058 [US1] Create chat page in frontend/app/dashboard/chat/page.tsx with ChatWindow component
- [ ] T059 [US1] Add chat navigation link to frontend/components/layout/Sidebar.tsx with MessageSquare icon
- [ ] T060 [US1] Add chat navigation link to frontend/components/layout/MobileBottomNav.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can send messages and receive AI responses

---

## Phase 4: User Story 2 - Manage Tasks via Natural Language (Priority: P2)

**Goal**: Enable users to create, view, update, and delete tasks through natural language commands

**Independent Test**: Send "Create a task called 'Review PR'" and verify task is created and confirmed by agent

### Backend Implementation for US2

- [ ] T061 [US2] Add tool call logging in backend/app/agents/todo_agent.py to save ToolCall records for each tool execution
- [ ] T062 [US2] Implement tool result formatting in backend/app/agents/todo_agent.py to convert tool outputs to Cohere format
- [ ] T063 [US2] Add tool execution error handling in backend/app/tools/task_tools.py with try-catch and error messages
- [ ] T064 [US2] Add input validation for create_task tool in backend/app/tools/task_tools.py (title required, priority enum, date format)
- [ ] T065 [US2] Add input validation for list_tasks tool in backend/app/tools/task_tools.py (status enum, priority enum)
- [ ] T066 [US2] Add input validation for update_task tool in backend/app/tools/task_tools.py (at least one field to update)
- [ ] T067 [US2] Enhance agent system prompt in backend/app/agents/prompts.py with tool usage examples and confirmation patterns
- [ ] T068 [US2] Add token counting in chat endpoint to track prompt_tokens, completion_tokens, total_tokens in Message model

### Frontend Implementation for US2

- [ ] T069 [US2] Add tool call display in MessageBubble component to show which tools were executed (optional badge or indicator)
- [ ] T070 [US2] Add error message styling in MessageBubble component for agent error responses
- [ ] T071 [US2] Add optimistic UI update in ChatWindow to show user message immediately before API response

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can chat and manage tasks via natural language

---

## Phase 5: User Story 3 - Maintain Conversation Context (Priority: P3)

**Goal**: Enable multi-turn conversations where the agent remembers previous messages and maintains context

**Independent Test**: Send "Create a task for the meeting" followed by "When is it due?" and verify agent understands "it" refers to the task

### Backend Implementation for US3

- [ ] T072 [US3] Implement prepare_chat_history function in backend/app/agents/todo_agent.py to convert Message list to Cohere format
- [ ] T073 [US3] Add context window management in prepare_chat_history to limit to last 20 messages or 4000 tokens
- [ ] T074 [US3] Update chat endpoint to load conversation history before agent invocation
- [ ] T075 [US3] Add conversation title auto-generation in backend/app/services/chat_service.py from first user message
- [ ] T076 [US3] Update conversation updated_at timestamp when new messages are added

### Frontend Implementation for US3

- [ ] T077 [US3] Add conversation history loading in chat page when conversation_id is provided
- [ ] T078 [US3] Implement message persistence in ChatWindow to maintain messages across re-renders
- [ ] T079 [US3] Add scroll-to-bottom behavior in MessageList when new messages arrive

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - conversations maintain context across multiple turns

---

## Phase 6: User Story 4 - Handle Multiple Conversations (Priority: P4)

**Goal**: Enable users to create new conversations, switch between conversations, and manage conversation list

**Independent Test**: Create two separate conversations, send different messages in each, and verify each maintains its own history independently

### Backend Implementation for US4

- [ ] T080 [US4] Implement GET /api/chat/conversations endpoint in backend/app/api/chat.py to list user conversations
- [ ] T081 [US4] Implement GET /api/chat/conversations/{id} endpoint in backend/app/api/chat.py to get conversation with messages
- [ ] T082 [US4] Implement DELETE /api/chat/conversations/{id} endpoint in backend/app/api/chat.py with ownership validation
- [ ] T083 [US4] Add pagination support to list_conversations with skip and limit parameters
- [ ] T084 [US4] Add message count to conversation list response using SQL aggregation

### Frontend Implementation for US4

- [ ] T085 [P] [US4] Create ConversationList component in frontend/components/chat/ConversationList.tsx to display conversation summaries
- [ ] T086 [P] [US4] Create ConversationItem component in frontend/components/chat/ConversationItem.tsx with title, timestamp, and message count
- [ ] T087 [US4] Add listConversations method to frontend/lib/api.ts API client
- [ ] T088 [US4] Add getConversation method to frontend/lib/api.ts API client
- [ ] T089 [US4] Add deleteConversation method to frontend/lib/api.ts API client
- [ ] T090 [US4] Update chat page to show conversation list in sidebar or drawer
- [ ] T091 [US4] Add "New Conversation" button in chat page to start fresh conversation
- [ ] T092 [US4] Add conversation switching logic in chat page to load different conversation histories
- [ ] T093 [US4] Add conversation delete confirmation dialog in ConversationList component

**Checkpoint**: All user stories should now be independently functional - users can manage multiple conversations

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final touches

### Error Handling & Validation

- [ ] T094 [P] Add request validation middleware in backend/app/api/chat.py for empty messages
- [ ] T095 [P] Add rate limiting for chat endpoint to prevent abuse (optional, if time permits)
- [ ] T096 [P] Add timeout handling for Cohere API calls with 30-second timeout
- [ ] T097 [P] Add graceful degradation when Cohere API is unavailable

### Logging & Observability

- [ ] T098 [P] Add structured logging for agent invocations in backend/app/agents/todo_agent.py
- [ ] T099 [P] Add structured logging for tool executions in backend/app/tools/task_tools.py
- [ ] T100 [P] Add request/response logging in chat endpoint for debugging

### UI/UX Improvements

- [ ] T101 [P] Add loading skeleton in MessageList while conversation history loads
- [ ] T102 [P] Add empty state in ChatWindow when no messages exist
- [ ] T103 [P] Add error toast notifications in chat page for API failures
- [ ] T104 [P] Add keyboard shortcuts (Enter to send, Shift+Enter for newline) in MessageInput
- [ ] T105 [P] Add message timestamps in MessageBubble component

### Documentation & Validation

- [ ] T106 Update backend/README.md with Cohere API setup instructions
- [ ] T107 Update frontend/README.md with chat feature documentation
- [ ] T108 Run quickstart.md validation steps to verify end-to-end flow
- [ ] T109 Verify all constitutional requirements are met (user isolation, type safety, error handling)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1/US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Adds conversation management, independently testable

### Within Each User Story

- Backend tasks before frontend tasks (API must exist before UI can call it)
- Models before services (data layer before business logic)
- Services before endpoints (business logic before API routes)
- Core implementation before enhancements
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T004-T013 can all run in parallel (different files)

**Phase 2 (Foundational)**:
- Database models (T014-T016) can run in parallel
- Tool functions (T021-T026) can run in parallel
- API schemas (T035-T038) can run in parallel

**Phase 3 (US1)**:
- Frontend components (T050-T053) can run in parallel
- After backend is complete, all frontend tasks can run in parallel

**Phase 4 (US2)**:
- Validation tasks (T064-T066) can run in parallel
- Frontend enhancements (T069-T071) can run in parallel

**Phase 6 (US4)**:
- Frontend components (T085-T086) can run in parallel
- API client methods (T087-T089) can run in parallel

**Phase 7 (Polish)**:
- All tasks marked [P] can run in parallel (different concerns)

---

## Parallel Example: User Story 1 Backend

```bash
# After foundational phase, launch these in parallel:
Task T050: "Create ChatMessage interface in frontend/types/chat.ts"
Task T051: "Create Conversation interface in frontend/types/chat.ts"
Task T052: "Implement MessageBubble component in frontend/components/chat/MessageBubble.tsx"
Task T053: "Implement TypingIndicator component in frontend/components/chat/TypingIndicator.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T013)
2. Complete Phase 2: Foundational (T014-T038) - CRITICAL
3. Complete Phase 3: User Story 1 (T039-T060)
4. **STOP and VALIDATE**: Test basic chat interaction independently
5. Deploy/demo if ready

**MVP Delivers**: Users can send messages and receive AI responses

### Incremental Delivery

1. **Foundation** (Phase 1 + 2): Setup + Database + Agent + Tools → Foundation ready
2. **MVP** (Phase 3): Add User Story 1 → Test independently → Deploy/Demo
3. **V2** (Phase 4): Add User Story 2 → Test task management → Deploy/Demo
4. **V3** (Phase 5): Add User Story 3 → Test context retention → Deploy/Demo
5. **V4** (Phase 6): Add User Story 4 → Test multiple conversations → Deploy/Demo
6. **Polish** (Phase 7): Final touches → Production ready

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Setup (Phase 1) + Foundational (Phase 2)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 2 (Phase 4) - can start backend in parallel
   - Developer C: User Story 3 (Phase 5) - can start backend in parallel
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 109 tasks

**By Phase**:
- Phase 1 (Setup): 13 tasks
- Phase 2 (Foundational): 25 tasks
- Phase 3 (US1 - P1): 22 tasks
- Phase 4 (US2 - P2): 11 tasks
- Phase 5 (US3 - P3): 8 tasks
- Phase 6 (US4 - P4): 14 tasks
- Phase 7 (Polish): 16 tasks

**By User Story**:
- US1 (P1): 22 tasks - Basic chat interaction
- US2 (P2): 11 tasks - Task management via natural language
- US3 (P3): 8 tasks - Conversation context
- US4 (P4): 14 tasks - Multiple conversations
- Infrastructure: 38 tasks (Setup + Foundational)
- Polish: 16 tasks

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- US1: Send "Hello" → Receive response
- US2: Send "Create a task" → Task created and confirmed
- US3: Multi-turn conversation → Agent remembers context
- US4: Create 2 conversations → Each maintains independent history

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 60 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Critical**: Cohere API (not OpenAI), custom Tailwind components (not ChatKit)
- **Security**: User isolation enforced at service layer with user_id filtering
- **Architecture**: Stateless FastAPI endpoint, manual tool execution loop for Cohere
