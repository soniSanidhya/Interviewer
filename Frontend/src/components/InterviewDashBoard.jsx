
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CandidateDashBoard from './CandidateDashBoard';
import InterviewerDashBoard from './InterviewerDashBoard';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

function InterviewDashBoard() {

  // const isCandidate = useSelector(state => state.user?.user?.loggedInCandidate) || null;
  // const isInterviewer = useSelector(state => state.user?.user?.loggedInaInterviewer) || null

  const [isCandidate,setIsCandidate] = useState(false)
  const [isInterviewer,setIsInterviewer] = useState(false)
  const [candidateID,setCandidateId] = useState(false)
  const [interviewerId,setInterviewerId] = useState(false)

  useEffect(() => {
    // console.log("candidate is ", isCandidate);
    // console.log("interviewer is ", isInterviewer);

    axios.post(`${BASE_URL}/getCurrentUser`, {}, {
      withCredentials: true
    })
    .then(response => {
      console.log("Current user data:", response.data)
      if(response.data.user.type == "candidate"){
        setIsCandidate(true)
        setCandidateId(response.data.user._id)
      }
      if(response.data.user.type == "interviewer"){
        setIsInterviewer(true)
        console.log("heyy ",response.data.user._id);
        
        setInterviewerId(response.data.user._id)
      }
    })
    .catch(error => console.error("Error fetching current user:", error));
    
  }, [])


  return (
    <div>
      Interview dashboard
      {isInterviewer && <InterviewerDashBoard interviewerId={interviewerId} />}
      { isCandidate && <CandidateDashBoard candidateID={candidateID} />}
      {/* <InterviewerDashBoard/> */}
    </div>
  )
}

export default InterviewDashBoard
