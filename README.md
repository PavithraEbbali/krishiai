# 🌾 KrishiAI — Kisan Intelligence

> **AI-powered enterprise platform for Farmer Producer Organisations (FPOs) in Karnataka, India.**
> Natural language → Coral SQL → Live data → Actionable insights.


[![Built with Coral](https://img.shields.io/badge/Powered%20by-Coral-orange?style=flat-square)](https://coral.so)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev)

---

## 📌 Overview

KrishiAI is a full-stack AI intelligence platform built for **Kolar Agri FPO (FPO_KAR_001)** — a Farmer Producer Organisation in Karnataka, India. It enables FPO operations managers and farmers to:

- Get a **live morning briefing** of all 12 member farmers with their crops, districts, and today's mandi prices
- Browse and filter the **Farm Portfolio** by crop and district
- Discover eligible **Government Schemes** (national + Karnataka state)
- Check **live Karnataka mandi commodity prices** from data.gov.in
- Ask **natural language questions** about their FPO data via an AI chat assistant

The platform uses **Coral** — a zero-ETL SQL engine that federates queries across Notion, live government APIs, and a schemes database — so there is no data pipeline, no data warehouse, and no manual synchronisation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│   (Vite + CSS-in-JS, dark theme, no Tailwind)        │
│   Dashboard · Farm Portfolio · Schemes · Prices      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (axios)
┌──────────────────────▼──────────────────────────────┐
│              FastAPI Backend (Python)                │
│   /morning-briefing  /schemes  /top-prices  /ask    │
└──────────────────────┬──────────────────────────────┘
                       │ ask_kisan()
┌──────────────────────▼──────────────────────────────┐
│                  Agent (agent.py)                   │
│  Fixed SQL for dashboard endpoints (LEFT JOIN)      │
│  LLM-generated SQL for free-form /ask chat          │
│  Groq (Llama 3.3 70B) for SQL generation + summary  │
└──────────────────────┬──────────────────────────────┘
                       │ coral sql "..."
┌──────────────────────▼──────────────────────────────┐
│                  Coral SQL Engine                   │
│  notion.data_source_pages  — 12 FPO farmers (Notion)│
│  mandi.prices              — Live data.gov.in API   │
│  schemes.gov_schemes       — Karnataka/National DB  │
│  weather.forecast          — Open-Meteo 7-day       │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Dashboard
- **Today's Briefing** — AI-generated morning summary of all farmers, crops, districts and live mandi prices
- **KPI Cards** — Total farmers, districts, active crops, available schemes (computed from live data)
- **Workspace Quick Links** — Jump to Farm Portfolio, Schemes, Market Prices

### Farm Portfolio
- Full member table with farmer avatar, crop tag, district and mandi price
- **Crop filter** — pill chips to filter by Maize / Rice / Tomato / Potato
- **District filter** — pill chips for Tumkur / Kolar / Chikkaballapur (combine with crop filter)
- Graceful "—" when a price is unavailable (never shows empty rows)

### Government Schemes
- 8 national + Karnataka state schemes rendered as cards
- Each card shows scheme name, full name, benefit type, subsidy amount, application deadline

### Market Prices
- Live Karnataka commodity rates from data.gov.in via Coral
- Crop filter with narrowed two-column table (crop close to price, no wide empty gap)
- AI Insight box summarising top prices

### Krishi AI Chat
- Floating FAB chat assistant grounded in live FPO data
- Natural language → Coral SQL → plain English answer
- Friendly responses when data is unavailable (no robotic error messages)
- Suggested questions for quick access

---

## 🗂️ Project Structure

```
krishiai/
├── agent/
│   ├── agent.py          # Core agent: SQL generation, execution, summarisation
│   ├── api.py            # FastAPI app with 4 endpoints
│   ├── coral_runner.py   # Coral CLI wrapper (subprocess)
│   └── prompts.py        # System prompt + query prompt (dynamic date)
├── frontend/
│   └── src/
│       └── App.jsx       # Complete single-file React app (CSS-in-JS, dark theme)
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Coral CLI](https://coral.so/docs) installed and authenticated
- Groq API key — [get one free](https://console.groq.com)
- Notion workspace with farmer data connected to Coral

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/PavithraEbbali/krishiai.git
cd krishiai

# Install Python dependencies
pip install -r requirements.txt

# Set your Groq API key
$env:GROQ_API_KEY = "your_groq_api_key_here"   # Windows PowerShell
# export GROQ_API_KEY="your_groq_api_key_here"  # macOS/Linux

# Start the backend
uvicorn agent.api:app --reload --port 8000
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/morning-briefing` | All farmers with crops, districts and today's mandi prices |
| `GET` | `/schemes` | Government schemes available for Karnataka farmers |
| `GET` | `/top-prices` | Highest-priced crops in Karnataka markets today |
| `POST` | `/ask` | Natural language question → SQL → answer |

### Example `/ask` request

```json
POST /ask
{
  "question": "Which farmers are growing Rice in Kolar district?"
}
```

```json
{
  "question": "Which farmers are growing Rice in Kolar district?",
  "sql": "SELECT ...",
  "results": "| Nagaraju P | Rice | Kolar | 2150 |...",
  "summary": "Two farmers in Kolar district grow Rice: Nagaraju P and Venkatesh M, with today's mandi price at ₹2150."
}
```

---

## 🛠️ Data Sources

| Source | Table | Description |
|--------|-------|-------------|
| Notion | `notion.data_source_pages` | 12 FPO member farmers — name, crop, district, land acres, nearest mandi |
| data.gov.in | `mandi.prices` | Live Karnataka commodity prices — commodity, market, modal/min/max price, arrival date |
| Custom DB | `schemes.gov_schemes` | 8 national + state schemes — eligibility, subsidy amount, deadlines |
| Open-Meteo | `weather.forecast` | 7-day weather forecast by coordinates |

---

## 🧠 AI Design Decisions

**Why fixed SQL for dashboard endpoints?**
The `/morning-briefing` and `/top-prices` endpoints use hardcoded deterministic SQL with `LEFT JOIN` rather than LLM-generated SQL. This prevents the LLM from writing a fresh INNER JOIN each call (which dropped all farmers when the live price source was temporarily empty) and eliminates hallucination of fake farmer names and prices when results are empty.

**Why LEFT JOIN?**
`mandi.prices` is a live government API source that returns data intermittently. An INNER JOIN would drop all 12 farmers from the table whenever the source returns nothing. LEFT JOIN ensures farmers always appear; a missing price shows as "—".

**Why dynamic date in prompts.py?**
The mandi prices table partitions by `arrival_date` in `DD/MM/YYYY` format. A hardcoded date would break every day. `TODAY = date.today().strftime("%d/%m/%Y")` is computed at server startup so it's always correct.

**Why `is_chat=True` for `/ask`?**
Dashboard endpoints use a strict empty-guard (returns a fixed message when SQL returns nothing). The chat endpoint uses a friendlier LLM-generated response so farmers get a helpful explanation when data isn't available, rather than a robotic error.

---

## 👩‍💻 Built By

**Pavithra Ebbali** — Computer Science Engineering, Don Bosco Institute of Technology (DBIT), Bengaluru

Built for the **Pirates of the Coral-bean** hackathon 🏴‍☠️

---

## 📄 License

MIT License — feel free to fork, adapt, and build on this for your own FPO or agri-tech project.
