const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

const user = await User.create({
    ...req.body,
    password: hashedPassword
});

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    );
        res.json({
    message: "Login successful",
    token
});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, loginUser };