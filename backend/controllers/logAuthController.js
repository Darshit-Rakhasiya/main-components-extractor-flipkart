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
        const search = req.query.search?.trim()?.toLowerCase() || '';

        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999); // Include full end day

        const metadataList = await Metadata.find();
        let allLogs = [];

        for (const metadata of metadataList) {
            const { mongoDbUrl, databaseName, logCollectionName } = metadata;
            if (!mongoDbUrl || !databaseName || !logCollectionName) continue;

            try {
                const conn = await mongoose.createConnection(mongoDbUrl, {
                    dbName: databaseName,
                }).asPromise();

                const LogModel = createDynamicLogModel(conn, logCollectionName);
                const logs = await LogModel.find().lean(); // raw fetch for now
                allLogs.push(...logs);

                await conn.close();
            } catch (err) {
                console.error(`DB error: ${databaseName} | Collection: ${logCollectionName}`, err);
            }
        }

        // Sort logs
        allLogs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        // Apply in-memory date filter
        let filteredLogs = allLogs;
        if (startDate && endDate) {
            filteredLogs = filteredLogs.filter(log =>
                log.createdAt &&
                new Date(log.createdAt) >= startDate &&
                new Date(log.createdAt) <= endDate
            );
        } else if (startDate) {
            filteredLogs = filteredLogs.filter(log =>
                log.createdAt && new Date(log.createdAt) >= startDate
            );
        }

        // Apply search filter
        if (search) {
            filteredLogs = filteredLogs.filter(log =>
                (log.ip?.toLowerCase().includes(search) || log?.params?.url?.toLowerCase().includes(search))
            );
        }

        const paginatedLogs = filteredLogs.slice(skip, skip + limit);

        await devLog.create({
            message: `Logs retrieved | Page: ${page} | Limit: ${limit} | Search: ${search || 'None'} | Date: ${startDate || 'None'} to ${endDate || 'None'}`
        });

        res.status(200).json({
            success: true,
            logs: paginatedLogs,
            count: paginatedLogs.length,
            totalLogs: filteredLogs.length,
            currentPage: page,
            totalPages: Math.ceil(filteredLogs.length / limit),
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