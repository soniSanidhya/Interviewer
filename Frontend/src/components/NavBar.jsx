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
            <Zap className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
            <span className="font-bold text-xl tracking-wide" style={{ color: 'var(--color-gray-800)' }}>
              CodeInterview.Tech
            </span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isCandidate && (
              <Link
                to="/interview-dashboard"
                className="btn-primary"
              >
                Candidate Dashboard
              </Link>
            )}
            
            {isInterviewer && (
              <Link
                to="/interview-dashboard"
                className="btn-primary"
              >
                Interviewer Dashboard
              </Link>
            )}

            {(isCandidate || isInterviewer) ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-md font-medium transition shadow-sm text-white"
                style={{ 
                  backgroundColor: 'var(--color-error)',
                  '&:hover': { backgroundColor: 'var(--color-error-hover)' }
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-error-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-error)'}
              >
                Logout
              </button>
            ) : (
              <div className="relative group">
                <button className="btn-primary">
                  Get Started
                </button>
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out overflow-hidden" style={{ border: `1px solid var(--color-gray-200)` }}>
                  <li>
                    <Link 
                      to="/candidate-signup" 
                      className="block px-4 py-3 font-medium hover:underline transition-colors"
                      style={{ color: 'var(--color-gray-700)' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-gray-100)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      As Candidate
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/interviewer-signup" 
                      className="block px-4 py-3 font-medium hover:underline transition-colors"
                      style={{ color: 'var(--color-gray-700)' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-gray-100)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
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