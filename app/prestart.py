import logging
import sqlite3
from pathlib import Path
from .core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    Path("/data").mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(settings.DB_PATH)
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS audience_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        audience TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    conn.close()


def main() -> None:
    logger.info("Initializing app")
    init()  # Do stuff here
    logger.info("Finished initializing app")


if __name__ == "__main__":
    main()
