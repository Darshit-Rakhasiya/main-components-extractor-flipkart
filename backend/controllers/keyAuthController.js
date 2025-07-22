const Key = require('../models/Key');
const devLog = require("../models/DevLog");
const User = require('../models/User');

exports.registerKey = async (req, res) => {
    const { name, key, usage, limit, status } = req.body;

    console.log(name, key, usage, limit, status);
    if (!name || !key || !usage || !limit || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingKey = await Key.findOne({ key });
        if (existingKey) {
            return res.status(409).json({ success: false, message: 'Key already registered' });
        }

        const newKey = new Key({ name, key, usage, limit, status });
        await newKey.save();

        await devLog.create({ message: `New API key registered - name:${name} & API:${key}` })

        res.status(201).json({
            success: true,
            message: 'Key registered successfully',
            user: { id: newKey._id, name: newKey.name, key: newKey.key }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateKey = async (req, res) => {
    const { originalKey, name, incrementUsage, key, usage, limit, status, userEmail } = req.body;

    if (!originalKey) {
        return res.status(400).json({ success: false, message: 'originalKey is required to identify the key to update' });
    }

    try {
        const keyToUpdate = await Key.findOne({ key: originalKey });
        if (!keyToUpdate) {
            return res.status(404).json({ success: false, message: 'Key not found' });
        }

        if (key && key !== originalKey) {
            const existing = await Key.findOne({ key });
            if (existing) {
                return res.status(400).json({ success: false, message: 'New key value already exists' });
            }
        }

        if (name !== undefined) {
            keyToUpdate.name = name;
        }
        if (key !== undefined) {
            keyToUpdate.key = key;
        }
        if (usage !== undefined) {
            keyToUpdate.usage = usage;
        }
        if (limit !== undefined) {
            keyToUpdate.limit = limit;
        }
        if (status !== undefined) {
            keyToUpdate.status = status;
        }

        if (incrementUsage) {
            keyToUpdate.usage = (keyToUpdate.usage || 0) + 1;
            User.updateOne({ email: userEmail },{ $inc: { apiCalls: 1 } })
        } else if (usage !== undefined) {
            keyToUpdate.usage = usage;
        }

        await keyToUpdate.save();

        await devLog.create({ message: `API key Updated - name:${keyToUpdate.name} & API:${keyToUpdate.key}` })

        res.status(200).json({
            success: true,
            message: 'Key updated successfully',
            keyId: keyToUpdate._id,
            key: {
                name: keyToUpdate.name,
                key: keyToUpdate.key,
                usage: keyToUpdate.usage,
                limit: keyToUpdate.limit,
                status: keyToUpdate.status
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteKey = async (req, res) => {
    const { keyId } = req.body;

    if (!keyId) {
        return res.status(400).json({ success: false, message: 'Key ID is required' });
    }

    try {
        const deletedKey = await Key.deleteOne({ keyId });

        if (!deletedKey) {
            return res.status(404).json({ success: false, message: 'Key not found' });
        }

        await devLog.create({ message: `API key Deleted - name:${deletedKey.name} & API:${deletedKey.key}` })

        res.status(200).json({
            success: true,
            message: 'Key deleted successfully',
            deletedKeyId: deletedKey.key
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllKeys = async (req, res) => {
    try {
        const keys = await Key.find();

        await devLog.create({ message: `All API key retrieved` })

        res.status(200).json({
            success: true,
            count: keys.length,
            keys
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.findKey = async (req, res) => {
    try {
        const { key } = req.body;

        const foundKey = await Key.findOne({ key });

        await devLog.create({ message: `API key found - name:${foundKey.name} & API:${foundKey.key}` })

        if (foundKey) {
            res.status(200).json({
                status: foundKey.status,
                usage: foundKey.usage,
                limit: foundKey.limit
            });
        } else {
            res.status(404).json({ error: "API key not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
