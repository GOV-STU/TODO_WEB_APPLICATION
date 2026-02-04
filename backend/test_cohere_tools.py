"""Test script to verify Cohere tool calling works correctly."""
import os
import sys
from dotenv import load_dotenv
import cohere
from cohere import Tool, ToolParameterDefinitionsValue

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv('COHERE_API_KEY')
if not api_key:
    print("ERROR: COHERE_API_KEY not found in environment")
    sys.exit(1)

print(f"API Key found: {api_key[:10]}...")

# Initialize client
client = cohere.Client(api_key=api_key)

# Define a simple tool
tools = [
    Tool(
        name='create_task',
        description='Create a new task with a title',
        parameter_definitions={
            'title': ToolParameterDefinitionsValue(
                description='The task title',
                type='str',
                required=True
            )
        }
    )
]

print("\nTesting Cohere tool calling...")
print("Model: command-r-plus-08-2024")
print("Message: 'Add a task to buy milk'")
print("Tools:", [t.name for t in tools])

try:
    response = client.chat(
        model='command-r-plus-08-2024',
        message='Add a task to buy milk',
        tools=tools,
        temperature=0.3
    )

    print(f"\n[SUCCESS] API call successful")
    print(f"finish_reason: {response.finish_reason}")
    print(f"text: {response.text}")

    if hasattr(response, 'tool_calls') and response.tool_calls:
        print(f"\n[SUCCESS] Tool calls made: {len(response.tool_calls)}")
        for tc in response.tool_calls:
            print(f"  - {tc.name}: {tc.parameters}")
    else:
        print("\n[FAIL] No tool calls made")
        print("This indicates the model is not triggering tool usage")

except Exception as e:
    print(f"\n[ERROR] Error: {e}")
    sys.exit(1)
