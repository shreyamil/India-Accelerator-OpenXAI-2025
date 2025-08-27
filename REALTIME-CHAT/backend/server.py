# backend/server.py
from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat, ChatResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_model(req: ChatRequest):
    response: ChatResponse = chat(
        model="llama2",
        messages=[{"role": "user", "content": req.message}]
    )
    return {"response": response.message.content}
