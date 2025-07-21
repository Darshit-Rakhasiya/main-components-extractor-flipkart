const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const devLog = require("../models/DevLog");
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');

exports.registerAdmin = async (req, res) => {
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

        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();

        await devLog.create({ message: `Admin Registered - name:${name} & email:${email}` })

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: { name: admin.name, email: admin.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        await devLog.create({ message: `Admin Login - name:${admin.name} & email:${email}` })

        res.status(200).json({
            success: true,
            message: 'Login successful',
            adminId: admin._id,
            admin: { name: admin.name, email: admin.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllAdmin = async (req, res) => {
    try {
        const admins = await Admin.find();

        await devLog.create({ message: `All admin retrieved` })

        res.status(200).json({
            success: true,
            count: admins.length,
            admins
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        await Admin.deleteOne({ email });

        await devLog.create({ message: `Admin Deleted - name:${admin.name} & email:${email}` })

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
            adminId: admin._id,
            admin: { name: admin.name, email: admin.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateAdmin = async (req, res) => {
    const { originalEmail, name, email, password, access } = req.body;

    if (!originalEmail) {
        return res.status(400).json({ success: false, message: 'originalEmail is required to identify the admin to update' });
    }

    try {
        const adminToUpdate = await Admin.findOne({ email: originalEmail });
        if (!adminToUpdate) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        if (email && email !== originalEmail) {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'New email already exists' });
            }
        }

        if (name !== undefined) {
            adminToUpdate.name = name;
        }
        if (email !== undefined) {
            adminToUpdate.email = email;
        }
        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            adminToUpdate.password = hashedPassword;
        }
        if (access !== undefined) {
            adminToUpdate.access = access
        }

        await adminToUpdate.save();

        await devLog.create({ message: `Admin Updated - name:${adminToUpdate.name} & email:${adminToUpdate.email}` })

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            adminId: adminToUpdate._id,
            admin: {
                name: adminToUpdate.name,
                email: adminToUpdate.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
