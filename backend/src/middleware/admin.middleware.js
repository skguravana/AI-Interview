import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export const protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.aiinterviewjwt;

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};