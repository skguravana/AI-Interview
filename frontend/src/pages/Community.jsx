import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import userAuthStore from "../store/userauthstore";

export default function Community() {
  const { authUser } = userAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/aiinterview/user/all", {
          withCredentials: true
        });
        // Filter out the current user
        const otherUsers = response.data.filter(user => user._id !== authUser.id);
        setUsers(otherUsers);

        // Extract unique skills from all users
        const skills = new Set();
        otherUsers.forEach(user => {
          user.skills?.forEach(skill => skills.add(skill));
        });
        setAllSkills(Array.from(skills));
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load community members");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authUser.id]);

  const toggleSkillFilter = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.every(skill => user.skills?.includes(skill));

    return matchesSearch && matchesSkills;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Community Members</h1>
          <p className="text-lg text-gray-600">Connect with other professionals in our community</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex justify-center">
              <input
                type="text"
                placeholder="Search by name, position, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-96 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          Showing {filteredUsers.length} member{filteredUsers.length !== 1 ? 's' : ''}
        </p>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {user.fullName[0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-600">{user.position}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&su=Hello&body=Hi%20there!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 flex items-center hover:underline"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </a>


                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.company}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.address}
                  </p>
                </div>

                {user.bio && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">About</h4>
                    <p className="text-gray-600">{user.bio}</p>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No members found matching your criteria</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}