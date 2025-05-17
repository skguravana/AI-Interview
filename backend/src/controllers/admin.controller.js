import Admin from '../models/Admin.model.js';
import User from '../models/User.model.js';
import Interview from '../models/Interview.model.js';
import Contact from '../models/Contact.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../libs/utils.js';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(admin._id, res);

    return res.status(200).json({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    // Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // User registrations for the last 30 days
    const userRegistrationsByDate = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Interviews for the last 30 days with daily average scores
    const interviewsByDate = await Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          averageScore: { $avg: "$overallScore" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Overall interview statistics
    const interviewStats = await Interview.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$overallScore" },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }
      }
    ]);

    // Monthly statistics for year-over-year comparison
    const monthlyStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          userCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fill in missing dates with zero counts
    const filledUserRegistrations = fillMissingDates(userRegistrationsByDate, 30);
    const filledInterviewsByDate = fillMissingDates(interviewsByDate, 30);

    res.json({
      totalUsers,
      totalInterviews,
      recentUsers,
      userRegistrationsByDate: filledUserRegistrations,
      interviewsByDate: filledInterviewsByDate,
      monthlyStats,
      interviewStats: interviewStats[0] || { averageScore: 0, totalCompleted: 0 }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

// Helper function to fill in missing dates with zero counts
const fillMissingDates = (data, days) => {
  const filledData = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const existingData = data.find(item => item._id === dateStr);
    
    filledData.push({
      _id: dateStr,
      count: existingData ? existingData.count : 0,
      averageScore: existingData ? existingData.averageScore || 0 : 0
    });
  }

  return filledData;
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    await Interview.deleteMany({ userId });
    await Contact.deleteMany({ userId });
    res.json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user, interviews });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Contact.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, adminResponse } = req.body;
    
    const complaint = await Contact.findByIdAndUpdate(
      complaintId,
      { status, adminResponse },
      { new: true }
    );
    
    res.json(complaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

