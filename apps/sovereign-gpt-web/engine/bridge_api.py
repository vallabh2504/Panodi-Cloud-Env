"""
Sovereign GPT — Bridge API
FastAPI server that bridges the frontend chat UI to an LLM backend.
Supports OpenAI-compatible APIs (OpenAI, Ollama, LM Studio, etc.)
"""

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import httpx

app = FastAPI(title="Sovereign GPT Bridge API", version="1.0.0")

# CORS — allow the Vite dev server and production origins
ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LLM Configuration — defaults to OpenAI but works with any compatible API
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")

SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", (
    "You are Sovereign GPT, an autonomous AI assistant running inside the Factory Loop. "
    "You are direct, technical, and helpful. You speak with quiet confidence. "
    "Keep responses concise unless the user asks for detail."
))


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    stream: Optional[bool] = True


@app.get("/health")
async def health():
    return {"status": "online", "model": LLM_MODEL, "engine": "sovereign-bridge-v1"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY not configured")

    # Build the message payload with system prompt
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": LLM_MODEL,
        "messages": messages,
        "stream": request.stream,
    }

    if request.stream:
        return StreamingResponse(
            _stream_llm_response(headers, payload),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    else:
        return await _blocking_llm_response(headers, payload)


async def _stream_llm_response(headers: dict, payload: dict):
    """Stream tokens from the LLM as Server-Sent Events."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            f"{LLM_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        ) as response:
            if response.status_code != 200:
                error_body = await response.aread()
                yield f"data: {json.dumps({'error': error_body.decode()})}\n\n"
                return

            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data.strip() == "[DONE]":
                        yield "data: [DONE]\n\n"
                        return

                    try:
                        chunk = json.loads(data)
                        delta = chunk["choices"][0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue


async def _blocking_llm_response(headers: dict, payload: dict) -> dict:
    """Non-streaming single response from the LLM."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{LLM_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        content = data["choices"][0]["message"]["content"]
        return {"content": content, "model": data.get("model", LLM_MODEL)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
