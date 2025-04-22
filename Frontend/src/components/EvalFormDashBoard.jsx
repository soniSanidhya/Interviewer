import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

// Dark mode styles
const styles = {
  dashboard: {
    padding: '24px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#e0e0e0'
  },
  header: {
    marginBottom: '24px',
    color: '#ffffff'
  },
  card: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: '16px',
    height: '390px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: '12px',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.7)'
    }
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '24px',
    borderRadius: '8px',
    position: 'relative',
    border: '1px solid #444'
  },
  closeButton: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    color: '#aaa',
    cursor: 'pointer'
  },
  chip: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
    margin: '4px',
    padding: '4px 8px',
    borderRadius: '16px',
    fontSize: '0.75rem'
  },
  selectedChip: {
    backgroundColor: '#1976d2',
    color: '#fff'
  },
  divider: {
    borderColor: '#444',
    margin: '5px 0'
  }
};

const SkillSection = ({ title, skills, color = "primary" }) => {
  const filteredSkills = Object.entries(skills).filter(([_, value]) => value);
  
  if (filteredSkills.length === 0) return null;

  return (
    <div>
      <h4 style={{ color: '#aaa', marginBottom: '8px' }}>{title}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredSkills.map(([key]) => (
          <div key={key} style={styles.chip}>
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionsSection = ({ title, questions }) => {
  if (questions.length === 0) return null;

  return (
    <div style={{ margin: '12px' }}>
      <h4 style={{ color: '#aaa', marginBottom: '8px' }}>{title}</h4>
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {questions.map((q, i) => (
          <li key={i} style={{ marginBottom: '4px', color: '#bbb' }}>
            {i+1}. {q}
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

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

  if (loading) return (
    <div style={styles.dashboard}>
      <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div style={styles.dashboard}>
      <p style={{ color: '#f44336', textAlign: 'center', marginTop: '40px' }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <h1 style={styles.header}>Evaluation Forms Dashboard</h1>
      
      <button 
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '24px',
          fontSize: '1rem'
        }}
        onClick={() => navigate('/create-evalForm')}
      >
        Create New Evaluation Form
      </button>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {evalForms.length > 0 ? (
          evalForms.map((form) => (
            <div key={form._id} style={styles.card}>
              <h3 style={{ margin: '0 0 2px 0', color: '#fff' }}>
                Evaluation Form -- ({form.formName || "TestForm1"})
              </h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '2px 0' }}>
                Created: {formatDate(form.createdAt)}
              </p>
              <div style={styles.divider}></div>
              
              <p style={{ color: '#fff', margin: '4px 0' }}>
                Skills Selected: {countSelectedSkills(form.evalForm)}
              </p>
              
              {form.evalForm.customQuestions.programQuestions.length > 0 && (
                <div style={{ marginTop: '4px' }}>
                  <h4 style={{ color: '#aaa', marginBottom: '8px', fontSize: '0.9rem' }}>Programming Questions:</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {form.evalForm.customQuestions.programQuestions.map((q, i) => (
                      <li key={i} style={{ color: '#bbb', fontSize: '0.85rem', marginBottom: '4px' }}>• {q}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {form.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '2px' }}>Certifications:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {form.evalForm.culturalFit.growthMindset.certifications.map((cert, i) => (
                      <span 
                        key={i} 
                        style={{
                          ...styles.chip,
                          backgroundColor: '#1976d2'
                        }}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <button 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#90caf9',
                    border: '1px solid #90caf9',
                    padding: '4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 202, 249, 0.08)'
                    }
                  }}
                  onClick={() => handleViewDetails(form)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center', width: '100%', marginTop: '40px' }}>
            No evaluation forms found. Create your first one!
          </p>
        )}
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <span style={styles.closeButton} onClick={handleCloseModal}>
              ✕
            </span>

            {selectedForm && (
              <>
                <h2 style={{ margin: '0 0 16px 0', color: '#fff' }}>
                  Evaluation Form Details
                </h2>
                <p style={{ color: '#aaa', margin: '4px 0' }}>
                  Created: {formatDate(selectedForm.createdAt)}
                </p>
                <div style={styles.divider}></div>
                
                {/* Technical Skills */}
                <h3 style={{ color: '#fff', margin: '16px 0 12px 0' }}>
                  Technical Evaluation
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Coding Skills" 
                      skills={selectedForm.evalForm.technicalEvaluation.codingSkills} 
                    />
                  </div>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="System Design" 
                      skills={selectedForm.evalForm.technicalEvaluation.systemDesign} 
                    />
                  </div>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Tools & Platforms" 
                      skills={selectedForm.evalForm.technicalEvaluation.toolsAndPlatforms} 
                    />
                  </div>
                </div>

                {/* Soft Skills */}
                <h3 style={{ color: '#fff', margin: '16px 0 12px 0' }}>
                  Soft Skills Assessment
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Communication" 
                      skills={selectedForm.evalForm.softSkillsAssessment.communication}
                    />
                  </div>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Collaboration" 
                      skills={selectedForm.evalForm.softSkillsAssessment.collaboration}
                    />
                  </div>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Adaptability" 
                      skills={selectedForm.evalForm.softSkillsAssessment.adaptability}
                    />
                  </div>
                </div>

                {/* Cultural Fit */}
                <h3 style={{ color: '#fff', margin: '16px 0 12px 0' }}>
                  Cultural Fit
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Values Alignment" 
                      skills={selectedForm.evalForm.culturalFit.valuesAlignment}
                    />
                  </div>
                  
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    {selectedForm.evalForm.culturalFit.growthMindset.selfLearning && (
                      <>
                        <h4 style={{ color: '#aaa', marginBottom: '8px' }}>Growth Mindset</h4>
                        <div style={styles.chip}>Self Learning</div>
                      </>
                    )}
                  </div>
                  
                  <div style={{ flex: '1 1 200px', margin: '8px' }}>
                    <SkillSection 
                      title="Work Ethic" 
                      skills={selectedForm.evalForm.culturalFit.workEthic}
                    />
                  </div>
                </div>

                {/* Custom Questions Section */}
                <h3 style={{ color: '#fff', margin: '16px 0 12px 0' }}>
                  Custom Questions
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <QuestionsSection 
                    title="Programming Questions" 
                    questions={selectedForm.evalForm.customQuestions.programQuestions} 
                  />
                  <QuestionsSection 
                    title="Theory Questions" 
                    questions={selectedForm.evalForm.customQuestions.theoryQuestions} 
                  />
                  <QuestionsSection 
                    title="Other Questions" 
                    questions={selectedForm.evalForm.customQuestions.otherQuestions} 
                  />
                </div>

                {selectedForm.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <h4 style={{ color: '#aaa', marginBottom: '4px' }}>Certifications:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                      {selectedForm.evalForm.culturalFit.growthMindset.certifications.map((cert, i) => (
                        <span 
                          key={i} 
                          style={{
                            ...styles.chip,
                            backgroundColor: '#1976d2'
                          }}
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '14px',
                    fontSize: '1rem'
                  }}
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EvalFormDashBoard;