from database import SessionLocal
from sqlalchemy import text

def test_db_connection():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        print("✅ Connection successful:", result.fetchone())
    except Exception as e:
        print("❌ Connection failed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    test_db_connection()
