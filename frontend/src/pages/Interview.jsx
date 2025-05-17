import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useInterviewStore from '../store/questionsStore';
import userAuthStore from '../store/userauthstore';

export default function Interview() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAttempted, setIsAttempted] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [showReadIndicator, setShowReadIndicator] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emotionData, setEmotionData] = useState({ emotion: '', eye_contact: '' });

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const { interviewQuestions, submitAnswer, interviewId, resetInterview } = useInterviewStore();
  const { authUser } = userAuthStore();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
  }, [currentQuestionIndex]);



  const handleReadQuestion = () => {
    if (!isReading) {
      setIsReading(true);
      setShowReadIndicator(true);
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(interviewQuestions[currentQuestionIndex]?.question);
      utterance.onend = () => {
        setIsReading(false);
        setShowReadIndicator(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  const handleAttempt = () => {
    if (!isAttempted) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsAttempted(true);
    }
  };

  const handleSubmit = async () => {
    SpeechRecognition.stopListening();  
    
    if (!transcript || transcript.trim() === "") {
      alert("Please respond to the question before submitting.");
      setIsAttempted(false);
      return;
    }

    const success = await submitAnswer(interviewId, currentQuestionIndex, transcript);
    resetTranscript();

    if (success) {
      goToNextQuestion();
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsAttempted(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        resetInterview();
        navigate(`/feedback/${authUser.id}/${interviewId}`);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Session</h1>
          <p className="text-gray-600">Answer naturally and clearly, just like in a real interview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Question {currentQuestionIndex + 1} of {interviewQuestions.length}
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[200px]">
              <p className="text-lg text-gray-700 leading-relaxed">
                {interviewQuestions[currentQuestionIndex]?.question}
              </p>

              {showReadIndicator && <p className="text-sm text-blue-500 mt-2">Reading the question...</p>}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReadQuestion}
                disabled={isReading}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isReading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Read Question
              </button>

              <button
                onClick={handleAttempt}
                disabled={isAttempted}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isAttempted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isAttempted ? 'Attempted' : 'Attempt'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={!listening}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  listening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex < interviewQuestions.length - 1 ? 'Submit & Next' : 'Finish Interview'}
              </button>
            </div>

            {listening && <p className="text-sm text-red-500 mt-2">Recording in progress...</p>}
            <p className="text-sm text-gray-700 mt-2">Response: {transcript}</p>
          </div>

          {/* Video Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="relative mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted={true}
                className="w-full h-[400px] bg-black rounded-xl object-cover"
              />
            </div>

            
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <p className="text-center text-lg text-gray-600 mt-4">Processing your responses...</p>
        )}
      </div>
    </div>
  );
}
