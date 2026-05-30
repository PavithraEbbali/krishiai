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
    # Hardcoded — schemes.gov_schemes is not currently registered in Coral
    results = """+-------------+-------------------------------------------+--------------------------+-------------------------------+--------------------------------------------------+----------------------+
| scheme_name | full_name                                 | eligible_crops           | benefit_type                  | subsidy_amount                                   | application_deadline |
+-------------+-------------------------------------------+--------------------------+-------------------------------+--------------------------------------------------+----------------------+
| PM-KISAN    | Pradhan Mantri Kisan Samman Nidhi         | All                      | Direct Cash Transfer          | 6000 per year                                    | 2026-06-30           |
| PMFBY       | Pradhan Mantri Fasal Bima Yojana          | Tomato,Rice,Maize,Potato | Crop Insurance                | Up to 2 lakh per claim                           | 2026-06-15           |
| RKVY        | Rashtriya Krishi Vikas Yojana             | All                      | Infrastructure Grant          | Up to 50000 per farmer                           | 2026-07-31           |
| Raitha Siri | Karnataka Raitha Siri                     | Tomato,Potato,Onion      | Price Support                 | Up to 30000 per season                           | 2026-06-20           |
| NHM         | National Horticulture Mission             | Tomato,Potato            | Subsidy on inputs             | 25000 per hectare                                | 2026-08-15           |
| SMAM        | Sub Mission on Agricultural Mechanization | Rice,Maize               | Equipment Subsidy             | 50 percent subsidy up to 1 lakh                  | 2026-09-30           |
| PKVY        | Paramparagat Krishi Vikas Yojana          | All                      | Organic Farming Support       | 50000 per hectare over 3 years                   | 2026-07-15           |
| AIF         | Agriculture Infrastructure Fund           | All                      | Loan with Interest Subvention | 3 percent interest subvention up to 2 crore loan | 2026-12-31           |
+-------------+-------------------------------------------+--------------------------+-------------------------------+--------------------------------------------------+----------------------+"""
    summary = ("Karnataka farmers can benefit from 8 government schemes. PM-KISAN provides ₹6,000 per year, "
               "PMFBY offers crop insurance up to ₹2 lakh per claim, and Raitha Siri gives price support up to "
               "₹30,000 per season. Other schemes include RKVY, NHM, SMAM, PKVY, and AIF with various subsidies "
               "and grants. Application deadlines range from June 2026 to December 2026.")
    return {
        "question": "What government schemes are available for farmers in Karnataka?",
        "sql": "-- Hardcoded (schemes schema not registered in Coral)",
        "results": results,
        "summary": summary
    }
 
@app.get("/top-prices")
def top_prices():
    result = ask_kisan(
        "Which crops have the highest price in Karnataka markets today?"
    )
    return result
 