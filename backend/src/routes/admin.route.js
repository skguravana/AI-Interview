import express from "express";
import { 
  adminLogin, 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  getUserDetails,
  getComplaints,
  updateComplaintStatus
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);

// Protected admin routes
router.use(protectAdminRoute);
router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.get("/users/:userId", getUserDetails);
router.get("/complaints", getComplaints);
router.put("/complaints/:complaintId", updateComplaintStatus);

export default router;