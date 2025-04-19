import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // console.log("id ", interviewerId);

    const fetchInterviews = async () => {
      if (interviewerId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/view-interviews-for-interviewer/${interviewerId}`,
            { withCredentials: true }
          );
          setInterviews(response.data.interviews);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch interviews');
          setLoading(false);
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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <FiAlertCircle className="inline mr-2" />
        {error}
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <FiCheckCircle className="mr-1" /> Completed
        </span>;
      case 'Ongoing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <FiVideo className="mr-1" /> Ongoing
        </span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <FiClock className="mr-1" /> Scheduled
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-3xl text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Interview Dashboard</h1>
          </div>
          <button
            onClick={()=>{navigate("/evalForm")}}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Manage EvaluationForms
          </button>
          <button
            onClick={scheduleNewInterview}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Schedule New Interview
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium">Total Interviews</h3>
            <p className="text-3xl font-bold text-gray-800">{interviews.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium">Upcoming</h3>
            <p className="text-3xl font-bold text-gray-800">
              {interviews.filter(i => i.status === 'Scheduled').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium">Completed</h3>
            <p className="text-3xl font-bold text-gray-800">
              {interviews.filter(i => i.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Interviews List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Your Interviews</h2>
          </div>

          {interviews.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">No interviews scheduled yet</div>
              <button
                onClick={scheduleNewInterview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Your First Interview
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {interviews.map((interview) => (
                <div key={interview._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                          {interview.interviewType}
                        </span>
                        {getStatusBadge(interview.status)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Interview with {interview.candidate?.name || 'Candidate'}
                      </h3>
                      <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1.5" />
                          {new Date(new Date(interview.scheduledAt).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-1.5" />
                          {interview.durationMinutes} minutes
                        </div>
                        {interview.meetingLink && (
                          <div className="flex items-center">
                            <FiLink className="mr-1.5" />
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Meeting Link
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => joinInterview(interview._id)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiVideo className="mr-2" />
                        {interview.status === 'Completed' ? 'View Details' : 'Join Interview'}
                      </button>
                    </div>
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