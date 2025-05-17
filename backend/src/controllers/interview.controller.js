import Interview from '../models/Interview.model.js';
import { generateQuestions, evaluateAnswer } from '../libs/quesgen.js';

export const startInterview = async (req, res) => {
  try {
    const { jobTitle, jobDescription, experience } = req.body;
    const userId = req.user._id;

    // Generate questions using GROQ
    const questions = await generateQuestions({ jobTitle, jobDescription, experience });

    // Create new interview
    const interview = new Interview({
      userId,
      jobTitle: jobTitle.toUpperCase(),
      jobDescription,
      experience,
      questions: questions.map(q => ({ question: q, userResponse: "", feedback: "", score: null }))
    });

    await interview.save();

    res.status(200).json({ interviewId: interview._id, questions });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ message: 'Failed to start interview' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, responseText } = req.body;
    const {interviewId } = req.params;
    console.log('sai',questionIndex,responseText)

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    // Store response
    interview.questions[questionIndex].userResponse = responseText;
    await interview.save();

    // Check if all answers are submitted
    
    if (questionIndex===4) {
      // Evaluate all answers at once
      const evaluationPrompt = interview.questions.map(q => ({
        question: q.question,
        answer: q.userResponse
      }));
    
      console.log('all completed')

      const feedbackResults = await evaluateAnswer(evaluationPrompt);
      let totalScore = 0;

      console.log(feedbackResults)
      // Store feedback and scores
      interview.questions.forEach((q, index) => {
        q.feedback = feedbackResults.evaluation[index].feedback;
        q.score = feedbackResults.evaluation[index].score;
        totalScore = totalScore+feedbackResults.evaluation[index].score;
      });
      interview.overallScore = (totalScore/50)*100;

      await interview.save();
    }

    res.status(200).json({ message: "Response stored successfully" });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to submit answer' });
  }
};

export const saievalall = async(req,res)=>{

  const interview = await Interview.findById('67e160e7bd9bbc06d8ab1e86');

    
      // Evaluate all answers at once
      const evaluationPrompt = interview.questions.map(q => ({
        question: q.question,
        answer: q.userResponse
      }));
    
      console.log('sai all eval completed')

      const feedbackResults = await evaluateAnswer(evaluationPrompt);
      console.log(feedbackResults.evaluation[0].feedback)

      res.status(200).json({ result:feedbackResults });


};

export const getInterviewDetails = async (req, res) => {
  try {
    const { userId, interviewId } = req.params;

    // Find interview by userId and interviewId
    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error("Error fetching interview details:", error);
    res.status(500).json({ message: "Failed to fetch interview details" });
  }
};

export const getRetakeInterviewQuestions = async (req, res) => {
  try {
    const { interviewId } = req.params; 
    
    // Fetch only the `questions` field
    const interview = await Interview.findOne(
      { _id: interviewId }, 
      { questions: 1, _id: 0 } // Projection to return only `questions`
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview.questions);
  } catch (error) {
    console.error("Error fetching retake interview questions:", error);
    res.status(500).json({ message: "Failed to fetch interview questions" });
  }
};


export const getInterviewHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Corrected extraction
    const interviews = await Interview.find({ userId }).select('-questions').sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({ message: 'Failed to fetch interview history' });
  }
};



