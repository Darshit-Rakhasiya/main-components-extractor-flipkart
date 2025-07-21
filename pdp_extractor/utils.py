from pdp_extractor.config import HEIGHT_WIDTH, QUALITY, DB_API
from urllib.parse import urlparse, parse_qs
import jmespath
from curl_cffi import requests

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

import requests

def validate_api(api_key):
    response = requests.post(f"{DB_API}key/findKey", json={"key": api_key})

    if response.status_code != 200:
        return False, "Invalid API key"

    document = response.json()

    if not document.get("status", False):
        return False, "API key is inactive"

    usage = document.get("usage", 0)
    limit = document.get("limit", 0)

    if usage >= limit:
        return False, "API usage limit exceeded"

    requests.post(f"{DB_API}key/update", json={"originalKey": api_key, "incrementUsage": True})
    return True, "API key validated"


def logger(ip, params, status_code, key, response):
    data = {
        "ip":ip,
        "params":params,
        "status_code":status_code,
        "key":key,
        "response":response
    }
    requests.post(f"{DB_API}logs/insert", json=data)