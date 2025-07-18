const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;
app.use(express.json());

const FASTAPI_URL = 'http://127.0.0.1:8000';

async function checkFastApiServer() {
    try {
        await axios.get(FASTAPI_URL);
        console.log('FastAPI server is already running.');
    } catch (err) {
        console.log('FastAPI server not running. Starting it now...');
        spawn('python', ['main.py'], {
            stdio: 'inherit',
        });
    }
}

checkFastApiServer();

setTimeout(() => {
    app.listen(PORT, () => {
        console.log(`Node.js server running at http://localhost:${PORT}`);
    });
}, 2000);

app.post('/scrape-flipkart-pdp', async (req, res) => {
    const { url: flipkartUrl, api: apiKey } = req.body;

    if (!flipkartUrl || !apiKey) {
        return res.status(400).json({ error: 'Missing url or api parameter' });
    }

    try {
        const response = await axios.post(`${FASTAPI_URL}/get-product-info/`, {
            url: flipkartUrl,
            api: apiKey
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error contacting FastAPI:', error.message);
        res.status(500).json({ error: 'Error fetching product info from FastAPI server' });
    }
});
