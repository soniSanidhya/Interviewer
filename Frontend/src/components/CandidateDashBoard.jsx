import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaVideo, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl p-4 font-bold text-gray-800 mb-6">Candidate Interviews</h1>
        
        {interviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => {
              const interviewDate = new Date(interview.scheduledAt);
              const isCompleted = interview.status === 'Completed';
              const isUpcoming = !isCompleted && interviewDate > new Date();

              return (
                <div 
                  key={interview._id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                    isCompleted ? 'border-green-200' : 'border-blue-200'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {interview.interviewType}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isCompleted ? (
                          <>
                            <FaCheckCircle className="inline mr-1" /> Completed
                          </>
                        ) : (
                          <>
                            <FaHourglassHalf className="inline mr-1" /> Pending
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>{interviewDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-400" />
                        <span>{interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div>
                        <span>Duration: {interview.durationMinutes} mins</span>
                      </div>
                    </div>
                    
                    {!isCompleted && (
                      <button
                        onClick={() => joinInterview(interview._id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        <FaVideo className="mr-2" /> Join Interview
                      </button>
                    )}
                  </div>
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