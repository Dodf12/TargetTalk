import sqlite3
from .config import settings

def save_audience(audience: str):
    conn = sqlite3.connect(settings.DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO audience_logs (audience) VALUES (?)",
        (audience,)
    )
    conn.commit()
    conn.close()

def get_top_audiences(limit=3):
    conn = sqlite3.connect(settings.DB_PATH)
    c = conn.cursor()
    c.execute('''
    SELECT audience, COUNT(*) as total
    FROM audience_logs
    GROUP BY audience
    ORDER BY total DESC
    LIMIT ?
    ''', (limit,))
    results = c.fetchall()
    conn.close()
    return results

