import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position:{type: String, required: true },
  company:{type: String, required: true },
  address:{type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" }, 
  skills: { type: [String], default: [] }, 
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
