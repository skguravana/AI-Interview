import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import useInterviewStore from "../store/questionsStore";

export default function Feedback() {
  const { userId, interviewId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openQuestions, setOpenQuestions] = useState({});
  const [redirect, setRedirect] = useState(null);
  const { getInterviewFeedback } = useInterviewStore();

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const result = await getInterviewFeedback(userId, interviewId);
        console.log('sai',result)
        setFeedbackData(result?.data || {}); 
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [userId, interviewId]);

  if (redirect) return <Navigate to={redirect} />;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          {feedbackData && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Interview Feedback</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(feedbackData?.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Job Title</p>
                  <p className="text-lg font-semibold">{feedbackData?.jobTitle || "N/A"}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Overall Score</p>
                  <p className="text-lg font-semibold">{feedbackData?.overallScore ?? "N/A"}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Questions and Feedback Section */}
          <div className="p-6">
            <div className="space-y-4">
              {feedbackData?.questions?.length > 0 ? (
                feedbackData.questions.map((q, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      onClick={() => toggleQuestion(index)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            q.score >= 8
                              ? "bg-green-100 text-green-600"
                              : q.score >= 6
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {q.score}
                        </div>
                        <span className="font-medium text-gray-900">
                          Q{index + 1}: {q.question}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          openQuestions[index] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {openQuestions[index] && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer:</h4>
                          <p className="text-gray-700">{q.userResponse || "No response provided"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Feedback:</h4>
                          <p className="text-gray-700">{q.feedback || "No feedback available"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No feedback available for this interview.</p>
              )}
            </div>

            {/* Return Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setRedirect("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
