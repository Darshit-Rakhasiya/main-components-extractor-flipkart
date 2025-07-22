exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    try {
       
        let user = await SuperAdmin.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                await devLog.create({ message: `SuperAdmin Login - name:${user.name} & email:${email}` });
                return res.status(200).json({
                    status: true,
                    role: "superadmin",
                    data: { username: user.name, email: user.email }
                });
            }
        }

        // Check Admin
        user = await Admin.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                await devLog.create({ message: `Admin Login - name:${user.name} & email:${email}` });
                return res.status(200).json({
                    status: true,
                    role: "admin",
                    data: { username: user.name, email: user.email }
                });
            }
        }

        // Check User
        user = await User.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                await devLog.create({ message: `User Login - name:${user.name} & email:${email}` });
                return res.status(200).json({
                    status: true,
                    role: "user",
                    data: { username: user.name, email: user.email }
                });
            }
        }

        // No match found
        return res.status(401).json({ status: false, message: "Invalid email or password" });

    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ status: false, message: "Server error" });
    }
};
