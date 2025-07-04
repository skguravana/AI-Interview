import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const backend_url = "https://intelliview-vsl2.onrender.com"; 

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
          const response = await axios.post(`${backend_url}/aiinterview/interview/start`, {
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

      submitAnswer: async (interviewId, questionIndex, responseText) => {
        try {
          const result = await axios.post(`${backend_url}/aiinterview/interview/${interviewId}/submit-answer`, {
            questionIndex,
            responseText
          }, { withCredentials: true });
          return true;
        } catch (err) {
          console.error("Error submitting answer:", err);
          return false;
        }
      },

      getInterviewFeedback: async (userId, interviewId) => {
        try {
          const result = await axios.get(
            `${backend_url}/aiinterview/interview/feedback/${userId}/${interviewId}`,
            { withCredentials: true }
          );
          return result;
        } catch (err) {
          console.error("Error fetching feedback:", err);
        }
      },

      getPastInterviews: async (userId) => {
        try {
          const result = await axios.get(
            `${backend_url}/aiinterview/interview/history/${userId}`,
            { withCredentials: true }
          );
          return result;
        } catch (err) {
          console.error("Error fetching interview history:", err);
        }
      },

      getRetakeInterviewQuestions: async (interviewId) => {
        try {
          const result = await axios.get(
            `${backend_url}/aiinterview/interview/retake/${interviewId}`,
            { withCredentials: true }
          );
          set({
            interviewId: interviewId,
            interviewQuestions: result.data
          });
          return true;
        } catch (err) {
          console.error("Error fetching retake interview questions:", err);
          return false;
        }
      },

      resetInterview: () => {
        set({ interviewId: null, interviewQuestions: [] });
      }
    }),
    {
      name: 'interview-store',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useInterviewStore;
