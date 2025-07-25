require('dotenv').config();
const { spawn } = require('child_process');
const axios = require('axios');
const connectDB = require('./config/db');
const userAuthRoutes = require('./routes/userAuthRoutes');
const keyAuthRoutes = require('./routes/keyAuthRoutes')
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const logAuthRoutes = require('./routes/logAuthRoutes')
const devLogAuthRoutes = require('./routes/devLogAuthRoutes')
const superAdminAuthRoutes = require('./routes/superAdminAuthRoutes')
const schemaAuthRoutes = require('./routes/schemaAuthRoutes')
const metaDataAuthRoutes = require('./routes/metaDataAuthRoutes')
const login = require('./routes/loginAuthRoutes');
const app = require('./app');

app.use('/user/', userAuthRoutes);
app.use('/admin/', adminAuthRoutes);
app.use('/key/', keyAuthRoutes)
app.use('/logs/', logAuthRoutes)
app.use('/devlogs/', devLogAuthRoutes)
app.use('/super/', superAdminAuthRoutes)
app.use('/schema/', schemaAuthRoutes)
app.use('/meta/', metaDataAuthRoutes)
app.use('/login/', login)

const { PORT, FASTAPI_URL } = process.env;

async function checkFastApiServer() {
    try {
        await axios.get(FASTAPI_URL);
        console.log('FastAPI server is already running.');
    } catch (err) {
        console.log('FastAPI not running. Starting it...');
        spawn('python', ['main.py'], { stdio: 'inherit' });
    }
}

(async () => {
    await connectDB();

    await checkFastApiServer();

    setTimeout(() => {
        app.listen(PORT, () => {
            console.log(`Node.js server running at http://localhost:${PORT}`);
        });
    }, 2000);
})();
