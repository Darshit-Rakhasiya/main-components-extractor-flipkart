const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { name, email, password, updateAcess = false } = req.body;

    if (name == null || email == null || password == null) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, updateAcess });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        await User.deleteOne({ email });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            userId: user._id,
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { originalEmail, name, email, password, updateAcess } = req.body;

    if (!originalEmail) {
        return res.status(400).json({ success: false, message: 'originalEmail is required to identify the user to update' });
    }

    try {
        const userToUpdate = await User.findOne({ email: originalEmail });
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (email && email !== originalEmail) {
            const existingAdmin = await User.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'New email already exists' });
            }
        }

        if (name !== undefined) {
            userToUpdate.name = name;
        }
        if (email !== undefined) {
            userToUpdate.email = email;
        }
        if (password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            userToUpdate.password = hashedPassword;
        }
        if (updateAcess !== undefined) {
            userToUpdate.updateAcess = updateAcess
        }

        await userToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            userId: userToUpdate._id,
            user: {
                name: userToUpdate.name,
                email: userToUpdate.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
