<!--
SYNC IMPACT REPORT - Constitution Update to v2.0.0
================================================================
Version Change: 1.0 → 2.0.0 (MAJOR - Phase III architectural extension)

Modified Principles:
- None renamed, but all expanded with Phase III context

Added Sections:
- Principle VI: Agent-First Architecture
- Principle VII: MCP Tool Architecture
- Principle VIII: Stateless & Traceable AI
- Section: Phase III AI Chatbot Requirements

Removed Sections:
- None

Templates Requiring Updates:
- ✅ .specify/templates/spec-template.md - Reviewed, compatible
- ✅ .specify/templates/plan-template.md - Reviewed, compatible
- ✅ .specify/templates/tasks-template.md - Reviewed, compatible
- ✅ .specify/templates/phr-template.prompt.md - Reviewed, compatible

Follow-up TODOs:
- None - all placeholders filled

Rationale for MAJOR version bump:
- Introduces Phase III with fundamentally new architectural patterns
- Adds agent-based interaction layer on top of existing REST API
- Introduces MCP tools as mandatory abstraction layer
- Changes system boundaries and interaction patterns
- Backward compatible with Phase II (REST API remains), but adds new layer
================================================================
-->

# Todo App – Evolution to AI-Powered System
## Project Constitution

**Version**: 2.0.0
**Ratified**: 2026-01-13
**Last Amended**: 2026-02-02

---

## Focus

Build a **modern, secure, multi-user Todo application** that evolves from a basic web app to an **AI-powered conversational system**, with strong emphasis on:

- User data isolation and security by design (all phases)
- Type-safe frontend & backend (Phase II+)
- Clean separation of concerns with clear architectural boundaries
- Maximum leverage of AI-assisted spec-driven development
- Agent-first design with stateless, traceable AI interactions (Phase III+)
- MCP tools as the exclusive interface between AI agents and data layer
- Foundation for cloud-native architecture and distributed systems (Phase IV+)

The application demonstrates clear evolution: **Console App (Phase I) → Web Application (Phase II) → AI-Powered Chatbot (Phase III) → Cloud-Native System (Phase IV-V)**

---

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

**All production code MUST be generated via Claude Code + Spec-Kit Plus from written specifications.**

- Specifications are the Single Source of Truth (except this Constitution)
- Human's role: writing, refining, and critiquing specifications
- AI's role: code generation, refactoring, documentation, testing patterns
- Manual coding is strictly prohibited
- Errors belong in specifications first — fix the spec → fix the code

**Rationale**: Ensures consistency, traceability, and alignment with hackathon evaluation criteria. Maximizes reusability of intelligence and maintains quality standards.

---

### II. Security & User Isolation (NON-NEGOTIABLE)

**Every operation MUST enforce user data isolation at the server/backend layer.**

- Every task operation filtered by authenticated user_id
- Backend ALWAYS re-validates ownership — client is never trusted
- JWT authentication enforced on all protected endpoints
- User ID extracted from validated JWT token only (never from request body)
- No cross-user data access possible
- Same security model applies to both REST API (Phase II) and AI agent interactions (Phase III)

**Rationale**: Security and data isolation between users takes priority over developer convenience. Multi-user systems require server-side enforcement.

---

### III. Type Safety & Static Analysis

**Leverage type systems wherever reasonably possible.**

- TypeScript strict mode (frontend)
- Python type hints everywhere feasible (backend)
- Pydantic v2 for data validation
- SQLModel for type-safe database operations
- No `any` types or untyped code

**Rationale**: Catch errors at compile/validation time rather than runtime. Improves maintainability and reduces bugs.

---

### IV. Clean Separation of Concerns

**Clear architectural boundaries with explicit interfaces.**

**Phase II (Web App)**:
- Frontend (Next.js) ↔ Backend API (FastAPI) ↔ Database (PostgreSQL)
- Server Components vs Client Components
- API layer, Service layer, Data layer

**Phase III (AI Chatbot)**:
- UI ↔ Agent (OpenAI SDK) ↔ MCP Tools ↔ Database
- Agents MUST NOT access database directly
- MCP tools are the ONLY interface between agents and data

**Rationale**: Enables independent testing, parallel development, and future evolution. Clear boundaries prevent tight coupling.

---

### V. Observability & Explicit Configuration

**Systems must be debuggable and transparent.**

- Structured logging with appropriate log levels
- Clear error messages (user-friendly externally, detailed internally)
- No sensitive data in logs (tokens, passwords, credentials)
- Explicit configuration via environment variables
- Minimal magic / maximal explicit configuration

**Rationale**: Production systems require observability. Explicit configuration prevents surprises and enables debugging.

---

### VI. Agent-First Architecture (Phase III+)

**AI interactions MUST follow agent-first design patterns.**

- Use OpenAI Agents SDK (official) for all agent implementations
- Agents are stateless — no persistent state in agent layer
- Conversation context rebuilt from database on each request
- Agents invoke MCP tools for ALL data operations
- Agents MUST NOT access database, filesystem, or external APIs directly
- Clear separation: UI handles presentation, Agent handles reasoning, MCP Tools handle actions

**Rationale**: Stateless agents enable horizontal scaling, simplify debugging, and ensure all actions are traceable. Agent-first design prepares for distributed, event-driven architecture in Phase IV+.

---

### VII. MCP Tool Architecture (Phase III+)

**Model Context Protocol (MCP) tools are the exclusive interface for agent actions.**

- Use Official MCP SDK for all tool implementations
- MCP tools MUST be stateless and schema-defined
- Each tool has explicit input/output schemas (Pydantic)
- Tools handle ONE specific action (create task, update task, delete task, etc.)
- Tools enforce user isolation and ownership validation
- Tools return structured responses (success/error with details)
- NO business logic in agents — logic belongs in MCP tools or backend services

**Rationale**: MCP tools provide a clean, testable, traceable interface between AI reasoning and system actions. Schema-defined tools enable validation and prevent errors.

---

### VIII. Stateless & Traceable AI (Phase III+)

**All AI interactions MUST be stateless and fully traceable.**

- Stateless FastAPI chat endpoint (no session state in memory)
- Conversation history persisted in Neon PostgreSQL
- Messages include: user_id, conversation_id, role, content, timestamp
- Agent tool invocations logged with: tool_name, input, output, timestamp
- Conversation context rebuilt from database on each request
- All AI actions auditable and reproducible

**Rationale**: Stateless design enables horizontal scaling and crash recovery. Persistence ensures conversations survive restarts. Traceability enables debugging and compliance.

---

## Phase III AI Chatbot Requirements

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  - Chat UI component                                     │
│  - Message display                                       │
│  - JWT authentication (existing)                         │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS + JWT
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (FastAPI) - NEW LAYER               │
│  ┌────────────────────────────────────────────────────┐ │
│  │  POST /api/chat (stateless endpoint)               │ │
│  │  - Validate JWT                                     │ │
│  │  - Load conversation history from DB               │ │
│  │  - Initialize OpenAI Agent with MCP tools          │ │
│  │  - Execute agent with user message                 │ │
│  │  - Persist messages and tool calls to DB           │ │
│  │  - Return agent response                           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  MCP Tools (stateless, schema-defined)             │ │
│  │  - create_task(title, description)                 │ │
│  │  - list_tasks(filter?)                             │ │
│  │  - update_task(task_id, updates)                   │ │
│  │  - delete_task(task_id)                            │ │
│  │  - toggle_task_complete(task_id)                   │ │
│  │  Each tool: validates ownership, calls service     │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Existing REST API (Phase II - unchanged)          │ │
│  │  - GET/POST/PUT/DELETE /api/tasks                  │ │
│  │  - Services, models, database access               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            │ SQL queries
                            ↓
┌─────────────────────────────────────────────────────────┐
│         Neon PostgreSQL (NEW TABLES + EXISTING)         │
│  - users (existing)                                     │
│  - tasks (existing)                                     │
│  - conversations (NEW: id, user_id, created_at)         │
│  - messages (NEW: id, conversation_id, role, content)   │
│  - tool_calls (NEW: id, message_id, tool, input, output)│
└─────────────────────────────────────────────────────────┘
```

### Key Standards

1. **Agent Layer**:
   - OpenAI Agents SDK (official library)
   - Stateless agent initialization per request
   - Agent receives conversation history from database
   - Agent has access to MCP tools only
   - Agent MUST NOT access database, filesystem, or external APIs

2. **MCP Tools Layer**:
   - Official MCP SDK for tool definitions
   - Each tool is a Python function with Pydantic schemas
   - Tools receive user_id from chat endpoint (not from agent)
   - Tools call existing backend services (reuse Phase II code)
   - Tools return structured responses: `{"success": bool, "data": any, "error": str?}`

3. **Chat Endpoint**:
   - Stateless FastAPI endpoint: `POST /api/chat`
   - Request: `{conversation_id?: str, message: str}`
   - Response: `{conversation_id: str, message: str, tool_calls?: []}`
   - Validates JWT, extracts user_id
   - Loads conversation history from database
   - Initializes agent with MCP tools
   - Executes agent with user message
   - Persists all messages and tool calls
   - Returns agent response

4. **Database Schema**:
   - `conversations`: id, user_id, title?, created_at, updated_at
   - `messages`: id, conversation_id, role (user/assistant/system), content, created_at
   - `tool_calls`: id, message_id, tool_name, input_json, output_json, created_at
   - Foreign keys enforce referential integrity
   - Indexes on user_id and conversation_id for performance

5. **Security**:
   - Same JWT authentication as Phase II
   - User isolation enforced in MCP tools
   - Conversation history filtered by user_id
   - MCP tools validate task ownership before operations
   - No cross-user conversation access

### Constraints

- Use OpenAI Agents SDK (official)
- Use Official MCP SDK
- Stateless FastAPI chat endpoint
- Persist conversations and messages in Neon PostgreSQL
- No manual coding — Claude Code only
- Maintain Phase II REST API (backward compatible)

### Success Criteria

- Users can manage todos via natural language chat
- Agent correctly invokes MCP tools for task operations
- Conversation history persists and resumes after restart
- System remains secure with user isolation
- All AI actions are traceable in database
- Phase II REST API continues to work unchanged

---

## Technology Stack

### Phase II (Web Application)

| Category | Technology | Rationale |
|----------|-----------|-----------|
| Frontend Framework | Next.js 16+ (App Router) + TypeScript | Modern React, server-first, excellent DX |
| Styling | Tailwind CSS | Rapid development, consistency |
| Backend | FastAPI + Python 3.12+ | High-performance API, excellent type support |
| ORM / Models | SQLModel + Pydantic v2 | Type-safe models for DB & API |
| Database | Neon Serverless PostgreSQL | Scalable, developer-friendly Postgres |
| Authentication | Better Auth (JWT mode) | Modern, flexible, works with Next.js |
| JWT Verification | PyJWT + python-jose | Reliable, widely used |

### Phase III (AI Chatbot) - ADDITIONS

| Category | Technology | Rationale |
|----------|-----------|-----------|
| AI Agent Framework | OpenAI Agents SDK (official) | Official SDK, stateless design, tool support |
| Tool Protocol | MCP SDK (official) | Standard protocol for agent-tool communication |
| Agent Model | GPT-4 or GPT-4 Turbo | Reliable reasoning, tool use, conversation |
| Conversation Storage | PostgreSQL (new tables) | Reuse existing database, ACID guarantees |

---

## Code Style & Quality

### Python (Backend)
- Black + isort + ruff (default settings)
- Type hints everywhere feasible
- Pydantic models for all API schemas
- SQLModel for database models
- `Annotated` + `Depends` for dependency injection

### TypeScript (Frontend)
- Strict tsconfig (strict: true, no implicit any)
- Prefer Server Components
- Client Components only when needed (useState, useEffect, events)
- Async Server Components + loading.tsx + error.tsx

### Naming Conventions
- Database/models: snake_case
- API payloads: camelCase (JavaScript convention)
- URL paths: kebab-case
- Environment variables: SCREAMING_SNAKE_CASE
- Components: PascalCase

---

## Security Constitution

### Authentication (All Phases)
1. JWT secret MUST be identical in frontend & backend (via environment)
2. Every protected endpoint MUST validate JWT
3. User ID extracted from validated token only (never from request)
4. Never log tokens, credentials, or sensitive data

### Authorization (All Phases)
1. Every task operation MUST filter by authenticated user_id
2. Backend ALWAYS re-validates ownership
3. No cross-user data access possible
4. Ownership validation on all update/delete operations

### Phase III Additions
1. MCP tools receive user_id from chat endpoint (not from agent)
2. MCP tools MUST validate task ownership before operations
3. Conversation history filtered by user_id
4. Tool invocations logged for audit trail

---

## Error Handling

### Standard Error Shape

```typescript
{
  "success": boolean,
  "data"?: T,
  "error"?: {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

### Principles
- Expected errors → nice user messages (409, 403, 404)
- Unexpected errors → generic message + unique error ID for logs
- Frontend shows user-friendly notifications
- Backend returns consistent error shape
- No sensitive data in error messages

---

## Monorepo Structure

```
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md (this file)
│   ├── templates/
│   └── scripts/
├── specs/
│   ├── overview.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── history/
│   ├── prompts/
│   │   ├── constitution/
│   │   ├── <feature-name>/
│   │   └── general/
│   └── adr/
├── CONSTITUTION.md (Phase II version - deprecated, use .specify/memory/)
├── CLAUDE.md (root guidance)
├── frontend/
│   ├── CLAUDE.md
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/
│   ├── CLAUDE.md
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── api/
│   │   ├── agents/ (NEW - Phase III)
│   │   └── mcp_tools/ (NEW - Phase III)
│   └── ...
└── README.md
```

---

## Development Workflow (Mandatory)

1. **Write or read specifications** (Spec-Kit Plus)
2. **Generate an implementation plan** (`/sp.plan`)
3. **Break work into granular, testable tasks** (`/sp.tasks`)
4. **Implement code ONLY via Claude Code**
5. **Iterate by updating specs if requirements change**

🚫 Manual coding is NOT allowed
🚫 Skipping specs or tasks is NOT allowed

Evaluation based on:
- Specifications
- Prompts (PHRs)
- Planning
- Task breakdown
- Iterations
- Final implementation

---

## Prohibited Actions

🚫 No manual code writing
🚫 No AI features beyond approved scope
🚫 No bypassing authentication
🚫 No undocumented endpoints
🚫 No deviation from specifications
🚫 No agents accessing database directly (Phase III+)
🚫 No MCP tools with business logic in agents (Phase III+)
🚫 No stateful agent implementations (Phase III+)

---

## Governance

### Amendment Process

1. Propose amendment via specification process
2. Document rationale and impact
3. Update this constitution
4. Increment version (MAJOR.MINOR.PATCH)
5. Create migration plan if needed
6. Update dependent templates and documentation

### Version Policy

- **MAJOR**: Backward incompatible changes, new phases, architectural shifts
- **MINOR**: New principles, expanded guidance, new sections
- **PATCH**: Clarifications, typo fixes, non-semantic refinements

### Compliance

- All PRs/reviews MUST verify constitutional compliance
- Complexity MUST be justified against principles
- Specifications MUST align with constitutional requirements
- Agents MUST follow architectural boundaries

---

## Final Note

This Constitution is **immutable** unless explicitly updated via formal specification process. When in doubt, refer back to these principles.

**Remember**:
- Specifications are the Single Source of Truth
- This Constitution is the framework within which specifications operate
- Security and user isolation are non-negotiable
- Agent-first architecture requires clear boundaries (Phase III+)
- MCP tools are the ONLY interface between agents and data (Phase III+)
- Stateless design enables scalability and traceability (Phase III+)

---

**Version**: 2.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-02-02
