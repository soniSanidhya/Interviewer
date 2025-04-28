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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1B1E]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-[#00E8C6]" />
            <span className="text-white font-bold text-xl tracking-wide">CodeInterview.Tech</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isCandidate && (
              <Link
                to={`/interview-dashboard`}
                className="text-white bg-[#00E8C6] px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
              >
                Candidate Dashboard
              </Link>
            )}
            <div className="px-4 py-2 ">
            </div>
            {isInterviewer && (
              <Link
                to={`/interview-dashboard`}
                className="text-white bg-[#00E8C6] px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
              >
                Interviewer Dashboard
              </Link>
            )}

            {(isCandidate || isInterviewer) ? (
              <button
                onClick={handleLogout}
                className="text-white gap bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <div className="relative group">
                <button className="bg-[#3d3d3d] text-white px-4 py-2 rounded-lg hover:bg-[#00E8C6] hover:text-black transition">
                  Get Started as
                </button>
                <ul className="absolute right-0 w-50 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto z-50">
                  <li>
                    <Link to="/candidate-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Candidate
                    </Link>
                  </li>

                  <li>
                    <Link to="/interviewer-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Interviewer
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
