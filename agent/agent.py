import os
from groq import Groq
from coral_runner import run_coral_query
from prompts import SYSTEM_PROMPT, get_query_prompt

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_sql(user_question: str) -> str:
    """Use Groq LLM to generate a Coral SQL query from natural language."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": get_query_prompt(user_question)}
        ],
        temperature=0.1,
        max_tokens=500
    )
    sql = response.choices[0].message.content.strip()
    # Clean up if LLM adds markdown
    sql = sql.replace("```sql", "").replace("```", "").strip()
    return sql


def summarise_results(user_question: str, sql: str, results: str) -> str:
    """Use Groq LLM to convert raw SQL results into plain English."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are Kisan Intelligence, an AI assistant for 
                a Karnataka Farmer Producer Organisation. 
                Convert the SQL query results into a clear, helpful answer 
                in simple English. Be specific with numbers, names, and prices.
                Keep it under 5 sentences. Use ₹ for rupees."""
            },
            {
                "role": "user",
                "content": f"""
Question: {user_question}

SQL Query Used:
{sql}

Results:
{results}

Give a clear, helpful answer based on these results.
"""
            }
        ],
        temperature=0.3,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()


def ask_kisan(question: str) -> dict:
    """
    Main agent function.
    Takes a natural language question and returns SQL + results + summary.
    """
    print(f"\n🌾 Question: {question}")
    print("─" * 50)

    # Step 1: Generate SQL
    print("⚙️  Generating Coral SQL...")
    sql = generate_sql(question)
    print(f"📝 SQL:\n{sql}\n")

    # Step 2: Run SQL via Coral
    print("🔍 Running query via Coral...")
    results = run_coral_query(sql)
    print(f"📊 Raw Results:\n{results}\n")

    # Step 3: Summarise
    print("🤖 Generating answer...")
    summary = summarise_results(question, sql, results)
    print(f"✅ Answer:\n{summary}\n")

    return {
        "question": question,
        "sql": sql,
        "results": results,
        "summary": summary
    }


if __name__ == "__main__":
    # Set your Groq API key
    # Test with 3 questions
    questions = [
        "Give me a morning briefing — show farmer names, crops, districts and today's mandi prices"
    ]

    for q in questions:
        ask_kisan(q)
        print("=" * 60)