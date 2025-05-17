import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { startInterview, submitAnswer,getInterviewDetails ,getInterviewHistory,getRetakeInterviewQuestions, saievalall } from '../controllers/interview.controller.js';

const router = express.Router();

// Protected routes - require authentication
router.use(protectRoute);

router.post('/start', startInterview);

router.post('/:interviewId/submit-answer', submitAnswer);

router.get('/evalall',saievalall)

router.get("/feedback/:userId/:interviewId", getInterviewDetails);

router.get('/history/:userId', getInterviewHistory);

router.get('/retake/:interviewId',getRetakeInterviewQuestions)

export default router;