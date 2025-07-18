const { spawn } = require('child_process');
const axios = require('axios');
const app = require('./app');

const PORT = 3000;
const FASTAPI_URL = 'http://127.0.0.1:8000';

async function checkFastApiServer() {
    try {
        await axios.get(FASTAPI_URL);
        console.log('FastAPI server is already running.');
    } catch (err) {
        console.log('FastAPI server not running. Starting it now...');
        spawn('python', ['main.py'], { stdio: 'inherit' });
    }
}

(async () => {
    await checkFastApiServer();

    setTimeout(() => {
        app.listen(PORT, () => {
            console.log(`Node.js server running at http://localhost:${PORT}`);
        });
    }, 2000);
})();
