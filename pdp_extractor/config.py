BASE_URL = "https://www.flipkart.com/%20/p/%20?pid="
DEFAULT_TEXT = "N/A"
HEIGHT_WIDTH = "900"
QUALITY = "100"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )
}

from pymongo import MongoClient

CONN = MongoClient('mongodb://localhost:27017/')
DB = CONN.flipkart_api
KEY_COLLECTION = DB.key_table
LOG_COLLECTION = DB.logs_table