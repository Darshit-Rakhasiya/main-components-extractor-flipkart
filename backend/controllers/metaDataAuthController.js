const Metadata = require('../models/MetaData');
const DevLog = require('../models/DevLog');
const KeyModel = require('../models/Key');
const LogModel = require('../models/Log');
const { MongoClient } = require('mongodb');

exports.submitMetadata = async (req, res) => {
    const {
        apiUrl,
        method,
        mongoDbUrl,
        databaseName,
        keyCollectionName,
        logCollectionName,
        domainName,
        category,
        type,
        params
    } = req.body;

    console.log(req.body);


    if (!apiUrl || !method || !mongoDbUrl || !databaseName || !keyCollectionName || !logCollectionName || !domainName || !category || !type) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const apiName = domainName + category + type;

    let client;
    try {
        client = new MongoClient(mongoDbUrl);
        await client.connect();

        const adminDb = client.db().admin();
        const dbList = await adminDb.listDatabases();
        const dbExists = dbList.databases.some(db => db.name === databaseName);

        if (!dbExists) {
            return res.status(400).json({ success: false, message: `Database "${databaseName}" does not exist.` });
        }

        const db = client.db(databaseName);
        const collections = await db.listCollections({}, { nameOnly: true }).toArray();
        const collectionNames = collections.map(c => c.name);

        if (!collectionNames.includes(keyCollectionName)) {
            return res.status(400).json({ success: false, message: `Key collection "${keyCollectionName}" does not exist.` });
        }

        if (!collectionNames.includes(logCollectionName)) {
            return res.status(400).json({ success: false, message: `Log collection "${logCollectionName}" does not exist.` });
        }

        const sampleKeyDoc = await db.collection(keyCollectionName).findOne();
        if (!sampleKeyDoc) {
            return res.status(400).json({ success: false, message: `Key collection "${keyCollectionName}" has no documents.` });
        }

        const expectedKeyFields = Object.keys(KeyModel.schema.paths).filter(f => f !== '_id' && f !== '__v');
        const keyDocFields = Object.keys(sampleKeyDoc);

        const missingKeyFields = expectedKeyFields.filter(field => !keyDocFields.includes(field));
        if (missingKeyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Key collection schema mismatch. Missing fields: ${missingKeyFields.join(', ')}`
            });
        }

        const sampleLogDoc = await db.collection(logCollectionName).findOne();
        if (!sampleLogDoc) {
            return res.status(400).json({ success: false, message: `Log collection "${logCollectionName}" has no documents.` });
        }

        const expectedLogFields = Object.keys(LogModel.schema.paths).filter(f => f !== '_id' && f !== '__v' && f !== 'createdAt' && f !== 'updatedAt');
        const logDocFields = Object.keys(sampleLogDoc);

        const missingLogFields = expectedLogFields.filter(field => !logDocFields.includes(field));
        if (missingLogFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Log collection schema mismatch. Missing fields: ${missingLogFields.join(', ')}`
            });
        }

        if (!['POST', 'GET', 'PUT', 'DELETE'].includes(method)) {
            return res.status(400).json({
                success: false,
                message: `Invalid HTTP method "${method}" specified.`,
            });
        }


        const metadata = await Metadata.create({
            apiUrl,
            apiName,
            method,
            mongoDbUrl,
            databaseName,
            keyCollectionName,
            logCollectionName,
            domainName,
            category,
            type
        });

        if (params !== undefined) {
            await db.collection('metadata').updateOne(
                { apiName: metadata.apiName },
                { $set: { params: metadata.params } }
            );
        }

        await DevLog.create({
            message: `Metadata submitted: ${domainName} > ${category} > ${type} [${databaseName}.${keyCollectionName}]`
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
    } finally {
        if (client) {
            await client.close();
        }
    }
};

exports.countMetadata = async (req, res) => {
    try {
        const countMeta = await Metadata.countDocuments({});

        await DevLog.create({ message: `count of metadata retrieved` })

        res.status(200).json({
            success: true,
            count: countMeta
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};