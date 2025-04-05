import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
function Lobby() {
  const { interviewID } = useParams();
  const [interview, setInterview] = useState(null);
    const [isCandidate,setIsCandidate] = useState(false)
    const [isInterviewer,setIsInterviewer] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios.post('http://localhost:5000/api/getCurrentUser', {}, {
          withCredentials: true
        })
        .then(response => {
          console.log("Current user data:", response.data)
          if(response.data.user.type == "candidate"){
            setIsCandidate(true)
          }
          if(response.data.user.type == "interviewer"){
            setIsInterviewer(true)
          }
        })
        .catch(error => console.error("Error fetching current user:", error));
        

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
            if(data.message == "Invalid or expired interview"){
              navigate('/interview-dashboard', { replace: true });
            }else{
              if(isCandidate){
                navigate(`/room/c/${interviewID}`, { replace: true });
              }
      
              if(isInterviewer){
                navigate(`/room/i/${interviewID}`, { replace: true });
              }
            }
        })
        .catch((err) => console.error('Failed to access interview:', err));

        
        
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
