import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import ask_kisan
 
app = FastAPI(title="Kisan Intelligence API")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
class QuestionRequest(BaseModel):
    question: str
 
@app.get("/health")
def health():
    return {"status": "ok", "service": "Kisan Intelligence"}
 
@app.post("/ask")
def ask(request: QuestionRequest):
    # is_chat=True gives a friendly human response even when data is empty
    result = ask_kisan(request.question, is_chat=True)
    return result
 
@app.get("/morning-briefing")
def morning_briefing():
    result = ask_kisan(
        "Give me a morning briefing showing all farmer names, crops, districts and today's mandi prices"
    )
    return result
 
@app.get("/schemes")
def schemes():
    result = ask_kisan(
        "What government schemes are available for farmers in Karnataka?"
    )
    return result
 
@app.get("/top-prices")
def top_prices():
    result = ask_kisan(
        "Which crops have the highest price in Karnataka markets today?"
    )
    return result
 