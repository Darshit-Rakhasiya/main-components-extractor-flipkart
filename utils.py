from collections import defaultdict

attempts = defaultdict(int)

def is_valid_flipkart_url(url):
    try:
        from urllib.parse import urlparse, parse_qs
        parsed = urlparse(url)
        if "flipkart.com" not in parsed.netloc:
            return False
        query_params = parse_qs(parsed.query)
        return "pid" in query_params and bool(query_params["pid"][0])
    except Exception:
        return False

def build_breadcrumbs(data):
    import jmespath
    breadcrumbs = jmespath.search(
        "pageDataV4.productPageMetadata.breadcrumbs[*].title", data
    )
    return {f"l{i+1}": title for i, title in enumerate(breadcrumbs)} if breadcrumbs else "No breadcrumbs found"

def build_image_url(raw_url):
    from config import HEIGHT_WIDTH, QUALITY 
    if not raw_url:
        return "No image available"
    return (
        raw_url.replace("{@width}", HEIGHT_WIDTH)
                .replace("{@height}", HEIGHT_WIDTH)
                .replace("{@quality}", QUALITY)
    )

def validate_api(api):
    print(api)
    return api == "123"

def get_try(api_key):
    return attempts[api_key]
