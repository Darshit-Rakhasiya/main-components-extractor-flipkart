const Key = require('../models/Key');

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
    const { keyId } = req.query;
    const { name, key, usage, limit, status } = req.body;

    if (!name && !key && !usage && !limit && !status) {
        return res.status(400).json({ success: false, message: 'At least one field is required to update' });
    }

    try {
        const keyToUpdate = await Key.findById(keyId);
        if (!keyToUpdate) {
            return res.status(404).json({ success: false, message: 'Key not found' });
        }

        if (name) {
            keyToUpdate.name = name;
        }
        if (key) {
            keyToUpdate.key = key;
        }
        if (usage) {
            keyToUpdate.usage = usage;
        }
        if (limit) {
            keyToUpdate.limit = limit;
        }
        if (status) {
            keyToUpdate.status = status;
        }

        await keyToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Key updated successfully',
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