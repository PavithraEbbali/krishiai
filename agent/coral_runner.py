import subprocess
import json

def run_coral_query(sql: str) -> str:
    """
    Runs a Coral SQL query using the CLI and returns the result as a string.
    """
    try:
        result = subprocess.run(
            ["coral", "sql", sql],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            return f"Error running query: {result.stderr}"
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        return "Error: Query timed out after 30 seconds"
    except Exception as e:
        return f"Error: {str(e)}"


def test_connection():
    """Test that Coral is working."""
    result = run_coral_query(
        "SELECT DISTINCT schema_name FROM coral.tables ORDER BY 1"
    )
    print("Connected sources:")
    print(result)


if __name__ == "__main__":
    test_connection()