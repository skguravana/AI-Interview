import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useInterviewStore from "../store/questionsStore";

export default function InterviewDialog({ setOpen, isRetake = false, retakeInterviewId = null }) {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [experience, setExperience] = useState(0);
    const { loadNewInterviewQuestions, getRetakeInterviewQuestions, isLoadingQuestions, error } = useInterviewStore();

    const startInterview = async () => {
        if (isRetake && retakeInterviewId) {
            // Handle Retake Interview
            const success = await getRetakeInterviewQuestions(retakeInterviewId);
            if (success) navigate("/interview");
            return;
        }

        // Handle New Interview
        if (!jobTitle || !jobDescription || experience < 0) {
            alert("Please fill all fields correctly.");
            return;
        }

        const success = await loadNewInterviewQuestions({ jobTitle, jobDescription, experience });

        if (success) {
            navigate("/interview");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 m-4 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isRetake ? "Retake Interview" : "Start New Interview"}
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!isRetake && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                disabled={isLoadingQuestions}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="e.g., Senior Frontend Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                disabled={isLoadingQuestions}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder="Paste the job description here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                            <input
                                type="number"
                                min="0"
                                value={experience}
                                onChange={(e) => setExperience(Number(e.target.value))}
                                disabled={isLoadingQuestions}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={startInterview}
                        disabled={isLoadingQuestions}
                        className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                            isLoadingQuestions ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoadingQuestions ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isRetake ? "Fetching Questions..." : "Generating..."}
                            </span>
                        ) : (
                            isRetake ? "Retake Interview" : "Start Interview"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
