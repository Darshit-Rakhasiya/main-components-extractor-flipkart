from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import is_valid_flipkart_url, validate_api
from extractor import get_initial_state, extract_product_info
from collections import defaultdict

attempts = defaultdict(int)

app = FastAPI()

class URLRequest(BaseModel):
    url: str
    api: str

def main(user_input: str, api_key: str):
    global attempts
    
    if user_input.startswith("http://") or user_input.startswith("https://"):
        if is_valid_flipkart_url(user_input):
            result = {"message": "Valid Flipkart product URL with PID.", "product_info": {}}

            print(f"Received API key: {api_key}")
            
            if validate_api(api_key):
                if attempts[api_key] == 5:
                    result["message"] = "Limit Over"
                elif data := get_initial_state(user_input):
                    attempts[api_key] += 1
                    print(f"Updated attempts for {api_key}: {attempts[api_key]}") 
                    product = extract_product_info(data)
                    result["product_info"] = product
                else:
                    result["message"] = "Failed to extract product JSON from page."
            else:
                result['message'] = "Invalid API"
        else:
            result = {"message": "Invalid Flipkart URL or missing PID."}
    else:
        result = {"message": "Invalid input. Please enter a valid Flipkart product URL."}

    return result

@app.post("/get-product-info/")
async def get_product_info(request: URLRequest):
    result = main(request.url, request.api)
    if "product_info" in result and not result["product_info"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
