#!/usr/bin/env python3
"""
Hugging Face Space Entry Point
This file provides a compatible entry point for Hugging Face Spaces
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import and run the FastAPI app
try:
    from app.main import app

    if __name__ == "__main__":
        import uvicorn

        # Get port from environment (Hugging Face sets this)
        port = int(os.environ.get("PORT", 8000))

        print(f"Starting FastAPI server on port {port}")
        print(f"Health check: http://localhost:{port}/health")
        print(f"Docs: http://localhost:{port}/docs")

        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=port,
            reload=False,  # Disable reload for production
            log_level="info"
        )
except ImportError as e:
    print(f"Import error: {e}")
    print("Please ensure all dependencies are installed")
    sys.exit(1)
except Exception as e:
    print(f"Error starting server: {e}")
    sys.exit(1)
