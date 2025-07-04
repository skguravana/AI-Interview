import { Link } from "react-router-dom";
import { useState } from "react";
import userAuthStore from "../store/userauthstore";

export default function Navbar() {
  const { authUser,logOut } = userAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                Intelli View
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white border-b-2 border-transparent hover:border-white transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white border-b-2 border-transparent hover:border-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              
                <Link
                  to="/profile"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white border-b-2 border-transparent hover:border-white transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                to="/findpeople"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white border-b-2 border-transparent hover:border-white transition-colors duration-200"
              >
                FindPeople
              </Link>
          
              
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!authUser ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white">Welcome, {authUser.email}</span>
                <button
                  onClick={() => {
                    logOut()
                  }}
                  className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-blue-700`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
          >
            Dashboard
          </Link>
          {authUser && (
            <Link
              to="/profile"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
            >
              Profile
            </Link>
          )}
          {!authUser ? (
            <>
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                // Handle logout
              }}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-blue-800 hover:border-white transition duration-150 ease-in-out"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}