import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function Lobby() {
  const { interviewID } = useParams();
  const [interview, setInterview] = useState(null);
  const isCandidate = useSelector(state => state.user?.user?.loggedInCandidate) || null;
  const isInterviewer = useSelector(state => state.user?.user?.loggedInaInterviewer) || null
  const navigate = useNavigate()

  useEffect(() => {
    if (interviewID) {
    fetch('http://localhost:5000/api/getInterview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interviewID }),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setInterview(data.interview))
      .catch((err) => console.error('Failed to fetch interview details:', err));
    }
  }, [interviewID]);

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading interview lobby...</p>
      </div>
    );
  }

const handleJoinCall = () => {
    fetch(`http://localhost:5000/api/access-interview/${interviewID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then((data) => {
            alert(`Access Result: ${data.message}`);
        })
        .catch((err) => console.error('Failed to access interview:', err));

        navigate(`/room/i/${interviewID}`, { replace: true });
};

return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
            <h1 className="text-3xl font-semibold text-blue-700 mb-4">Welcome to the Interview Lobby</h1>
            <h2 className="text-xl font-medium text-gray-800 mb-4">
                {(isCandidate && '(Candidate)') || (isInterviewer && '(Interviewer)') || 'Role not identified'}
            </h2>
            <div className="space-y-3 text-gray-700 text-left">
                <Info label="Interviewer ID" value={interview.interviewerId} />
                <Info label="Candidate ID" value={interview.candidateId} />
                <Info
                    label="Scheduled At"
                    value={new Date(new Date(interview.scheduledAt).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString()}
                />
                <Info label="Duration" value={`${interview.durationMinutes} minutes`} />
                <Info label="Status" value={interview.status} />
            </div>

            {/* {interview.meetingLink && (
                <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Join Meeting
                </a>
            )} */}

            <button onClick={handleJoinCall} className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">Join Interview</button>

            {!interview.meetingLink && (
                <p className="mt-6 text-red-500 font-medium">Meeting link not available yet.</p>
            )}
        </div>
    </div>
);
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-200 pb-2">
      <span className="font-medium">{label}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export default Lobby;
