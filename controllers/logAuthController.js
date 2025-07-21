const Log = require('../models/Log');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find();

        res.status(200).json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (err) {
        console.error(err);
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