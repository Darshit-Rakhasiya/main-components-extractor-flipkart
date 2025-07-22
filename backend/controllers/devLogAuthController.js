const devLog = require("../models/DevLog")

exports.getAllDevLogs = async (req, res) => {
    try {
        await devLog.create({message: `All Developer logs retrieved`})

        const devlogs = await devLog.find();

        res.status(200).json({
            success: true,
            count: devlogs.length,
            devlogs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};