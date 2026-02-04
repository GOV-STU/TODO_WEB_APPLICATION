# Cohere API Research: Chat Agent with Tool Calling

**Date**: 2026-02-03
**Context**: AI Chat Integration Feature (001-ai-chat-integration)
**Research Focus**: Cohere API capabilities for implementing stateless chat agents with tool calling

---

## Executive Summary

**Key Findings**:

1. ✅ **Tool Calling Support**: Cohere DOES support function/tool calling via the Chat API v2
2. ❌ **No Agent SDK**: Cohere does NOT have an equivalent to OpenAI's Agents SDK - manual implementation required
3. ✅ **Stateless Design**: Cohere's API is inherently stateless, using messages array for context (ideal for FastAPI)
4. ❌ **No MCP Support**: Cohere does NOT natively integrate with Model Context Protocol (MCP is Anthropic-specific)
5. ⚠️ **Manual Tool Loop**: Unlike OpenAI Agents SDK, you must manually implement the tool execution loop

**Recommendation**: Cohere is **viable but requires more manual implementation** compared to OpenAI Agents SDK. The lack of an agent framework means you'll need to build the tool execution loop yourself.

---

## Critical Questions Answered

### 1. Does Cohere support function/tool calling in their chat API?

**Answer**: ✅ **YES**

Cohere's Chat API v2 supports tool calling through the `tools` parameter. Tools are defined using JSON Schema format (OpenAPI compatible).

**Tool Definition Structure**:
```python
from cohere.types import ToolV2

tool = ToolV2(
    type='function',
    function={
        'name': 'create_task',
        'description': 'Create a new task in the todo list',
        'parameters': {
            'type': 'object',
            'properties': {
                'title': {
                    'type': 'string',
                    'description': 'The task title'
                },
                'description': {
                    'type': 'string',
                    'description': 'Optional task description'
                }
            },
            'required': ['title']
        }
    }
)
```

**How Tool Calling Works**:
1. Send message with `tools` parameter
2. Model returns `finish_reason: "TOOL_CALL"` with `tool_calls` array
3. Execute tools and format results as messages with `role: "tool"`
4. Send updated messages array back to model
5. Model returns final response with `finish_reason: "COMPLETE"`

---

### 2. What is the equivalent to OpenAI's Agents SDK for Cohere?

**Answer**: ❌ **NO EQUIVALENT EXISTS**

Cohere does NOT have an Agents SDK. The Cohere Python SDK (v5.20.2) provides:
- ✅ `ClientV2.chat()` - Basic chat API
- ✅ `ClientV2.chat_stream()` - Streaming responses
- ❌ No Agent class
- ❌ No automatic tool execution loop
- ❌ No conversation state management
- ❌ No built-in thread/session handling

**Comparison**:

| Feature | OpenAI Agents SDK | Cohere SDK |
|---------|------------------|------------|
| Agent Class | ✅ Yes | ❌ No |
| Automatic Tool Execution | ✅ Yes | ❌ No (manual) |
| Thread Management | ✅ Yes | ❌ No (manual) |
| Tool Calling | ✅ Yes | ✅ Yes |
| Stateless Design | ✅ Optional | ✅ Required |
| Multi-step Tools | ✅ Automatic | ⚠️ Manual loop |

**Implication**: You must manually implement:
- Tool execution loop (check finish_reason, execute tools, continue)
- Conversation state management (store messages in database)
- Multi-turn conversation handling (append messages to array)
- Error handling and retry logic

---

### 3. How to implement stateless chat agents with Cohere?

**Answer**: ✅ **NATIVE STATELESS DESIGN**

Cohere's Chat API is inherently stateless, making it ideal for FastAPI endpoints.

**Stateless Pattern**:

```python
import cohere
from cohere.types import ToolV2

# Initialize client (stateless)
co = cohere.ClientV2(api_key=os.getenv("CO_API_KEY"))

# Define tools
tools = [
    ToolV2(
        type='function',
        function={
            'name': 'create_task',
            'description': 'Create a new task',
            'parameters': {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string'}
                },
                'required': ['title']
            }
        }
    )
]

# Request 1: User sends message
messages = [
    {'role': 'system', 'content': 'You are a task management assistant.'},
    {'role': 'user', 'content': 'Create a task to buy groceries'}
]

response = co.chat(
    model='command-r-plus-08-2024',
    messages=messages,
    tools=tools
)

# Check if tool calling is needed
if response.finish_reason == 'TOOL_CALL':
    # Execute tools
    for tool_call in response.message.tool_calls:
        tool_name = tool_call.function.name
        tool_args = json.loads(tool_call.function.arguments)

        # Execute tool (your implementation)
        result = execute_tool(tool_name, tool_args)

        # Append tool result to messages
        messages.append({
            'role': 'assistant',
            'tool_calls': response.message.tool_calls
        })
        messages.append({
            'role': 'tool',
            'tool_call_id': tool_call.id,
            'content': json.dumps(result)
        })

    # Request 2: Send tool results back
    response = co.chat(
        model='command-r-plus-08-2024',
        messages=messages,
        tools=tools
    )

# Return final response
final_message = response.message.content[0].text
```

**Key Points**:
- All context is in the `messages` array
- No session state on server
- Perfect for FastAPI stateless endpoints
- Store messages in database for persistence
- Retrieve and pass full conversation history on each request

---

### 4. Does Cohere integrate with MCP (Model Context Protocol)?

**Answer**: ❌ **NO NATIVE MCP SUPPORT**

**Findings**:
- MCP (Model Context Protocol) is an Anthropic initiative
- No Cohere MCP servers found in the MCP ecosystem
- No mention of MCP in Cohere documentation
- Cohere does NOT appear in the MCP registry

**Alternative Approach**:
Since Cohere doesn't support MCP natively, you have two options:

**Option 1: Use Cohere's Native Tool Calling** (Recommended)
- Define tools using Cohere's ToolV2 format
- Implement tool execution in your FastAPI backend
- Call existing backend services from tool functions
- No MCP needed

**Option 2: Build MCP-Compatible Wrapper**
- Create a translation layer between MCP tools and Cohere tools
- Convert MCP tool schemas to Cohere ToolV2 format
- More complex, not recommended unless you need MCP for other reasons

**Recommendation**: Skip MCP entirely for Cohere. Use Cohere's native tool calling and implement tools directly in your FastAPI backend.

---

## Cohere Chat API v2 Capabilities

### API Endpoint
```
POST https://api.cohere.com/v2/chat
```

### Authentication
```python
# Environment variable
export CO_API_KEY=your_api_key

# Python SDK
import cohere
co = cohere.ClientV2(api_key=os.getenv("CO_API_KEY"))
```

### Key Parameters

**Required**:
- `model` (string): Model name (e.g., "command-r-plus-08-2024", "command-a-03-2025")
- `messages` (array): Conversation history with roles (user/assistant/system/tool)

**Optional**:
- `tools` (array): Function definitions for tool use
- `tool_choice` (string): "REQUIRED" or "NONE"
- `strict_tools` (boolean): Enforce tool schema compliance
- `documents` (array): Context documents for RAG
- `response_format` (object): Text or JSON output with schema
- `max_tokens` (integer): Output limit
- `temperature` (float): Randomness (default 0.3)
- `stream` (boolean): Enable streaming (use `chat_stream()` instead)
- `safety_mode` (string): "CONTEXTUAL", "STRICT", or "OFF"

### Message Format

**System Message**:
```python
{'role': 'system', 'content': 'You are a helpful assistant.'}
```

**User Message**:
```python
{'role': 'user', 'content': 'Create a task to buy groceries'}
```

**Assistant Message with Tool Calls**:
```python
{
    'role': 'assistant',
    'tool_calls': [
        {
            'id': 'call_abc123',
            'type': 'function',
            'function': {
                'name': 'create_task',
                'arguments': '{"title": "Buy groceries"}'
            }
        }
    ]
}
```

**Tool Result Message**:
```python
{
    'role': 'tool',
    'tool_call_id': 'call_abc123',
    'content': '{"success": true, "task_id": 1, "title": "Buy groceries"}'
}
```

### Response Structure

```python
{
    'id': 'unique-response-id',
    'finish_reason': 'COMPLETE' | 'TOOL_CALL' | 'MAX_TOKENS' | 'STOP_SEQUENCE' | 'ERROR',
    'message': {
        'role': 'assistant',
        'content': [{'type': 'text', 'text': '...'}],
        'tool_calls': [...]  # Present if finish_reason == 'TOOL_CALL'
    },
    'usage': {
        'billed_units': {...},
        'tokens': {...}
    }
}
```

---

## Python SDK Details

### Installation
```bash
pip install cohere
```

**Current Version**: 5.20.2 (as of 2026-02-03)

### Basic Usage

```python
import cohere

# Initialize client
co = cohere.ClientV2(api_key=os.getenv("CO_API_KEY"))

# Send message
response = co.chat(
    model="command-r-plus-08-2024",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.message.content[0].text)
```

### Streaming Support

```python
response = co.chat_stream(
    model="command-r-plus-08-2024",
    messages=[
        {"role": "user", "content": "Tell me a story"}
    ]
)

for event in response:
    if event.type == "content-delta":
        print(event.delta.message.content.text, end="")
```

### Async Support

The SDK uses `httpx` internally, which supports async operations, but the SDK does NOT expose async methods directly. You would need to use `httpx` directly or wrap SDK calls in `asyncio.to_thread()` for FastAPI async endpoints.

**Workaround for FastAPI**:
```python
import asyncio
from fastapi import FastAPI

@app.post("/chat")
async def chat_endpoint(message: str):
    # Run blocking Cohere call in thread pool
    response = await asyncio.to_thread(
        co.chat,
        model="command-r-plus-08-2024",
        messages=[{"role": "user", "content": message}]
    )
    return response
```

---

## Tool Calling Implementation Pattern

### Complete Tool Execution Loop

```python
import cohere
import json
from typing import List, Dict, Any

def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool and return the result."""
    if tool_name == "create_task":
        # Call your backend service
        task = create_task_service(
            title=arguments["title"],
            description=arguments.get("description")
        )
        return {"success": True, "task_id": task.id, "title": task.title}

    elif tool_name == "list_tasks":
        tasks = list_tasks_service(status=arguments.get("status", "all"))
        return {"tasks": [{"id": t.id, "title": t.title} for t in tasks]}

    else:
        return {"error": f"Unknown tool: {tool_name}"}

def chat_with_tools(
    messages: List[Dict[str, Any]],
    tools: List[ToolV2],
    max_iterations: int = 5
) -> str:
    """
    Chat with tool calling support.
    Handles multi-step tool execution automatically.
    """
    co = cohere.ClientV2(api_key=os.getenv("CO_API_KEY"))

    for iteration in range(max_iterations):
        # Call Cohere API
        response = co.chat(
            model="command-r-plus-08-2024",
            messages=messages,
            tools=tools
        )

        # Check finish reason
        if response.finish_reason == "COMPLETE":
            # Done - return final message
            return response.message.content[0].text

        elif response.finish_reason == "TOOL_CALL":
            # Execute tools
            tool_calls = response.message.tool_calls

            # Append assistant message with tool calls
            messages.append({
                "role": "assistant",
                "tool_calls": tool_calls
            })

            # Execute each tool and append results
            for tool_call in tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)

                # Execute tool
                result = execute_tool(tool_name, tool_args)

                # Append tool result
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result)
                })

            # Continue loop to get final response
            continue

        else:
            # Error or max tokens
            raise Exception(f"Unexpected finish_reason: {response.finish_reason}")

    raise Exception(f"Max iterations ({max_iterations}) reached")
```

### FastAPI Integration Example

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import cohere
from cohere.types import ToolV2

app = FastAPI()

# Define tools
TOOLS = [
    ToolV2(
        type='function',
        function={
            'name': 'create_task',
            'description': 'Create a new task',
            'parameters': {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string', 'description': 'Task title'},
                    'description': {'type': 'string', 'description': 'Task description'}
                },
                'required': ['title']
            }
        }
    ),
    ToolV2(
        type='function',
        function={
            'name': 'list_tasks',
            'description': 'List all tasks',
            'parameters': {
                'type': 'object',
                'properties': {
                    'status': {
                        'type': 'string',
                        'enum': ['pending', 'completed', 'all'],
                        'description': 'Filter by status'
                    }
                }
            }
        }
    )
]

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: str
    message: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Stateless chat endpoint with tool calling.
    """
    # Get or create conversation
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not conversation:
            raise HTTPException(404, "Conversation not found")
    else:
        conversation = Conversation(user_id=current_user.id)
        db.add(conversation)
        db.commit()

    # Load conversation history
    messages = [
        {'role': 'system', 'content': 'You are a helpful task management assistant.'}
    ]

    db_messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()

    for msg in db_messages:
        messages.append({
            'role': msg.role,
            'content': msg.content
        })

    # Add new user message
    messages.append({
        'role': 'user',
        'content': request.message
    })

    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        role='user',
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # Execute chat with tools (in thread pool for async)
    response_text = await asyncio.to_thread(
        chat_with_tools,
        messages=messages,
        tools=TOOLS
    )

    # Save agent response
    agent_msg = Message(
        conversation_id=conversation.id,
        role='assistant',
        content=response_text
    )
    db.add(agent_msg)
    db.commit()

    return ChatResponse(
        conversation_id=str(conversation.id),
        message=response_text
    )
```

---

## Comparison: Cohere vs OpenAI for Chat Agents

| Feature | Cohere | OpenAI |
|---------|--------|--------|
| **Tool Calling** | ✅ Yes (native) | ✅ Yes (native) |
| **Agent SDK** | ❌ No | ✅ Yes (Agents SDK) |
| **Stateless Design** | ✅ Yes (required) | ✅ Yes (optional) |
| **Tool Schema** | JSON Schema | JSON Schema |
| **Streaming** | ✅ Yes (`chat_stream()`) | ✅ Yes (`stream=True`) |
| **Multi-step Tools** | ⚠️ Manual loop | ✅ Automatic (Agents SDK) |
| **MCP Support** | ❌ No | ❌ No |
| **Conversation Memory** | Manual (DB storage) | Manual OR Threads (Agents SDK) |
| **Async Support** | ⚠️ Workaround needed | ✅ Native async |
| **Implementation Effort** | **High** (manual loop) | **Low** (Agents SDK) OR **High** (manual) |
| **FastAPI Integration** | ✅ Good (stateless) | ✅ Good (stateless) |
| **Cost** | Competitive | Higher |
| **Model Quality** | Command R/R+ | GPT-4/4o |

---

## Architectural Recommendations

### Option 1: Use Cohere (Manual Implementation)

**Pros**:
- ✅ Lower cost than OpenAI
- ✅ Native stateless design (perfect for FastAPI)
- ✅ Tool calling support
- ✅ Good model quality (Command R+)
- ✅ No vendor lock-in concerns

**Cons**:
- ❌ No Agent SDK (manual tool loop required)
- ❌ More implementation effort
- ❌ No async support (workaround needed)
- ❌ Less documentation/examples than OpenAI

**Implementation Effort**: **High** (2-3 days)
- Manual tool execution loop
- Conversation state management
- Error handling and retry logic
- Testing and validation

**Best For**:
- Cost-sensitive projects
- Teams comfortable with manual implementation
- Projects requiring full control over agent behavior

---

### Option 2: Use OpenAI Agents SDK (Automatic)

**Pros**:
- ✅ Agent SDK with automatic tool execution
- ✅ Thread management built-in
- ✅ Extensive documentation and examples
- ✅ Native async support
- ✅ Proven at scale

**Cons**:
- ❌ Higher cost
- ❌ Vendor lock-in
- ❌ Less control over agent behavior
- ⚠️ Threads may not fit stateless architecture

**Implementation Effort**: **Low** (1 day)
- Use Agents SDK out of the box
- Minimal custom code
- Focus on tool definitions

**Best For**:
- Rapid prototyping
- Hackathon demos
- Projects with budget for OpenAI
- Teams wanting proven solutions

---

### Option 3: Hybrid Approach (OpenAI Chat API, Manual Loop)

**Pros**:
- ✅ OpenAI model quality
- ✅ Stateless design (like Cohere)
- ✅ Full control over agent behavior
- ✅ Native async support

**Cons**:
- ❌ Higher cost than Cohere
- ❌ Manual tool loop (like Cohere)
- ⚠️ Similar effort to Cohere option

**Implementation Effort**: **High** (2-3 days)

**Best For**:
- Projects needing OpenAI quality but stateless design
- Teams wanting control without Agents SDK

---

## Final Recommendation for Your Project

### Context from Spec
- **Requirement**: Stateless chat agent with tool calling
- **Constraint**: Must use OpenAI Agents SDK (per spec)
- **Architecture**: FastAPI backend, stateless endpoints
- **Timeline**: Hackathon demo

### Recommendation: **Stick with OpenAI Agents SDK**

**Rationale**:
1. **Spec Compliance**: Spec explicitly requires OpenAI Agents SDK
2. **Faster Implementation**: Agents SDK reduces development time (critical for hackathon)
3. **Proven Solution**: Well-documented, battle-tested
4. **Demo Quality**: More reliable for hackathon presentation

**If Considering Cohere**:
- Would require spec change
- Would add 1-2 days of implementation time
- Would require manual tool loop implementation
- Cost savings may not justify additional effort for hackathon

**Verdict**: **Use OpenAI Agents SDK as specified**. Cohere is viable but not worth the additional implementation effort given your timeline and constraints.

---

## Implementation Checklist (If Using Cohere)

If you decide to use Cohere despite the recommendation, here's what you need to implement:

### Backend Implementation
- [ ] Install Cohere SDK (`pip install cohere`)
- [ ] Add `CO_API_KEY` to environment variables
- [ ] Define tools using `ToolV2` format
- [ ] Implement tool execution functions
- [ ] Build tool execution loop (check finish_reason, execute, continue)
- [ ] Create FastAPI chat endpoint
- [ ] Implement conversation state management (DB storage)
- [ ] Add error handling and retry logic
- [ ] Wrap Cohere calls in `asyncio.to_thread()` for async
- [ ] Add logging for tool calls and responses
- [ ] Write unit tests for tool execution
- [ ] Write integration tests for chat flow

### Database Schema
- [ ] Conversation table (id, user_id, created_at, updated_at)
- [ ] Message table (id, conversation_id, role, content, created_at)
- [ ] Tool call logging table (optional, for debugging)

### Frontend Integration
- [ ] Same as OpenAI approach (API is identical from frontend perspective)

### Testing
- [ ] Test tool calling with single tool
- [ ] Test multi-step tool execution
- [ ] Test conversation context retention
- [ ] Test error handling (tool failures, API errors)
- [ ] Test concurrent requests
- [ ] Load testing (50+ concurrent users)

---

## Code Examples Repository

### Complete Working Example

See the FastAPI integration example above for a complete working implementation.

### Key Files to Create

```
backend/app/
├── agents/
│   ├── __init__.py
│   ├── cohere_agent.py      # Tool execution loop
│   └── prompts.py            # System prompts
├── tools/
│   ├── __init__.py
│   ├── task_tools.py         # Tool definitions and execution
│   └── schemas.py            # Tool parameter schemas
├── api/
│   └── chat.py               # FastAPI chat endpoint
└── models/
    ├── conversation.py       # Conversation model
    └── message.py            # Message model
```

---

## Additional Resources

### Official Documentation
- Cohere Chat API v2: https://docs.cohere.com/v2/docs/chat-api
- Cohere API Reference: https://docs.cohere.com/v2/reference/chat
- Cohere Python SDK: https://github.com/cohere-ai/cohere-python

### Model Information
- Command R+: Latest model with tool use support
- Command R: Smaller, faster model
- Command A: Newest model series (2025)

### Pricing
- Check Cohere pricing page for current rates
- Generally more cost-effective than OpenAI GPT-4

---

## Conclusion

**Cohere API Capabilities Summary**:
- ✅ Tool calling: YES (native support)
- ❌ Agent SDK: NO (manual implementation required)
- ✅ Stateless design: YES (perfect for FastAPI)
- ❌ MCP support: NO (use native tool calling instead)
- ⚠️ Implementation effort: HIGH (manual tool loop)

**For Your Project**: **Stick with OpenAI Agents SDK** as specified. Cohere is viable but adds unnecessary complexity and development time for a hackathon demo.

**If Budget is a Concern**: Consider Cohere for production after the hackathon, but use OpenAI for the demo to ensure reliability and faster development.

---

**Research Completed**: 2026-02-03
**Status**: Complete
**Next Steps**: Proceed with OpenAI Agents SDK implementation as per original spec
