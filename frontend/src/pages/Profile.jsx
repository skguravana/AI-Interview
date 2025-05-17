import { useState,useEffect } from "react";
import userAuthStore from "../store/userauthstore";
import useInterviewStore from "../store/questionsStore";

import Footer from "../components/Footer";

export default function Profile() {
  const { authUser } = userAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const { getPastInterviews} = useInterviewStore();

  const [formData, setFormData] = useState({
    ...authUser
  });

  const [newSkill, setNewSkill] = useState("");


   useEffect(() => {
     const fetchInterviews = async () => {
       if (authUser?.id) {
         try {
           const pastInterviews = await getPastInterviews(authUser.id);
           setInterviews(pastInterviews.data);
         } catch (error) {
           console.error("Error fetching interviews:", error);
         }
       }
     }; 
     fetchInterviews();
   }, []);

  const handleSubmit = async (e) => {
    if(!isEditing){
      setIsEditing(!isEditing);
      return
    }
    await userAuthStore.getState().updateProfile({ bio: formData.bio, skills: formData.skills });
    setIsEditing(false);
};

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold -mt-12 border-4 border-white shadow-lg">
                {formData.fullName[0]}
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold text-gray-900">{formData.fullName}</h1>
                <p className="text-gray-700">✉️{formData.email}</p>
                <p className="text-gray-600">💼{formData.position} at {formData.company}</p>
                <p className="text-gray-500 text-md">🗺️{formData.address}</p>
              </div>

              <button
                onClick={() => handleSubmit()}
                className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Profile Content */}
            <div className="mt-8">
              <div className="space-y-6">
                {/* Bio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  ) : (
                    <p className="text-gray-600">{formData.bio}</p>
                  )}
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <form onSubmit={addSkill} className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>

                {/* Interview History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview History</h3>
                  <div className="space-y-4">
                    {interviews.length>0?(
                      interviews.map((interview, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{interview.jobTitle}</h4>
                            <p className="text-sm text-gray-600">{interview.jobDescription.trim() ? interview.jobDescription : '---'}</p>
                            <p className="text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(interview.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{interview?.overallScore ?? "N/A"}%</div>
                            <p className="text-sm text-gray-600">Score</p>
                          </div>
                        </div>
                      ))
                    ):(
                      <p className="mt-4 text-gray-500 text-lg">No previous interviews found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}