const Metadata = require('../models/MetaData');
const devLog = require('../models/DevLog');

exports.submitMetadata = async (req, res) => {
    const { platform, category, type, database, collection } = req.body;

    if (!platform || !category || !type || !database || !collection) {
        return res.status(400).json({
            success: false,
            message: "All fields are required: platform, category, type, database, collection"
        });
    }

    try {
       
        const metadata = await Metadata.create({
            platform,
            category,
            type,
            database,
            collection
        });


        await devLog.create({
            message: `Metadata submitted: ${platform} > ${category} > ${type} [${database}.${collection}]`
        });

        return res.status(200).json({
            success: true,
            message: "Metadata submitted successfully",
            metadata
        });

    } catch (err) {
        console.error("Metadata submission error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
