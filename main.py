from fastapi import FastAPI, Request
from pydantic import BaseModel
from pdp_extractor.utils import is_valid_flipkart_url, validate_api, logger
from pdp_extractor.extractor import get_initial_state, extract_product_info
from datetime import datetime
from json import loads
from time import time
import uvicorn

app = FastAPI()

class URLRequest(BaseModel):
    url: str
    api: str

def main(user_input: str, api_key: str):
    if not (user_input.startswith("http://") or user_input.startswith("https://")):
        return {"success": False, "message": "Invalid input. Please enter a valid Flipkart product URL."}

    if not is_valid_flipkart_url(user_input):
        return {"success": False, "message": "Invalid Flipkart URL or missing PID."}

    is_valid, msg = validate_api(api_key)
    if not is_valid:
        return {"success": False, "message": msg}

    data = get_initial_state(user_input)
    if not data:
        return {"success": False, "message": "Failed to extract product JSON from page."}

    product = extract_product_info(data)
    return {
        "success": True,
        "message": "Product info fetched successfully.",
        "data": product
    }
    
@app.get("/")
async def running_server(request: Request):
    return {"Your_ip": request.client.host}

@app.post("/get-product-info/")
async def get_product_info(request: Request, url_request: URLRequest):
    client_ip = request.client.host
    req_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    body = await request.body()
    print(f"Client IP: {client_ip}")
    print(f"Request Time: {req_time}")
    print(f"Request Body: {body.decode('utf-8')}")

    s_time = time()
    result = main(url_request.url, url_request.api)
    e_time = time()
    
    execution_time = round(e_time - s_time, 2)

    status_code = 200 if result["success"] else 400

    print(f"Status Code: {status_code}")

    resp = {"query_params": loads(body),
            "excution_time":execution_time,
            "success": True,
            "message": result["message"],
            "data": result.get("data")}
    
    if not result["success"]:
        resp = {"success": False, "message": result["message"], "data": result.get("data")}
    
    api_key = url_request.api
    print(url_request.api)
    print(type(body))
    
    logger(client_ip, loads(body), req_time, status_code, api_key, resp)
    
    return resp

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
