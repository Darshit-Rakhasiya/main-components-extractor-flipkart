const bcrypt = require('bcryptjs');
const SuperAdmin = require('../models/SuperAdmin');
const devLog = require('../models/DevLog');
const Admin = require('../models/Admin');
const User = require('../models/User');

exports.registerSuperAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        const existingAdmin = await Admin.findOne({ email })
        const existingSuperAdmin = await SuperAdmin.findOne({ email })

        if (existingUser || existingAdmin || existingSuperAdmin) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSuperAdmin = new SuperAdmin({ name, email, password: hashedPassword });
        await newSuperAdmin.save();

        await devLog.create({ message: `SuperAdmin Registered - name:${name} & email:${email}` });

        res.status(201).json({
            success: true,
            message: 'SuperAdmin registered successfully',
            SuperAdmin: { name: newSuperAdmin.name, email: newSuperAdmin.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.loginSuperAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
        }

        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        await devLog.create({ message: `SuperAdmin Login - name:${superAdmin.name} & email:${email}` });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            SuperAdminId: superAdmin._id,
            SuperAdmin: { name: superAdmin.name, email: superAdmin.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllSuperAdmin = async (req, res) => {
    try {
        const superAdmins = await SuperAdmin.find();

        await devLog.create({ message: 'All SuperAdmin retrieved' });

        res.status(200).json({
            success: true,
            count: superAdmins.length,
            SuperAdmins: superAdmins
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteSuperAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }

    try {
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
        }

        await SuperAdmin.deleteOne({ email });

        await devLog.create({ message: `SuperAdmin Deleted - name:${superAdmin.name} & email:${email}` });

        res.status(200).json({
            success: true,
            message: 'SuperAdmin deleted successfully',
            SuperAdminId: superAdmin._id,
            SuperAdmin: { name: superAdmin.name, email: superAdmin.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateSuperAdmin = async (req, res) => {
    const { originalEmail, name, email, password, access } = req.body;

    if (!originalEmail) {
        return res.status(400).json({ success: false, message: 'originalEmail is required to identify the SuperAdmin to update' });
    }

    try {
        const superAdminToUpdate = await SuperAdmin.findOne({ email: originalEmail });
        if (!superAdminToUpdate) {
            return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
        }

        if (email && email !== originalEmail) {
            const emailTaken = await SuperAdmin.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ success: false, message: 'New email already exists' });
            }
        }

        if (name !== undefined) {
            superAdminToUpdate.name = name;
        }
        if (email !== undefined) {
            superAdminToUpdate.email = email;
        }
        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            superAdminToUpdate.password = hashedPassword;
        }
        if (access !== undefined) {
            superAdminToUpdate.access = access;
        }

        await superAdminToUpdate.save();

        await devLog.create({ message: `SuperAdmin Updated - name:${superAdminToUpdate.name} & email:${superAdminToUpdate.email}` });

        res.status(200).json({
            success: true,
            message: 'SuperAdmin updated successfully',
            SuperAdminId: superAdminToUpdate._id,
            SuperAdmin: {
                name: superAdminToUpdate.name,
                email: superAdminToUpdate.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
