import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { config } from "dotenv";

config();
const router = express.Router();

// Route: User Signup
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered, try logging in",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export { router as authRoutes };
