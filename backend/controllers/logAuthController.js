const Log = require('../models/Log');
const devLog = require("../models/DevLog")

exports.getAllLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const [logs, totalLogs] = await Promise.all([
            Log.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Log.countDocuments()
        ]);
        
        await devLog.create({
            message: `All logs retrieved (Page: ${page}, Limit: ${limit})`
        });
        console.log(page, totalLogs);

        res.status(200).json({
            success: true,
            logs,
            count: logs.length,
            totalLogs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
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