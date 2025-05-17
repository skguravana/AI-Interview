import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;