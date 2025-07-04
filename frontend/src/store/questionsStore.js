import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const useInterviewStore = create(
  persist(
    (set, get) => ({
      interviewId: null,
      interviewQuestions: [],
      isLoadingQuestions: false,
      error: null,

      loadNewInterviewQuestions: async ({ jobTitle, jobDescription, experience }) => {
        set({ isLoadingQuestions: true, error: null });

        try {
          
          const response = await axios.post("http://localhost:5000/aiinterview/interview/start", {
            jobTitle,
            jobDescription,
            experience
          }, { withCredentials: true });

          set({
            interviewId: response.data.interviewId,
            interviewQuestions: response.data.questions.map(q => ({ question: q, userResponse: "" })),
            isLoadingQuestions: false,
          });

          return true;
        } catch (err) {
          console.error("Error generating questions:", err);
          set({ error: "Failed to generate interview questions.", isLoadingQuestions: false });
          return false;
        }
      },

      submitAnswer: async (interviewId,questionIndex, responseText) => {
        console.log(responseText);
        try {
          const result = await axios.post(`http://localhost:5000/aiinterview/interview/${interviewId}/submit-answer`, {
            questionIndex,
            responseText
          }, { withCredentials: true });
          return true;

        } catch (err) {
          console.error("Error submitting answer:", err);
          return false;
        }
      },

      getInterviewFeedback:async(userId,interviewId)=>{
        try {
          const result = await axios.get(`http://localhost:5000/aiinterview/interview/feedback/${userId}/${interviewId}`,
          { withCredentials: true });
          return result;

        } catch (err) {
          console.error("Error submitting answer:", err);
        }
      },

      getPastInterviews: async (userId) => {
        try {
          const result = await axios.get(
            `http://localhost:5000/aiinterview/interview/history/${userId}`,
            { withCredentials: true } 
          );
          console.log(result);
          return result;
        } catch (err) {
          console.error("Error Fetching Interview History:", err);
        }
      },
      
      getRetakeInterviewQuestions: async (interviewId)=>{
        try {
          const result = await axios.get(
            `http://localhost:5000/aiinterview/interview/retake/${interviewId}`,
            { withCredentials: true } 
          );
          console.log(result);
          set({
            interviewId:interviewId,
            interviewQuestions:result.data
          })
          return true;
        } catch (err) {
          console.error("Error Fetching Retake Interview QUestions:", err);
          return false;
        }
      },
      
      
      resetInterview: () => {
        set({ interviewId: null, interviewQuestions: [] });
      }
    }),
    { name: 'interview-store', storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useInterviewStore;
