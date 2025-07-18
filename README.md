# Flipkart Product Info API

This project implements a FastAPI-based service to fetch product information from Flipkart product pages. It validates API keys, tracks usage, extracts product data from Flipkart's `__INITIAL_STATE__` JavaScript variable, and logs requests and responses to MongoDB.

## Features

* **URL Validation**: Ensures that provided URLs are valid Flipkart product URLs containing a `pid` parameter.
* **API Key Management**: Validates and tracks per-key usage and enforces usage limits.
* **Data Extraction**: Parses the `window.__INITIAL_STATE__` JSON blob to extract product name, price, image URL, discounts, ratings, and breadcrumbs.
* **Logging**: Stores request metadata and responses in a MongoDB collection for auditing and debugging.
* **Configurable Image Sizing**: Dynamically adjusts image URL parameters for width, height, and quality.

## Prerequisites

* Python 3.8+
* MongoDB instance (local or remote)
* `curl-cffi` for HTTP requests

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/flipkart-product-api.git
   cd flipkart-product-api
   ```

2. **Create and activate a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

## Configuration

### Environment Variables

Set the following environment variables or update `config.py` directly:

* `MONGO_URI`: MongoDB connection string (default: `mongodb://localhost:27017/`)
* `MONGO_DATABASE`: MongoDB database name (default: `flipkart_api`)

### Collections

* **`key_table`**: Stores API keys, usage counts, limits, and status.
* **`logs_table`**: Stores logs of each API request and response.

## Project Structure

```
├── config.py         # Global settings, headers, default text
├── extractor.py      # Functions to get initial state and extract product info
├── main.py           # URL validation, utils for breadcrumbs & image URLs, API key logic, logging
├── utils.py          # URL validation, breadcrumbs builder, image URL builder, API key validator, logger
├── app.py            # FastAPI server with /get-product-info endpoint
├── requirements.txt  # Python dependencies
└── README.md         # Project documentation
```

## Usage

### Starting the Server

Run the FastAPI server on `localhost:8000`:

```bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### API Endpoint

#### `POST /get-product-info/`

Fetches product details from a Flipkart URL.

* **Headers**:

  * `Content-Type: application/json`

* **Request Body**:

  ```json
  {
    "url": "https://www.flipkart.com/item-name/p/XXXXXXXXXXXX?pid=ABCDE12345",
    "api": "your-api-key-here"
  }
  ```

* **Response** (success):

  ```json
  {
    "query_params": { "url": "...", "api": "..." },
    "excution_time": 0.12,
    "success": true,
    "message": "Product info fetched successfully.",
    "data": {
      "name": "Product Name",
      "price": "₹1,999",
      "image_url": "https://...",
      "discount": "10%",
      "mrp": "₹2,199",
      "ratings_count": 1500,
      "avg_rating": 4.5,
      "category_hierarchy": {
        "l1": "Electronics",
        "l2": "Mobiles",
        "l3": "Smartphones"
      }
    }
  }
  ```

* **Response** (error):

  ```json
  {
    "success": false,
    "message": "Error message explaining the failure"
  }
  ```

## Utility Functions (in `utils.py`)

* `is_valid_flipkart_url(url: str) -> bool`:
  Validates that the URL belongs to Flipkart and contains a non-empty `pid` query parameter.

* `build_breadcrumbs(data: dict) -> dict`:
  Extracts breadcrumb titles from the initial state and returns a mapping `l1`, `l2`, ...

* `build_image_url(raw_url: str) -> str`:
  Replaces `{@width}`, `{@height}`, and `{@quality}` placeholders in Flipkart image URLs with configured values.

* `validate_api(api_key: str) -> Tuple[bool, str]`:
  Checks existence, activation status, and usage limits; increments usage on success.

* `logger(ip, params, request_time, status_code, key, response)`:
  Inserts a log document into the `logs_table` collection.

## Extending and Customization

* **Proxy Support**: Integrate with proxy services (e.g., ScraperAPI) by modifying the request in `extractor.py`.
* **Additional Fields**: Extend `extract_product_info` to include more attributes (e.g., availability, seller info).
* **Error Handling**: Improve exception handling and add HTTP status codes for various error scenarios.

---