import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongourl = process.env.MONGODB_URL
 export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongourl);
        console.log('Database connected');
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
};