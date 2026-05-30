import os
import sys
from datetime import date
sys.path.insert(0, os.path.dirname(__file__))
 
from groq import Groq
from coral_runner import run_coral_query
from prompts import SYSTEM_PROMPT, get_query_prompt
 
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
 
FARMERS_DS = "36c30c1b-5668-80bf-8284-000b52d4d5c1"
TODAY = date.today().strftime("%d/%m/%Y")
 
# ── FIXED SQL FOR DASHBOARD ENDPOINTS ─────────────────────────
BRIEFING_SQL_TODAY = f"""
SELECT json_get_str(p.properties, 'farmer_name', 'rich_text', 0, 'plain_text') AS farmer_name,
       json_get_str(p.properties, 'crop',         'rich_text', 0, 'plain_text') AS crop,
       json_get_str(p.properties, 'district',      'select',   'name')          AS district,
       m.modal_price                                                             AS today_mandi_price
FROM notion.data_source_pages p
LEFT JOIN mandi.prices m
       ON m.commodity    = json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')
      AND m.state        = 'Karnataka'
      AND m.arrival_date = '{TODAY}'
WHERE p.data_source_id = '{FARMERS_DS}'
LIMIT 50
""".strip()
 
BRIEFING_SQL_ANY = f"""
SELECT json_get_str(p.properties, 'farmer_name', 'rich_text', 0, 'plain_text') AS farmer_name,
       json_get_str(p.properties, 'crop',         'rich_text', 0, 'plain_text') AS crop,
       json_get_str(p.properties, 'district',      'select',   'name')          AS district,
       m.modal_price                                                             AS today_mandi_price
FROM notion.data_source_pages p
LEFT JOIN mandi.prices m
       ON m.commodity = json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')
      AND m.state     = 'Karnataka'
WHERE p.data_source_id = '{FARMERS_DS}'
LIMIT 50
""".strip()
 
TOP_PRICES_SQL_TODAY = f"""
SELECT json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text') AS crop,
       CAST(m.modal_price AS INTEGER)                                    AS price
FROM notion.data_source_pages p
LEFT JOIN mandi.prices m
       ON m.commodity    = json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')
      AND m.state        = 'Karnataka'
      AND m.arrival_date = '{TODAY}'
WHERE p.data_source_id = '{FARMERS_DS}'
  AND m.modal_price IS NOT NULL
ORDER BY CAST(m.modal_price AS INTEGER) DESC
LIMIT 50
""".strip()
 
TOP_PRICES_SQL_ANY = f"""
SELECT json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text') AS crop,
       CAST(m.modal_price AS INTEGER)                                    AS price
FROM notion.data_source_pages p
LEFT JOIN mandi.prices m
       ON m.commodity = json_get_str(p.properties, 'crop', 'rich_text', 0, 'plain_text')
      AND m.state     = 'Karnataka'
WHERE p.data_source_id = '{FARMERS_DS}'
  AND m.modal_price IS NOT NULL
ORDER BY CAST(m.modal_price AS INTEGER) DESC
LIMIT 50
""".strip()
 
FIXED_SQL = {
    "morning briefing": (BRIEFING_SQL_TODAY, BRIEFING_SQL_ANY),
    "highest price":    (TOP_PRICES_SQL_TODAY, TOP_PRICES_SQL_ANY),
}
 
 
def _has_price_data(results: str) -> bool:
    if not results or not results.strip():
        return False
    for ln in results.splitlines():
        if "|" not in ln:
            continue
        if set(ln.strip()) <= set("+-= |"):
            continue
        cells = [c.strip() for c in ln.split("|") if c.strip()]
        if cells and cells[-1] and cells[-1] not in ("today_mandi_price", "price"):
            return True
    return False
 
 
def _looks_empty(results: str) -> bool:
    if not results or not results.strip():
        return True
    data_lines = [
        ln for ln in results.splitlines()
        if "|" in ln and not set(ln.strip()) <= set("+-= |")
    ]
    return len(data_lines) <= 1
 
 
def pick_fixed_sql(question: str):
    q = question.lower()
    for key, sqls in FIXED_SQL.items():
        if key in q:
            return sqls
    return None
 
 
def generate_sql(user_question: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": get_query_prompt(user_question)}
        ],
        temperature=0.1,
        max_tokens=500
    )
    sql = response.choices[0].message.content.strip()
    sql = sql.replace("```sql", "").replace("```", "").strip()
    return sql
 
 
def summarise_results(user_question: str, sql: str, results: str,
                      is_chat: bool = False) -> str:
    """
    Convert raw SQL results into plain English.
    is_chat=True → friendlier tone, handles empty results gracefully
                   instead of blocking with a hard error.
    """
    if is_chat and _looks_empty(results):
        # For chat questions, give a helpful human answer even when empty
        system_msg = (
            "You are Krishi AI, a friendly assistant for Karnataka farmers. "
            "The SQL query returned no results. Give a short, helpful, empathetic "
            "response in simple English explaining that the data isn't available "
            "right now from the government mandi source, and suggest the farmer "
            "try again later or check a local mandi. "
            "Never make up prices. Keep it under 3 sentences."
        )
        user_msg = f'The farmer asked: "{user_question}"\nThe query returned no data.'
    else:
        system_msg = (
            "You are Kisan Intelligence, an AI assistant for a Karnataka Farmer "
            "Producer Organisation. Convert SQL results into a clear, helpful answer "
            "in simple English. Be specific with numbers, names, and prices. "
            "Keep it under 5 sentences. Use ₹ for rupees.\n\n"
            "CRITICAL RULES:\n"
            "- Use ONLY names, crops, districts and prices that appear in the Results.\n"
            "- NEVER invent or guess any value.\n"
            "- If prices are missing (blank/NULL), say mandi prices are not available "
            "  right now but still mention the farmer names, crops and districts.\n"
            "- If Results are completely empty, say no data is available right now."
        )
        user_msg = (
            f"Question: {user_question}\n\n"
            f"SQL:\n{sql}\n\n"
            f"Results:\n{results}\n\n"
            "Give a clear, helpful answer based ONLY on these results."
        )
 
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user",   "content": user_msg}
        ],
        temperature=0.3,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()
 
 
def ask_kisan(question: str, is_chat: bool = False) -> dict:
    """
    Main agent function.
    is_chat=True  → free-form chat (/ask endpoint): friendly empty handling
    is_chat=False → dashboard endpoints: strict empty-guard
    """
    print(f"\n🌾 Question: {question}")
    print("─" * 50)
 
    fixed = pick_fixed_sql(question)
 
    if fixed:
        sql_dated, sql_any = fixed
 
        print(f"⚙️  Using fixed SQL (date: {TODAY})...")
        print(f"📝 SQL:\n{sql_dated}\n")
        print("🔍 Running query via Coral...")
        results = run_coral_query(sql_dated)
        print(f"📊 Raw Results:\n{results}\n")
 
        # If farmers show but prices are all blank, retry without date filter
        if not _looks_empty(results) and not _has_price_data(results):
            print("⚠️  Prices blank for today — retrying without date filter...")
            results_any = run_coral_query(sql_any)
            print(f"📊 Raw Results (no date):\n{results_any}\n")
            if _has_price_data(results_any):
                results = results_any
                sql_dated = sql_any
                print("✅ Got prices from undated query.")
 
        sql = sql_dated
 
        print("🤖 Generating answer...")
        if _looks_empty(results):
            summary = (
                "No data is available right now. The live mandi price source "
                "returned no rows — please try again in a moment."
            )
            print(f"✅ Answer (empty-guard):\n{summary}\n")
        else:
            summary = summarise_results(question, sql, results, is_chat=False)
            print(f"✅ Answer:\n{summary}\n")
 
    else:
        # Free-form question — generate SQL with LLM
        print("⚙️  Generating Coral SQL...")
        sql = generate_sql(question)
        print(f"📝 SQL:\n{sql}\n")
        print("🔍 Running query via Coral...")
        results = run_coral_query(sql)
        print(f"📊 Raw Results:\n{results}\n")
 
        print("🤖 Generating answer...")
        # For chat: always generate a human answer, even on empty results
        summary = summarise_results(question, sql, results, is_chat=is_chat)
        print(f"✅ Answer:\n{summary}\n")
 
    return {
        "question": question,
        "sql":      sql,
        "results":  results,
        "summary":  summary
    }
 
 
if __name__ == "__main__":
    questions = [
        "Give me a morning briefing — show farmer names, crops, districts and today's mandi prices"
    ]
    for q in questions:
        ask_kisan(q)
        print("=" * 60)