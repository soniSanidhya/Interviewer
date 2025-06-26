import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { Groq } from 'groq-sdk';
import { FiUser, FiClock, FiCalendar, FiBarChart2, FiAward, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

function Lobby() {
  const { interviewID } = useParams();
  const [interview, setInterview] = useState(null);
  const [isCandidate, setIsCandidate] = useState(false);
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [result, setResult] = useState(null);
  const [grokAnalysis, setGrokAnalysis] = useState(null);
  const [loading, setLoading] = useState({
    user: true,
    interview: false,
    results: false,
    grokAnalysis: false
  });
  const [error, setError] = useState({
    user: null,
    interview: null,
    results: null,
    grokAnalysis: null
  });
  const navigate = useNavigate();

  // Fetch current user info
  useEffect(() => {
    setLoading(prev => ({ ...prev, user: true }));
    axios.post(`${BASE_URL}/getCurrentUser/`, {}, {
      withCredentials: true
    })
      .then(response => {
        if (response.data?.user?.type === "candidate") {
          setIsCandidate(true);
        }
        if (response.data?.user?.type === "interviewer") {
          setIsInterviewer(true);
        }
        setLoading(prev => ({ ...prev, user: false }));
      })
      .catch(error => {
        console.error("Error fetching current user:", error);
        setError(prev => ({ ...prev, user: "Failed to fetch user information" }));
        setLoading(prev => ({ ...prev, user: false }));
      });
  }, []);

  // Fetch interview data
  useEffect(() => {
    if (interviewID) {
      setLoading(prev => ({ ...prev, interview: true }));
      setError(prev => ({ ...prev, interview: null }));

      axios.post(`${BASE_URL}/getInterview`,
        { interviewID },
        { withCredentials: true }
      )
        .then(response => {
          setInterview(response.data.interview);
          setLoading(prev => ({ ...prev, interview: false }));
        })
        .catch(error => {
          console.error("Failed to fetch interview details:", error);
          setError(prev => ({ ...prev, interview: "Failed to fetch interview details" }));
          setLoading(prev => ({ ...prev, interview: false }));
        });
    }
  }, [interviewID]);

  // Define fetchInterviewResults with useCallback
  const fetchInterviewResults = useCallback((id) => {
    if (!id) return;

    setLoading(prev => ({ ...prev, results: true }));
    setError(prev => ({ ...prev, results: null }));

    axios.post(`${BASE_URL}/getresult/${id}`, {}, {
      withCredentials: true
    })
      .then(response => {
        setResult(response.data);
        setLoading(prev => ({ ...prev, results: false }));

        // After getting results, analyze with Grok
        if (response.data?.evaluationForm) {
          analyzeWithGrok(JSON.stringify(response.data));
        }
      })
      .catch(error => {
        console.error("Failed to fetch interview results:", error);
        setError(prev => ({ ...prev, results: "Failed to fetch interview results" }));
        setLoading(prev => ({ ...prev, results: false }));
      });
  }, []);

  // Analyze interview results with Grok
  const analyzeWithGrok = async (evaluationData) => {
    setLoading(prev => ({ ...prev, grokAnalysis: true }));
    setError(prev => ({ ...prev, grokAnalysis: null }));

    try {
      const groq = new Groq({
        apiKey: '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', dangerouslyAllowBrowser: true
      });

      // Prepare the message with evaluation data
     const promptMessage = `
Analyze the following technical interview evaluation data and provide a comprehensive and structured report with the following sections:

1. **Performance Summary**: A concise overview of the candidate's technical and behavioral performance during the interview.
2. **Key Strengths**: 3–5 specific skills or attributes where the candidate performed exceptionally (rated 4 or 5). Mention associated comments if available.
3. **Areas for Improvement**: 3–5 skills or attributes where the candidate showed weak performance (rated 1 or 2), along with related comments if present.
4. **Not Evaluated**: List all categories or skills that were marked with a rating of 0, indicating they were not evaluated during the session.
5. **Evaluation Insights by Category**: Analyze the candidate's performance grouped by categories (e.g., Problem Solving, Communication, Coding Practices), highlighting trends or standout points with scores and comments.
6. **Recommendations**: Actionable suggestions to help the candidate improve based on the low-scoring or missing areas.
7. **Overall Assessment**: Final thoughts summarizing the candidate’s overall technical proficiency, readiness, and potential based on the data provided.

**Important Notes**:
- The rating scale is from 1 to 5:
  - 5 = Excellent
  - 4 = Good
  - 3 = Average
  - 2 = Below Average
  - 1 = Poor
  - 0 = Not Evaluated (should be treated as missing data, not as poor performance)
- Always include the specific score and any comment associated with each point in your analysis.
- Format the response using **section headings** and **bullet points** for clarity.

Evaluation data:
${JSON.stringify(evaluationData, null, 2)}
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer who provides detailed, constructive feedback. Format your response with clear markdown headings and bullet points. Be specific and actionable in your recommendations."
          },
          { role: "user", content: promptMessage }
        ],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.5,
        max_tokens: 4096,
        top_p: 0.9
      });

      // Extract analysis content
      const analysisContent = chatCompletion.choices[0]?.message?.content;
      if (analysisContent) {
        setGrokAnalysis(analysisContent);
      } else {
        throw new Error("No analysis generated");
      }

      setLoading(prev => ({ ...prev, grokAnalysis: false }));
    } catch (error) {
      console.error("Failed to analyze with Grok:", error);
      setError(prev => ({ ...prev, grokAnalysis: "Failed to generate AI analysis" }));
      setLoading(prev => ({ ...prev, grokAnalysis: false }));
    }
  };

  // Fetch results when necessary
  useEffect(() => {
    if (isInterviewer && interview?.status === "completed") {
      fetchInterviewResults(interviewID);
    }
  }, [interviewID, isInterviewer, interview?.status, fetchInterviewResults]);

  const handleJoinCall = () => {
    axios.post(`${BASE_URL}/access-interview/${interviewID}`, {}, {
      withCredentials: true
    })
      .then(response => {
        const data = response.data;
        if (data.message === "Invalid or expired interview") {
          alert(`Access Result: ${data.message}`);
          navigate('/interview-dashboard', { replace: true });
        } else {
          if (isCandidate) {
            navigate(`/room/c/${interviewID}`, { replace: true });
          } else if (isInterviewer) {
            navigate(`/room/i/${interviewID}`, { replace: true });
          } else {
            alert("Cannot join: Your role is not identified");
          }
        }
      })
      .catch(error => {
        console.error('Failed to access interview:', error);
        alert("Failed to access interview. Please try again.");
      });
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not scheduled";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  // Render loading state
  if (loading.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiLoader className="animate-spin text-blue-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Information</h2>
          <p className="text-gray-600">Please wait while we load your user details...</p>
        </div>
      </div>
    );
  }

  // Render error state for critical errors
  if (error.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading User Data</h2>
          <p className="text-red-600 mb-4">{error.user}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format the AI analysis into sections
  const renderAnalysis = (analysis) => {
    if (!analysis) return null;

    // Split by markdown headings
    const sections = analysis.split(/\n\s*\n/).filter(section => section.trim());

    return sections.map((section, index) => {
      const isHeading = section.startsWith('**') || section.startsWith('#') || /^[A-Z][a-z]+:/.test(section);

      if (isHeading) {
        return (
          <div key={index} className="mb-4">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">
              {section.replace(/\*\*/g, '').replace(/#/g, '').split(':')[0]}
            </h4>
            {section.includes(':') && (
              <p className="text-gray-700 ml-4">
                {section.split(':').slice(1).join(':').trim()}
              </p>
            )}
          </div>
        );
      }

      return (
        <div key={index} className="mb-3 text-gray-700">
          {section.split('\n').map((line, i) => (
            <p key={i} className="mb-1">{line.replace(/^\s*[-•*]\s*/, '')}</p>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Interview Dashboard</h1>
          <span className="inline-block bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {(isCandidate && 'Candidate View') || (isInterviewer && 'Interviewer View') || 'Participant View'}
          </span>
        </div>

        {/* Interview Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <FiCalendar className="mr-2 text-blue-600" />
            Interview Details
          </h2>
          {loading.interview ? (
            <div className="flex justify-center py-4">
              <FiLoader className="animate-spin text-blue-600 mr-2" />
              <span>Loading interview details...</span>
            </div>
          ) : error.interview ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-center">
              <FiAlertCircle className="mr-2" />
              <span>{error.interview}</span>
            </div>
          ) : interview ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<FiUser className="text-blue-600" />} label="Interviewer ID" value={interview.interviewerId || "Not assigned"} />
              <InfoCard icon={<FiUser className="text-blue-600" />} label="Candidate ID" value={interview.candidateId || "Not assigned"} />
              <InfoCard icon={<FiCalendar className="text-blue-600" />} label="Scheduled At" value={formatDateTime(interview.scheduledAt)} />
              <InfoCard icon={<FiClock className="text-blue-600" />} label="Duration" value={interview.durationMinutes ? `${interview.durationMinutes} minutes` : "Not set"} />
              <div className="md:col-span-2">
                <InfoCard
                  icon={interview.status === "completed" ? <FiCheckCircle className="text-green-600" /> : <FiLoader className="text-blue-600" />}
                  label="Status"
                  value={
                    <span className={`font-medium ${interview.status === "completed" ? "text-green-600" : interview.status === "scheduled" ? "text-blue-600" : "text-yellow-600"}`}>
                      {interview.status || "Unknown"}
                    </span>
                  }
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No interview details available</p>
          )}
        </div>

        {/* Join Button */}
        {interview && interview.status !== "completed" && (
          <div className="text-center mb-8">
            <button
              onClick={handleJoinCall}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105"
              disabled={loading.interview}
            >
              {loading.interview ? (
                <span className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  Preparing...
                </span>
              ) : (
                "Join Interview Now"
              )}
            </button>
            {interview && !interview.meetingLink && interview.status !== "completed" && (
              <p className="mt-3 text-sm text-yellow-600">Meeting link will be available when the interview starts</p>
            )}
          </div>
        )}

        {/* Results Section */}
        {isInterviewer && interview?.status === "completed" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
              <FiBarChart2 className="mr-2 text-blue-600" />
              Interview Results
            </h2>
            {loading.results ? (
              <div className="flex justify-center py-8">
                <FiLoader className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
                <p className="text-gray-600">Loading evaluation results...</p>
              </div>
            ) : error.results ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-center">
                <FiAlertCircle className="mr-2" />
                <span>{error.results}</span>
              </div>
            ) : result ? (
              <div>
                {/* AI Analysis */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                      <FiAward className="mr-2" />
                      AI-Powered Performance Analysis
                    </h3>
                    {!grokAnalysis && !loading.grokAnalysis && (
                      <button
                        onClick={() => analyzeWithGrok(JSON.stringify(result))}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded"
                      >
                        Generate Analysis
                      </button>
                    )}
                  </div>
                  {loading.grokAnalysis ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FiLoader className="animate-spin text-blue-600 text-3xl mb-3" />
                      <p className="text-gray-600">Analyzing interview performance...</p>
                    </div>
                  ) : error.grokAnalysis ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-center">
                      <FiAlertCircle className="mr-2" />
                      <span>{error.grokAnalysis}</span>
                    </div>
                  ) : grokAnalysis ? (
                    <div className="prose prose-blue max-w-none">
                      {renderAnalysis(grokAnalysis.replace(/<think>[\s\S]*?<\/think>/gi, ''))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No analysis generated yet</p>
                      <button
                        onClick={() => analyzeWithGrok(JSON.stringify(result))}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                      >
                        Generate Performance Analysis
                      </button>
                    </div>
                  )}
                </div>
                {/* Raw Data */}
               
                  
                  <div className="p-4">
                    <pre className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto text-sm">
                      {JSON.stringify(result.evaluationForm, null, 2)}
                    </pre>
                  </div>
                
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 flex items-center justify-center">
                <FiAlertCircle className="mr-2" />
                <span>No evaluation results available yet</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Improved Info Card Component
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="ml-3">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}

export default Lobby;