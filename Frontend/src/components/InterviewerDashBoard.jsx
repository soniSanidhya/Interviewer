import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiLink, FiUser, FiCheckCircle, FiAlertCircle, FiVideo, FiPlus } from 'react-icons/fi';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl text-gray-600 flex items-center space-x-2">
        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading interviews...</span>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiVideo className="mr-1" /> Ongoing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <FiClock className="mr-1" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center  text-blue-600 hover:text-blue-800 font-medium mb-2"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FaChalkboardTeacher className="text-blue-600 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Interviewer Dashboard</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/evalForm")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiPlus className="mr-2" />
              Manage Evaluation Forms
            </button>
            <button
              onClick={scheduleNewInterview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiPlus className="mr-2" />
              Schedule New Interview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-600">Total Interviews</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{interviews.length}</p>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-600">Upcoming</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{interviews.filter(i => i.status === 'Scheduled').length}</p>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-600">Completed</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{interviews.filter(i => i.status === 'Completed').length}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Interviews</h2>
          </div>

          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="text-lg text-gray-500 mb-4">No interviews scheduled yet</div>
              <button
                onClick={scheduleNewInterview}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Schedule Your First Interview
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <div key={interview._id} className="p-6 flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {interview.interviewType}
                      </span>
                      {getStatusBadge(interview.status)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Interview with {interview?.candidateId?.email || 'Candidate'}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-gray-500">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <FiCalendar className="mr-1 text-gray-400" />
                        {new Date(new Date(interview.scheduledAt).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString()}
                      </div>
                      <div className="flex items-center mb-2 sm:mb-0">
                        <FiClock className="mr-1 text-gray-400" />
                        {interview.durationMinutes} minutes
                      </div>
                      {interview.meetingLink && (
                        <div className="flex items-center">
                          <FiLink className="mr-1 text-gray-400" />
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Meeting Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => joinInterview(interview._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <FiVideo className="mr-2" />
                      {interview.status === 'completed' ? 'View Details' : 'Join Interview'}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewerDashBoard;