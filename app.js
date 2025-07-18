const express = require('express');
const axios = require('axios');

const app = express();
const FASTAPI_URL = 'http://127.0.0.1:8000';

app.use(express.json());

app.post('/scrape-flipkart-pdp', async (req, res) => {
    const { url: flipkartUrl, api: apiKey } = req.body;

    if (!flipkartUrl || !apiKey) {
        return res.status(400).json({ error: 'Missing url or api parameter' });
    }

    try {
        const response = await axios.post(`${FASTAPI_URL}/get-product-info/`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error contacting FastAPI:', error.message);
        res.status(500).json({ error: 'Error fetching product info from FastAPI server' });
    }
});

module.exports = app;
