import express from "express";
import cors from 'cors';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { connectDB } from "./libs/db.js";
import authRoutes from './routes/auth.route.js';
import interviewRoutes from './routes/interview.route.js';
import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import contactRoutes from './routes/contact.route.js'

connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Routes
app.use('/aiinterview/auth', authRoutes);
app.use('/aiinterview/interview', interviewRoutes);
app.use('/aiinterview/user', userRoutes);
app.use('/aiinterview/admin', adminRoutes);
app.use('/aiinterview/contact',contactRoutes)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});