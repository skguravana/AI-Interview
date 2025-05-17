import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { generateToken } from '../libs/utils.js';

export const signup = async (req, res) => {
    const { fullName, email, password, position, company, address } = req.body;
    try {
        const alreadyUserPresent = await User.findOne({ email });

        if (alreadyUserPresent) {
            return res.status(400).json({ message: "This email is already in use. Please log in or use a different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            position,
            company,
            address,
            bio: "",
            skills: []
        });

        generateToken(newUser._id, res);

        const { _id, password: _, ...userData } = newUser.toObject();

        return res.status(201).json({
            id: _id,
            ...userData,
            message: "Your account has been successfully created! Welcome aboard."
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        return res.status(500).json({ message: "Oops! Something went wrong. Please try again later." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Incorrect email or password. Please try again." });
        }

        generateToken(user._id, res);

        const { _id, password: _, ...userData } = user.toObject();

        return res.status(200).json({
            id: _id,
            ...userData,
            message: "Login successful! Welcome back."
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
};

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "You are not logged in. Please sign in to continue." });
        }

        const { _id, password: _, ...userData } = req.user.toObject();

        return res.status(200).json({
            id: _id,
            ...userData,
            message: "User is authenticated."
        });
    } catch (error) {
        console.error("Error in checkAuth controller:", error);
        return res.status(500).json({ message: "Authentication check failed. Please try again later." });
    }
};



export const logout = async (req, res) => {
    try {
        res.cookie("aiinterviewjwt", "", { httpOnly: true, expires: new Date(0) });
        return res.status(200).json({ message: "You have successfully logged out. See you next time!" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        return res.status(500).json({ message: "Logout failed. Please try again later." });
    }
};

