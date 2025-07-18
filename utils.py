from config import KEY_COLLECTION, LOG_COLLECTION, HEIGHT_WIDTH, QUALITY
from urllib.parse import urlparse, parse_qs
import jmespath

def is_valid_flipkart_url(url):
    try:
        parsed = urlparse(url)
        if "flipkart.com" not in parsed.netloc:
            return False
        query_params = parse_qs(parsed.query)
        return "pid" in query_params and bool(query_params["pid"][0])
    except Exception:
        return False

def build_breadcrumbs(data):

    breadcrumbs = jmespath.search(
        "pageDataV4.productPageMetadata.breadcrumbs[*].title", data
    )
    return {f"l{i+1}": title for i, title in enumerate(breadcrumbs)} if breadcrumbs else {}

def build_image_url(raw_url):
    if not raw_url:
        return "No image available"
    return (
        raw_url.replace("{@width}", HEIGHT_WIDTH)
                .replace("{@height}", HEIGHT_WIDTH)
                .replace("{@quality}", QUALITY)
    )

def validate_api(api_key):

    document = KEY_COLLECTION.find_one({"key": api_key})

    if not document:
        return False, "Invalid API key"

    if not document.get("status", False):
        return False, "API key is inactive"

    usage = document.get("usage", 0)
    limit = document.get("limit", 0)

    if usage >= limit:
        return False, "API usage limit exceeded"

    KEY_COLLECTION.update_one({"key": api_key}, {"$inc": {"usage": 1}})
    return True, "API key validated"

def logger(ip, params, request_time, status_code, key, response):
    data = {
        "ip":ip,
        "params":params,
        "request_time":request_time,
        "status_code":status_code,
        "key":key,
        "response":response
    }
    
    LOG_COLLECTION.insert_one(data)