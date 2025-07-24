import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiVideo, FiCheckCircle, FiAlertCircle, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { BASE_URL } from '@/utils/constants';

function CandidateDashBoard({ candidateID }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const joinInterview = (interviewID) => {
    navigate(`/lobby/${interviewID}`);
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      if (candidateID) {
        try {
          const response = await axios.get(
            `${BASE_URL}/view-interview-for-candidate/${candidateID}`,
            { withCredentials: true }
          );
          setInterviews(response.data.interviews || []);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch interviews. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchInterviews();
  }, [candidateID]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-gray-50)' }}>
      <div className="text-xl flex items-center space-x-2" style={{ color: 'var(--color-gray-600)' }}>
        <svg className="animate-spin h-6 w-6" style={{ color: 'var(--color-primary)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading interviews...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-gray-50)' }}>
      <div className="card p-6 max-w-md text-center">
        <FiAlertCircle className="mx-auto text-4xl mb-4" style={{ color: 'var(--color-error)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-gray-900)' }}>Error Loading Interviews</h3>
        <p style={{ color: 'var(--color-gray-600)' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const getStatusBadge = (status, interviewDate) => {
    const isCompleted = status === 'completed';
    const isUpcoming = !isCompleted && new Date(interviewDate) > new Date();
    
    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
              style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
          <FiCheckCircle className="mr-1" /> Completed
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <FiClock className="mr-1" /> {isUpcoming ? 'Upcoming' : 'Scheduled'}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-gray-50)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div className="flex items-center">
              <FaGraduationCap className="text-3xl mr-3" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-gray-900)' }}>
                My Interviews
              </h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>Total Interviews</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-gray-900)' }}>{interviews.length}</p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>Upcoming</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {interviews.filter(i => i.status !== 'completed' && new Date(i.scheduledAt) > new Date()).length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>Completed</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>
              {interviews.filter(i => i.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Interviews Grid */}
        {interviews.length === 0 ? (
          <div className="card p-12 text-center">
            <FiUser className="mx-auto text-6xl mb-4" style={{ color: 'var(--color-gray-400)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-gray-900)' }}>No Interviews Yet</h3>
            <p style={{ color: 'var(--color-gray-600)' }}>
              You don't have any interviews scheduled at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => {
              const interviewDate = new Date(interview.scheduledAt);
              const isCompleted = interview.status === 'completed';
              const isUpcoming = !isCompleted && interviewDate > new Date();

              return (
                <div key={interview._id} className="card p-6 hover:shadow-lg transition-all duration-300">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-gray-900)' }}>
                      {interview.interviewType}
                    </h3>
                    {getStatusBadge(interview.status, interview.scheduledAt)}
                  </div>
                  
                  {/* Interview Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm" style={{ color: 'var(--color-gray-600)' }}>
                      <FiCalendar className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                      <span>{interviewDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm" style={{ color: 'var(--color-gray-600)' }}>
                      <FiClock className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                      <span>
                        {interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        ({interview.durationMinutes} mins)
                      </span>
                    </div>
                    {interview.interviewerId?.email && (
                      <div className="flex items-center text-sm" style={{ color: 'var(--color-gray-600)' }}>
                        <FiUser className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                        <span>{interview.interviewerId.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  {!isCompleted && (
                    <button
                      onClick={() => joinInterview(interview._id)}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
                    >
                      <FiVideo className="mr-2" />
                      Join Interview
                    </button>
                  )}
                  
                  {isCompleted && (
                    <div className="w-full text-center py-3 rounded-lg" 
                         style={{ backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                      Interview Completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashBoard;