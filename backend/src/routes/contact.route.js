import express from "express";
import { submitContact, getUserContacts } from "../controllers/contact.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.post("/submit", submitContact);
router.get("/history", getUserContacts);

export default router;