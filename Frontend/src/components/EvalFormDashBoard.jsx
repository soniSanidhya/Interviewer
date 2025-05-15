import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { 
  FiPlusCircle, FiEye, FiX, FiCode, FiMessageSquare, 
  FiHeart, FiCheckCircle, FiCalendar, FiAlertCircle,
  FiClock, FiLoader, FiList, FiTag 
} from 'react-icons/fi';

function EvalFormDashBoard() {
  const navigate = useNavigate();
  const [interviewerId, setInterviewerId] = useState("");
  const [evalForms, setEvalForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_URL}/getCurrentUser/`, {}, {
        withCredentials: true
      });
      
      if (response.data.user.type === "interviewer") {
        setInterviewerId(response.data.user._id);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setError("Failed to authenticate user. Please sign in again.");
    }
  }, []);

  const fetchEvaluationForms = useCallback(async () => {
    if (!interviewerId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/getAllEvaluationFormByInterviewerId/${interviewerId}`, {},
        { withCredentials: true }
      );
      setEvalForms(response.data.evalForms || []);
    } catch (err) {
      console.error('Error fetching evaluation forms:', err);
      setError("Failed to load evaluation forms. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [interviewerId]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchEvaluationForms();
  }, [fetchEvaluationForms]);

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const countSelectedSkills = (evalForm) => {
    if (!evalForm) return 0;

    const countSelected = (obj) => Object.values(obj).filter(Boolean).length;

    return (
      countSelected(evalForm.technicalEvaluation.codingSkills) +
      countSelected(evalForm.technicalEvaluation.systemDesign) +
      countSelected(evalForm.technicalEvaluation.toolsAndPlatforms) +
      countSelected(evalForm.softSkillsAssessment.communication) +
      countSelected(evalForm.softSkillsAssessment.collaboration) +
      countSelected(evalForm.softSkillsAssessment.adaptability) +
      countSelected(evalForm.culturalFit.valuesAlignment) +
      countSelected(evalForm.culturalFit.workEthic) +
      (evalForm.culturalFit.growthMindset.selfLearning ? 1 : 0)
    );
  };

  const SkillSection = ({ title, skills, color = "#2563EB" }) => {
    const filteredSkills = Object.entries(skills).filter(([_, value]) => value);
    
    if (filteredSkills.length === 0) return null;
  
    return (
      <div className="mb-4">
        <h4 className="text-gray-700 mb-2 font-medium flex items-center gap-1">
          <FiTag className="text-blue-600" size={14} />
          {title}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {filteredSkills.map(([key]) => (
            <div key={key} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100 shadow-sm">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const QuestionsSection = ({ title, questions, icon }) => {
    if (questions.length === 0) return null;
  
    return (
      <div className="mb-5 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-gray-700 mb-3 font-medium flex items-center gap-1.5">
          {icon}
          {title}
        </h4>
        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="text-gray-600 pl-4 text-sm relative flex items-start">
              <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="ml-1">{q}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600 mb-2" size={40} />
        <div className="text-gray-600 font-medium">Loading your evaluation forms...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <FiAlertCircle size={20} />
          {error}
        </div>
        <button 
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <div className="container mx-auto p-2 pt-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
                >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                </button>
            </div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluation Forms Dashboard</h1>
          <p className="text-gray-600">Manage your candidate evaluation forms and create new templates</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 font-medium flex items-center">
            <FiList className="mr-2" />
            {evalForms.length} {evalForms.length === 1 ? 'Form' : 'Forms'} Available
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg 
                      transition-colors flex items-center gap-2 shadow-sm"
            onClick={() => navigate('/create-evalForm')}
          >
            <FiPlusCircle />
            Create New Form
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evalForms.length > 0 ? (
            evalForms.map((form) => (
              <div key={form._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">
                      {form.formName || "Form Template"}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-full">
                      {countSelectedSkills(form.evalForm)} Skills
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <FiCalendar className="mr-1" size={14} />
                    Created: {formatDate(form.createdAt)}
                  </div>
                </div>
                
                <div className="p-5 flex-grow">
                  {form.evalForm.customQuestions.programQuestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-gray-700 text-sm font-medium mb-2 flex items-center">
                        <FiCode className="mr-1.5 text-blue-600" size={14} />
                        Programming Questions
                      </h4>
                      <ul className="space-y-1.5">
                        {form.evalForm.customQuestions.programQuestions.slice(0, 2).map((q, i) => (
                          <li key={i} className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                            {q.length > 60 ? q.substring(0, 60) + '...' : q}
                          </li>
                        ))}
                        {form.evalForm.customQuestions.programQuestions.length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{form.evalForm.customQuestions.programQuestions.length - 2} more questions
                          </div>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {form.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-gray-700 text-sm font-medium mb-2 flex items-center">
                        <FiTag className="mr-1.5 text-green-600" size={14} />
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {form.evalForm.culturalFit.growthMindset.certifications.slice(0, 3).map((cert, i) => (
                          <span 
                            key={i} 
                            className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs border border-green-100"
                          >
                            {cert}
                          </span>
                        ))}
                        {form.evalForm.culturalFit.growthMindset.certifications.length > 3 && (
                          <span className="text-xs text-green-600 py-1">
                            +{form.evalForm.culturalFit.growthMindset.certifications.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                  <button 
                    className="w-full bg-white border border-blue-600 text-blue-600 rounded-lg py-2.5 px-4 
                              hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => handleViewDetails(form)}
                  >
                    <FiEye />
                    View Details
                  </button>
                </div>
              </div>
              
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FiList className="text-blue-600" size={30} />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">No Evaluation Forms Yet</h3>
              <p className="text-gray-500 text-center mb-6">
                Create your first evaluation form to start interviewing candidates
              </p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg 
                          transition-colors flex items-center gap-2 shadow-sm"
                onClick={() => navigate('/create-evalForm')}
              >
                <FiPlusCircle />
                Create Your First Form
              </button>
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-auto p-0 relative animate-fadeIn">
              <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Form Details: {selectedForm?.formName || "Evaluation Form"}
                </h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={handleCloseModal}
                >
                  <FiX size={24} />
                </button>
              </div>

              {selectedForm && (
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-1.5">
                      <FiCalendar className="text-gray-500" />
                      <span className="text-gray-700">Created: {formatDate(selectedForm.createdAt)}</span>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-1.5">
                      <FiCheckCircle className="text-blue-600" />
                      <span className="text-blue-700">{countSelectedSkills(selectedForm.evalForm)} Skills Selected</span>
                    </div>
                  </div>
                  
                  {/* Technical Skills */}
                  <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <FiCode />
                      Technical Evaluation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SkillSection 
                        title="Coding Skills" 
                        skills={selectedForm.evalForm.technicalEvaluation.codingSkills} 
                      />
                      <SkillSection 
                        title="System Design" 
                        skills={selectedForm.evalForm.technicalEvaluation.systemDesign} 
                      />
                      <SkillSection 
                        title="Tools & Platforms" 
                        skills={selectedForm.evalForm.technicalEvaluation.toolsAndPlatforms} 
                      />
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <FiMessageSquare />
                      Soft Skills Assessment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SkillSection 
                        title="Communication" 
                        skills={selectedForm.evalForm.softSkillsAssessment.communication}
                      />
                      <SkillSection 
                        title="Collaboration" 
                        skills={selectedForm.evalForm.softSkillsAssessment.collaboration}
                      />
                      <SkillSection 
                        title="Adaptability" 
                        skills={selectedForm.evalForm.softSkillsAssessment.adaptability}
                      />
                    </div>
                  </div>

                  {/* Cultural Fit */}
                  <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-amber-500 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <FiHeart />
                      Cultural Fit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SkillSection 
                        title="Values Alignment" 
                        skills={selectedForm.evalForm.culturalFit.valuesAlignment}
                      />
                      
                      <div>
                        {selectedForm.evalForm.culturalFit.growthMindset.selfLearning && (
                          <>
                            <h4 className="text-gray-700 mb-2 font-medium flex items-center gap-1">
                              <FiTag className="text-amber-500" size={14} />
                              Growth Mindset
                            </h4>
                            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm border border-amber-100 inline-block">
                              Self Learning
                            </div>
                          </>
                        )}
                      </div>
                      
                      <SkillSection 
                        title="Work Ethic" 
                        skills={selectedForm.evalForm.culturalFit.workEthic}
                      />
                    </div>
                  </div>

                  {/* Custom Questions Section */}
                  <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <FiMessageSquare />
                      Custom Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <QuestionsSection 
                        title="Programming Questions" 
                        questions={selectedForm.evalForm.customQuestions.programQuestions}
                        icon={<FiCode className="text-blue-600" size={16} />}
                      />
                      <QuestionsSection 
                        title="Theory Questions" 
                        questions={selectedForm.evalForm.customQuestions.theoryQuestions}
                        icon={<FiMessageSquare className="text-green-600" size={16} />}
                      />
                      <QuestionsSection 
                        title="Other Questions" 
                        questions={selectedForm.evalForm.customQuestions.otherQuestions}
                        icon={<FiList className="text-amber-500" size={16} />}
                      />
                    </div>
                  </div>

                  {selectedForm.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
                    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-xl font-semibold text-green-600 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <FiTag />
                        Required Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedForm.evalForm.culturalFit.growthMindset.certifications.map((cert, i) => (
                          <span 
                            key={i} 
                            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm border border-green-100 shadow-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-200 flex justify-end">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EvalFormDashBoard;