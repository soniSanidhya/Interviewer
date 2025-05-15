import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

export default function Navbar() {
  const [isCandidate, setIsCandidate] = useState(false);
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [interviewerId, setInterviewerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${BASE_URL}/getCurrentUser/`, {}, {
      withCredentials: true
    })
      .then(response => {
        if (response.data?.user?.type === 'candidate') {
          setIsCandidate(true);
          setCandidateId(response.data.user._id);
        } else if (response.data?.user?.type === 'interviewer') {
          setIsInterviewer(true);
          setInterviewerId(response.data.user._id);
        }
      })
      .catch(error => console.error("Error fetching current user:", error));
  }, []);

  const handleLogout = () => {
    axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
      .then(() => {
        setIsCandidate(false);
        setIsInterviewer(false);
        setCandidateId(null);
        setInterviewerId(null);
        navigate('/');
      })
      .catch(err => console.error("Logout failed:", err));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-gray-800 font-bold text-xl tracking-wide">CodeInterview.Tech</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isCandidate && (
              <Link
                to="/interview-dashboard"
                className="text-white bg-blue-600 px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Candidate Dashboard
              </Link>
            )}
            
            {isInterviewer && (
              <Link
                to="/interview-dashboard"
                className="text-white bg-blue-600 px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Interviewer Dashboard
              </Link>
            )}

            {(isCandidate || isInterviewer) ? (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-5 py-2 rounded-md font-medium hover:bg-red-600 transition shadow-sm"
              >
                Logout
              </button>
            ) : (
              <div className="relative group">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm">
                  Get Started
                </button>
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out border border-gray-200 overflow-hidden">
                  <li>
                    <Link to="/candidate-signup" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium">
                      As Candidate
                    </Link>
                  </li>
                  <li>
                    <Link to="/interviewer-signup" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium">
                      As Interviewer
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}