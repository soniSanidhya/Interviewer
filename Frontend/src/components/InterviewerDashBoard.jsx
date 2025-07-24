import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiLink, FiUser, FiCheckCircle, FiAlertCircle, FiVideo, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { BASE_URL } from '@/utils/constants';

function InterviewerDashBoard({ interviewerId }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const cacheRef = useRef(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (interviewerId) {
        if (cacheRef.current) {
          setInterviews(cacheRef.current);
          setLoading(false);
        } else {
          try {
            const response = await axios.get(
              `${BASE_URL}/view-interviews-for-interviewer/${interviewerId}`,
              { withCredentials: true }
            );
            setInterviews(response.data.interviews);
            cacheRef.current = response.data.interviews;
            setLoading(false);
          } catch (err) {
            setLoading(false);
            setError(err?.response?.data || "Failed to load interviews");
          }
        }
      }
    };

    fetchInterviews();
  }, [interviewerId]);

  const joinInterview = (interviewID) => {
    navigate(`/lobby/${interviewID}`);
  };

  const scheduleNewInterview = () => {
    navigate('/schedule-interview');
  };

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <FiVideo className="mr-1" /> Ongoing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--color-warning)', color: 'white' }}>
            <FiClock className="mr-1" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div className="flex items-center">
              <FaChalkboardTeacher className="text-3xl mr-3" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-gray-900)' }}>
                Interviewer Dashboard
              </h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/evalForm")}
              className="btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Manage Evaluation Forms
            </button>
            <button
              onClick={scheduleNewInterview}
              className="btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Schedule New Interview
            </button>
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
              {interviews.filter(i => i.status === 'scheduled').length}
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
            <FaChalkboardTeacher className="mx-auto text-6xl mb-4" style={{ color: 'var(--color-gray-400)' }} />
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-gray-900)' }}>
              No Interviews Scheduled
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-gray-600)' }}>
              Get started by scheduling your first interview
            </p>
            <button
              onClick={scheduleNewInterview}
              className="btn-primary"
            >
              <FiPlus className="mr-2" />
              Schedule Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <div key={interview._id} className="card p-6 hover:shadow-lg transition-all duration-300">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 w-fit"
                          style={{ backgroundColor: 'var(--color-primary-light)', color: 'white' }}>
                      {interview.interviewType}
                    </span>
                    {getStatusBadge(interview.status)}
                  </div>
                </div>
                
                {/* Candidate Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-gray-900)' }}>
                    Interview with Candidate
                  </h3>
                  <div className="flex items-center text-sm mb-2" style={{ color: 'var(--color-gray-600)' }}>
                    <FiUser className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                    <span>{interview?.candidateId?.email || 'Candidate Email'}</span>
                  </div>
                </div>
                
                {/* Interview Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm" style={{ color: 'var(--color-gray-600)' }}>
                    <FiCalendar className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                    <span>
                      {new Date(new Date(interview.scheduledAt).getTime() - 5.5 * 60 * 60 * 1000)
                        .toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: 'var(--color-gray-600)' }}>
                    <FiClock className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                    <span>
                      {new Date(new Date(interview.scheduledAt).getTime() - 5.5 * 60 * 60 * 1000)
                        .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                      ({interview.durationMinutes} mins)
                    </span>
                  </div>
                  {interview.meetingLink && (
                    <div className="flex items-center text-sm">
                      <FiLink className="mr-2" style={{ color: 'var(--color-gray-400)' }} />
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Meeting Link
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
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
                  {interview.status === 'completed' ? 'View Details' : 'Join Interview'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewerDashBoard;