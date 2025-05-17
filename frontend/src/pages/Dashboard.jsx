import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import InterviewDialog from "../components/InterviewDialog";
import Footer from "../components/Footer";
import useInterviewStore from "../store/questionsStore";
import userAuthStore from "../store/userauthstore";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [isRetaking, setIsRetaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { getPastInterviews, getRetakeInterviewQuestions } = useInterviewStore();
  const { authUser } = userAuthStore();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (authUser?.id) {
        try {
          const pastInterviews = await getPastInterviews(authUser.id);
          setInterviews(pastInterviews.data);
        } catch (error) {
          console.error("Error fetching interviews:", error);
          setErrorMessage("Failed to load past interviews. Please try again later.");
        }
      }
    };

    fetchInterviews();
  }, []);

  const handleRetakeInterview = async (interviewId) => {
    setIsRetaking(true);
    setErrorMessage(null);
    const success = await getRetakeInterviewQuestions(interviewId);
    if (success) {
      setRedirect(`/interview`);
    } else {
      setErrorMessage("Failed to load interview questions. Please try again.");
    }
    setIsRetaking(false);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Interview Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">Practice and improve your interview skills</p>
          <button 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Start New Interview
          </button>
        </div>

        {open && <InterviewDialog setOpen={setOpen} />}
        {errorMessage && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Previous Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.length > 0 ? (
              interviews.map((interview) => (
                <div key={interview.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{interview.jobTitle}</h3>
                    <p className="text-gray-600 mb-4">{interview.jobDescription.trim() ? interview.jobDescription : '---'}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(interview.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRetakeInterview(interview._id)}
                        disabled={isRetaking}
                        className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors duration-200 ${
                          isRetaking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                        }`}
                      >
                        {isRetaking ? "Loading..." : "Retake"}
                      </button>
                      <button
                        onClick={() => setRedirect(`/feedback/${interview.userId}/${interview._id}`)}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        Feedback
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="mt-4 text-gray-500 text-lg">No previous interviews found</p>
                <p className="text-gray-400">Start your first interview to begin practicing</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
