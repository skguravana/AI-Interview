import User from '../models/User.model.js';


export const updateProfile = async (req, res) => {
    try {
        const { bio, skills } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { bio, skills },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found. Please ensure you are logged in." });
        }

        const { _id, password: _, ...userData } = updatedUser.toObject();

        return res.status(200).json({
            id: _id,
            ...userData,
            message: "Your profile has been updated successfully."
        });
    } catch (error) {
        console.error("Profile update failed:", error);
        return res.status(500).json({ message: "Unable to update profile at the moment. Please try again later." });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, {
            password: 0, 
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};
