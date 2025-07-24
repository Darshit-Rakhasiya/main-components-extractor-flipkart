const Log = require('../models/Log');
const devLog = require("../models/DevLog")
const mongoose = require('mongoose');
const Metadata = require('../models/MetaData');

const createDynamicLogModel = (connection, collectionName) => {
    const logSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    return connection.model('Log', logSchema, collectionName);
};

exports.getAllLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const metadataList = await Metadata.find();
        let allLogs = [];

        for (const metadata of metadataList) {
            const { mongoDbUrl, databaseName, logCollectionName } = metadata;

            // Skip if required info is missing
            if (!mongoDbUrl || !databaseName || !logCollectionName) continue;

            try {
                const conn = await mongoose.createConnection(mongoDbUrl, {
                    dbName: databaseName,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }).asPromise();

                const LogModel = createDynamicLogModel(conn, logCollectionName);
                const logs = await LogModel.find().lean();

                allLogs.push(...logs);
                await conn.close(); // Cleanup
            } catch (err) {
                console.error(`Error with DB: ${databaseName}, Collection: ${logCollectionName}`, err);
            }
        }

        allLogs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        const paginatedLogs = allLogs.slice(skip, skip + limit);

        await devLog.create({
            message: `All logs retrieved from multiple DBs (Page: ${page}, Limit: ${limit})`
        });

        res.status(200).json({
            success: true,
            logs: paginatedLogs,
            count: paginatedLogs.length,
            totalLogs: allLogs.length,
            currentPage: page,
            totalPages: Math.ceil(allLogs.length / limit),
        });

    } catch (err) {
        console.error('Error retrieving logs:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.insertLog = async (req, res) => {
    try {
        const { ip, params, status_code, key, response } = req.body;

        console.log(req.body)

        if (!ip || !params || status_code === undefined || key === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newLog = new Log({
            ip,
            params,
            status_code,
            key,
            response
        });

        const savedLog = await newLog.save();

        await devLog.create({ message: `New Log inserted - IP:${ip} & API:${key}` })

        res.status(201).json({
            success: true,
            message: 'Log inserted successfully',
            log: savedLog
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};