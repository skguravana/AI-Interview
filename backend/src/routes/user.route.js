import express from "express";
import {updateProfile,getAllUsers } from "../controllers/user.controller.js";
import { protectRoute} from "../middleware/auth.middleware.js"; 

const router = express.Router();
 
router.post("/update-profile", protectRoute, updateProfile);
router.get("/all",protectRoute,getAllUsers)

export default router;
