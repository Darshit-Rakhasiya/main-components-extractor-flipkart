const mongoose = require("mongoose");
const devLog = require("../models/DevLog");


exports.getAllSchema = async (req, res) => {
    try {
        await devLog.create({ message: `All Developer logs retrieved` });

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

// POST /schema/checker
exports.checkSchemaExists = async (req, res) => {
    const { dbName, collectionName } = req.body;

    if (!dbName || !collectionName) {
        return res.status(400).json({
            success: false,
            message: "Both 'dbName' and 'collectionName' are required.",
        });
    }

    try {
        await devLog.create({ message: `Checking if ${dbName}.${collectionName} exists.` });

        const dynamicDb = mongoose.connection.useDb(dbName, { useCache: true });

        const collections = await dynamicDb.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (collectionExists) {
            return res.status(200).json({
                success: true,
                exists: true,
                message: ` Collection '${collectionName}' exists in database '${dbName}'.`,
            });
        } else {
            return res.status(404).json({
                success: false,
                exists: false,
                message: ` Collection '${collectionName}' not found in database '${dbName}'.`,
            });
        }

    } catch (err) {
        console.error("Schema check error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error while checking database/collection.",
            error: err.message,
        });
    }
};
