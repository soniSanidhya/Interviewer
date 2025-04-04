
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import CandidateDashBoard from './CandidateDashBoard';
import InterviewerDashBoard from './InterviewerDashBoard';

function InterviewDashBoard() {

  const isCandidate = useSelector(state => state.user?.user?.loggedInCandidate) || null;
  const isInterviewer = useSelector(state => state.user?.user?.loggedInaInterviewer) || null

  useEffect(() => {
    console.log("candidate is ", isCandidate);
    console.log("interviewer is ", isInterviewer);
  }, [isCandidate])


  return (
    <div>
      Interview dashboard
      {isInterviewer && <InterviewerDashBoard/>}
      { isCandidate && <CandidateDashBoard/>}
      {/* <InterviewerDashBoard/> */}
    </div>
  )
}

export default InterviewDashBoard
