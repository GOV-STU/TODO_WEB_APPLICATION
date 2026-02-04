---
id: 001
title: Update constitution for Phase III AI chatbot
stage: constitution
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5
feature: none
branch: main
user: system
command: /sp.constitution
labels: ["constitution", "phase-3", "ai-chatbot", "architecture", "mcp-tools", "openai-agents"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

(Phase-III Update)
Project Extension: AI-Powered Todo Chatbot
Core addition:
- Agent-first design using OpenAI Agents SDK
- Stateless chat and tool execution
- All task actions executed only via MCP tools
- Clear separation: UI -> Agent -> MCP Tools -> Database

Key standards:
- Agents must not access the database directly
- MCP tools must be stateless and schema-defined
- Conversation context rebuilt from database each request
- All AI actions traceable and persisted
- Project auth and user isolation rules remain enforced

Constraints:
- Use OpenAI Agents SDK and Official MCP SDK
- Stateless FastAPI chat endpoint
- Persist conversations and messages in Neon PostgreSQL
- No manual coding; Claude Code only

Success criteria:
- Users manage todos via natural language
- Agent correctly invokes MCP tools
- Conversation resumes after restart
- System remains secure and stateless

## Response snapshot

Successfully updated the project constitution from v1.0 to v2.0.0 (MAJOR version bump) to incorporate Phase III AI-powered chatbot requirements.

**Key Changes:**

1. **Added Three New Core Principles:**
   - Principle VI: Agent-First Architecture - Mandates OpenAI Agents SDK, stateless design, and agent-tool separation
   - Principle VII: MCP Tool Architecture - Establishes MCP tools as exclusive interface between agents and data
   - Principle VIII: Stateless & Traceable AI - Requires conversation persistence and full traceability

2. **Added Phase III Requirements Section:**
   - Detailed architecture diagram showing UI → Agent → MCP Tools → Database flow
   - Key standards for Agent Layer, MCP Tools Layer, Chat Endpoint, Database Schema, and Security
   - Explicit constraints and success criteria

3. **Expanded Existing Principles:**
   - Updated Principle IV (Clean Separation of Concerns) to include Phase III architecture
   - Enhanced Security Constitution with Phase III additions
   - Updated Technology Stack with AI-specific additions (OpenAI Agents SDK, MCP SDK, GPT-4)

4. **Updated Project Structure:**
   - Added backend/app/agents/ directory for Phase III
   - Added backend/app/mcp_tools/ directory for Phase III
   - Added new database tables: conversations, messages, tool_calls

5. **Enhanced Prohibited Actions:**
   - No agents accessing database directly
   - No MCP tools with business logic in agents
   - No stateful agent implementations

**Version Bump Rationale (MAJOR 2.0.0):**
- Introduces fundamentally new architectural patterns (agent-based interaction layer)
- Adds MCP tools as mandatory abstraction layer
- Changes system boundaries and interaction patterns
- Backward compatible with Phase II REST API, but adds new architectural layer

**Template Compatibility:**
All dependent templates reviewed and confirmed compatible:
- ✅ spec-template.md
- ✅ plan-template.md
- ✅ tasks-template.md
- ✅ phr-template.prompt.md

## Outcome

- ✅ Impact: Constitution updated to v2.0.0 with comprehensive Phase III AI chatbot requirements
- 🧪 Tests: N/A (constitution document)
- 📁 Files: 1 file updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Create Phase III feature specification, plan AI chatbot architecture, define MCP tool schemas
- 🧠 Reflection: Successfully integrated Phase III requirements while maintaining all Phase II principles. Clear architectural boundaries established between agents, MCP tools, and data layer. Security and user isolation principles extended to cover AI interactions.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin Phase III specification with /sp.specify command to define AI chatbot feature requirements
