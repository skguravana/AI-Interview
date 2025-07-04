import express from "express";
import { signup, login, checkAuth, logout} from "../controllers/auth.controller.js";
import { protectRoute} from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/signup", signup);  
router.post("/login", login);    
router.get("/check-auth", protectRoute, checkAuth); 
router.post("/logout", logout);  

export default router;
