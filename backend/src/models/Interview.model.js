import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobTitle: { 
    type: String, 
    required: true 
  },
  jobDescription: { 
    type: String, 
    required: true 
  },
  experience: { 
    type: Number, 
    required: true 
  },
  questions: [{
    question: String,
    userResponse: String,
    feedback: String,
    score: Number
  }],
  overallScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;