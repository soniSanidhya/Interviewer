import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CandidateDashBoard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const candidateID = useSelector(state => state.user?.user?.loggedInCandidate?._id);

  const joinInterview = (interviewID) => {
    // window.open(meetingLink, '_blank', 'noopener,noreferrer');
    navigate(`/lobby/${interviewID}`);
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      if (candidateID) {
        try {
            const response = await axios.get(`http://localhost:5000/api/view-interview-for-candidate/${candidateID}`, { withCredentials: true });
          setInterviews(response.data.interviews);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch interviews');
          setLoading(false);
        }
      }
    };

    fetchInterviews();
  }, [candidateID]);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Candidate Dashboard</h1>
        {interviews.length === 0 ? (
          <p className="text-gray-600">No interviews scheduled.</p>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview._id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <p className="text-lg font-semibold">{interview.interviewType}</p>
                <p className="text-gray-600">Scheduled At: {new Date(interview.scheduledAt).toLocaleString()}</p>
                <p className="text-gray-600">Duration: {interview.durationMinutes} minutes</p>
                <p className="text-blue-500">
                  Meeting Link: <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="underline">{interview.meetingLink}</a>
                </p>
                <p className={`font-bold ${interview.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>Status: {interview.status}</p>
                <button
                  onClick={() => joinInterview(interview._id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashBoard;