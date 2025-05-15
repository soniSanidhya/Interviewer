import React, { useState, useEffect } from 'react';
import { FiCheck, FiPlus, FiSend, FiUser, FiCode, FiDatabase, FiTool, FiMessageSquare, FiUsers, FiRefreshCw, FiHeart, FiBook, FiClock } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/utils/constants';

const initialForm = {
    interviewerName: "",
    evalForm: {
        technicalEvaluation: {
            codingSkills: {
                dsa: false,
                languageProficiency: false,
                debugging: false,
                plagiarismCheck: false
            },
            systemDesign: {
                scalability: false,
                costOptimization: false,
                apiDesign: false,
                databaseDesign: false
            },
            toolsAndPlatforms: {
                cloud: false,
                devOps: false,
                legacyTech: false
            }
        },
        softSkillsAssessment: {
            communication: {
                clarity: false,
                activeListening: false,
                conflictResolution: false
            },
            collaboration: {
                gitWorkflow: false,
                feedbackHandling: false,
                teamPlayer: false
            },
            adaptability: {
                startupMindset: false,
                learningAgility: false
            }
        },
        culturalFit: {
            valuesAlignment: {
                companyValues: false,
                ethicalStandards: false
            },
            growthMindset: {
                certifications: [],
                selfLearning: false
            },
            workEthic: {
                ownership: false,
                punctuality: false
            }
        },
        customQuestions: {
            programQuestions: [],
            theoryQuestions: [],
            otherQuestions: []
        }
    }
};

function CreateEvaluationForm() {

    const [intvName, setIntvName] = useState("aksh")
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${BASE_URL}/getCurrentUser/`, {}, {
            withCredentials: true
        })
            .then(response => {
                if (response.data.user.type == "interviewer") {
                    setIntvName(response.data.user.userName)
                    setFormData({ ...formData, interviewerName: response.data.user.userName });
                }
            })
            .catch(error => console.error("Error fetching current user:", error));

    }, [])

    const [formData, setFormData] = useState(initialForm);
    const [certification, setCertification] = useState("");
    const [programQuestion, setProgramQuestion] = useState("");
    const [theoryQuestion, setTheoryQuestion] = useState("");
    const [otherQuestion, setOtherQuestion] = useState("");
    const [activeTab, setActiveTab] = useState("technical");
    const [formName, setFormName] = useState("");

    const handleChange = (e) => {
        setFormName(e.target.value);
    };

    const handleCheckboxChange = (category, subcategory, field) => {
        setFormData({
            ...formData,
            evalForm: {
                ...formData.evalForm,
                [category]: {
                    ...formData.evalForm[category],
                    [subcategory]: {
                        ...formData.evalForm[category][subcategory],
                        [field]: !formData.evalForm[category][subcategory][field]
                    }
                }
            }
        });
    };

    const addCertification = () => {
        if (certification.trim()) {
            setFormData({
                ...formData,
                evalForm: {
                    ...formData.evalForm,
                    culturalFit: {
                        ...formData.evalForm.culturalFit,
                        growthMindset: {
                            ...formData.evalForm.culturalFit.growthMindset,
                            certifications: [...formData.evalForm.culturalFit.growthMindset.certifications, certification]
                        }
                    }
                }
            });
            setCertification("");
        }
    };

    const addQuestion = (type, question, setter) => {
        if (question.trim()) {
            setFormData({
                ...formData,
                evalForm: {
                    ...formData.evalForm,
                    customQuestions: {
                        ...formData.evalForm.customQuestions,
                        [type]: [...formData.evalForm.customQuestions[type], question]
                    }
                }
            });
            setter("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.formName = formName
        axios.post(`${BASE_URL}/create-evalForm`, formData, { withCredentials: true })
            .then((resp) => {
                navigate("/evalForm")
            })
            .catch((error) => {
                console.error(error);
            });

        alert("Form submitted successfully! Check console for details.");
    };

    const removeCertification = (indexToRemove) => {
        setFormData({
            ...formData,
            evalForm: {
                ...formData.evalForm,
                culturalFit: {
                    ...formData.evalForm.culturalFit,
                    growthMindset: {
                        ...formData.evalForm.culturalFit.growthMindset,
                        certifications: formData.evalForm.culturalFit.growthMindset.certifications.filter((_, index) => index !== indexToRemove)
                    }
                }
            }
        });
    };

    const removeQuestion = (type, indexToRemove) => {
        setFormData({
            ...formData,
            evalForm: {
                ...formData.evalForm,
                customQuestions: {
                    ...formData.evalForm.customQuestions,
                    [type]: formData.evalForm.customQuestions[type].filter((_, index) => index !== indexToRemove)
                }
            }
        });
    };

    const Checkbox = ({ id, checked, onChange, label, className = "" }) => (
        <div className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {checked && <FiCheck className="text-white" size={14} />}
            </div>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
            <label htmlFor={id} className="cursor-pointer flex-1 text-gray-700">{label}</label>
        </div>
    );

    const TabButton = ({ active, icon, label, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 py-3 px-4 rounded-lg transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'technical':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 pb-2 border-b border-gray-200">
                            <FiCode />
                            Technical Evaluation
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
                                    <FiCode />
                                    Coding Skills
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="dsa"
                                        checked={formData.evalForm.technicalEvaluation.codingSkills.dsa}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'codingSkills', 'dsa')}
                                        label="Data Structures & Algorithms"
                                    />
                                    <Checkbox
                                        id="languageProficiency"
                                        checked={formData.evalForm.technicalEvaluation.codingSkills.languageProficiency}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'codingSkills', 'languageProficiency')}
                                        label="Language Proficiency"
                                    />
                                    <Checkbox
                                        id="debugging"
                                        checked={formData.evalForm.technicalEvaluation.codingSkills.debugging}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'codingSkills', 'debugging')}
                                        label="Debugging Skills"
                                    />
                                    <Checkbox
                                        id="plagiarismCheck"
                                        checked={formData.evalForm.technicalEvaluation.codingSkills.plagiarismCheck}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'codingSkills', 'plagiarismCheck')}
                                        label="Plagiarism Check"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
                                    <FiDatabase />
                                    System Design
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="scalability"
                                        checked={formData.evalForm.technicalEvaluation.systemDesign.scalability}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'systemDesign', 'scalability')}
                                        label="Scalability"
                                    />
                                    <Checkbox
                                        id="costOptimization"
                                        checked={formData.evalForm.technicalEvaluation.systemDesign.costOptimization}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'systemDesign', 'costOptimization')}
                                        label="Cost Optimization"
                                    />
                                    <Checkbox
                                        id="apiDesign"
                                        checked={formData.evalForm.technicalEvaluation.systemDesign.apiDesign}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'systemDesign', 'apiDesign')}
                                        label="API Design"
                                    />
                                    <Checkbox
                                        id="databaseDesign"
                                        checked={formData.evalForm.technicalEvaluation.systemDesign.databaseDesign}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'systemDesign', 'databaseDesign')}
                                        label="Database Design"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
                                    <FiTool />
                                    Tools & Platforms
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="cloud"
                                        checked={formData.evalForm.technicalEvaluation.toolsAndPlatforms.cloud}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'toolsAndPlatforms', 'cloud')}
                                        label="Cloud Technologies"
                                    />
                                    <Checkbox
                                        id="devOps"
                                        checked={formData.evalForm.technicalEvaluation.toolsAndPlatforms.devOps}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'toolsAndPlatforms', 'devOps')}
                                        label="DevOps"
                                    />
                                    <Checkbox
                                        id="legacyTech"
                                        checked={formData.evalForm.technicalEvaluation.toolsAndPlatforms.legacyTech}
                                        onChange={() => handleCheckboxChange('technicalEvaluation', 'toolsAndPlatforms', 'legacyTech')}
                                        label="Legacy Technologies"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'soft':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2 pb-2 border-b border-gray-200">
                            <FiMessageSquare />
                            Soft Skills Assessment
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-4">
                                    <FiMessageSquare />
                                    Communication
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="clarity"
                                        checked={formData.evalForm.softSkillsAssessment.communication.clarity}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'communication', 'clarity')}
                                        label="Clear Communication"
                                    />
                                    <Checkbox
                                        id="activeListening"
                                        checked={formData.evalForm.softSkillsAssessment.communication.activeListening}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'communication', 'activeListening')}
                                        label="Active Listening"
                                    />
                                    <Checkbox
                                        id="conflictResolution"
                                        checked={formData.evalForm.softSkillsAssessment.communication.conflictResolution}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'communication', 'conflictResolution')}
                                        label="Conflict Resolution"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-4">
                                    <FiUsers />
                                    Collaboration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="gitWorkflow"
                                        checked={formData.evalForm.softSkillsAssessment.collaboration.gitWorkflow}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'collaboration', 'gitWorkflow')}
                                        label="Git Workflow"
                                    />
                                    <Checkbox
                                        id="feedbackHandling"
                                        checked={formData.evalForm.softSkillsAssessment.collaboration.feedbackHandling}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'collaboration', 'feedbackHandling')}
                                        label="Feedback Handling"
                                    />
                                    <Checkbox
                                        id="teamPlayer"
                                        checked={formData.evalForm.softSkillsAssessment.collaboration.teamPlayer}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'collaboration', 'teamPlayer')}
                                        label="Team Player"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-4">
                                    <FiRefreshCw />
                                    Adaptability
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="startupMindset"
                                        checked={formData.evalForm.softSkillsAssessment.adaptability.startupMindset}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'adaptability', 'startupMindset')}
                                        label="Startup Mindset"
                                    />
                                    <Checkbox
                                        id="learningAgility"
                                        checked={formData.evalForm.softSkillsAssessment.adaptability.learningAgility}
                                        onChange={() => handleCheckboxChange('softSkillsAssessment', 'adaptability', 'learningAgility')}
                                        label="Learning Agility"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'cultural':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2 pb-2 border-b border-gray-200">
                            <FiHeart />
                            Cultural Fit
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-amber-500 flex items-center gap-2 mb-4">
                                    <FiHeart />
                                    Values Alignment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="companyValues"
                                        checked={formData.evalForm.culturalFit.valuesAlignment.companyValues}
                                        onChange={() => handleCheckboxChange('culturalFit', 'valuesAlignment', 'companyValues')}
                                        label="Company Values"
                                    />
                                    <Checkbox
                                        id="ethicalStandards"
                                        checked={formData.evalForm.culturalFit.valuesAlignment.ethicalStandards}
                                        onChange={() => handleCheckboxChange('culturalFit', 'valuesAlignment', 'ethicalStandards')}
                                        label="Ethical Standards"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-amber-500 flex items-center gap-2 mb-4">
                                    <FiBook />
                                    Growth Mindset
                                </h3>
                                <div className="mb-4">
                                    <Checkbox
                                        id="selfLearning"
                                        checked={formData.evalForm.culturalFit.growthMindset.selfLearning}
                                        onChange={() => handleCheckboxChange('culturalFit', 'growthMindset', 'selfLearning')}
                                        label="Self Learning"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-700">Certifications</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={certification}
                                            onChange={(e) => setCertification(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Add certification"
                                        />
                                        <button
                                            type="button"
                                            onClick={addCertification}
                                            className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiPlus size={20} />
                                        </button>
                                    </div>

                                    {formData.evalForm.culturalFit.growthMindset.certifications.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {formData.evalForm.culturalFit.growthMindset.certifications.map((cert, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                    <span className="text-gray-700">{cert}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertification(index)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-amber-500 flex items-center gap-2 mb-4">
                                    <FiClock />
                                    Work Ethic
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Checkbox
                                        id="ownership"
                                        checked={formData.evalForm.culturalFit.workEthic.ownership}
                                        onChange={() => handleCheckboxChange('culturalFit', 'workEthic', 'ownership')}
                                        label="Ownership"
                                    />
                                    <Checkbox
                                        id="punctuality"
                                        checked={formData.evalForm.culturalFit.workEthic.punctuality}
                                        onChange={() => handleCheckboxChange('culturalFit', 'workEthic', 'punctuality')}
                                        label="Punctuality"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'custom':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                            <FiMessageSquare />
                            Custom Questions
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-4">Program Questions</h3>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={programQuestion}
                                            onChange={(e) => setProgramQuestion(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Add a programming question"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addQuestion('programQuestions', programQuestion, setProgramQuestion)}
                                            className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiPlus size={20} />
                                        </button>
                                    </div>

                                    {formData.evalForm.customQuestions.programQuestions.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {formData.evalForm.customQuestions.programQuestions.map((q, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                    <span className="text-gray-700">{q}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion('programQuestions', index)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-4">Theory Questions</h3>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={theoryQuestion}
                                            onChange={(e) => setTheoryQuestion(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Add a theory question"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addQuestion('theoryQuestions', theoryQuestion, setTheoryQuestion)}
                                            className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiPlus size={20} />
                                        </button>
                                    </div>

                                    {formData.evalForm.customQuestions.theoryQuestions.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {formData.evalForm.customQuestions.theoryQuestions.map((q, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                    <span className="text-gray-700">{q}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion('theoryQuestions', index)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-4">Other Questions</h3>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={otherQuestion}
                                            onChange={(e) => setOtherQuestion(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Add other question"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addQuestion('otherQuestions', otherQuestion, setOtherQuestion)}
                                            className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiPlus size={20} />
                                        </button>
                                    </div>

                                    {formData.evalForm.customQuestions.otherQuestions.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {formData.evalForm.customQuestions.otherQuestions.map((q, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                    <span className="text-gray-700">{q}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion('otherQuestions', index)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="group relative py-3 px-8 rounded-lg overflow-hidden bg-blue-600 text-white font-medium shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:bg-blue-800"
                            >
                                <span className="flex items-center gap-2">
                                    <FiSend />
                                    Submit Evaluation
                                </span>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
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
            <div className="container mx-auto p-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Candidate Evaluation Form
                    </h1>
                   
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <label className="text-lg font-medium text-gray-700">
                                Evaluation Form Name
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={formName}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-700 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                                placeholder="Enter form name"
                                required
                            />
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
                            <TabButton
                                active={activeTab === 'technical'}
                                onClick={() => setActiveTab('technical')}
                                icon={<FiCode className={activeTab === 'technical' ? 'text-blue-600' : 'text-gray-500'} />}
                                label="Technical"
                            />
                            <TabButton
                                active={activeTab === 'soft'}
                                onClick={() => setActiveTab('soft')}
                                icon={<FiMessageSquare className={activeTab === 'soft' ? 'text-green-600' : 'text-gray-500'} />}
                                label="Soft Skills"
                            />
                            <TabButton
                                active={activeTab === 'cultural'}
                                onClick={() => setActiveTab('cultural')}
                                icon={<FiHeart className={activeTab === 'cultural' ? 'text-amber-500' : 'text-gray-500'} />}
                                label="Cultural Fit"
                            />
                            <TabButton
                                active={activeTab === 'custom'}
                                onClick={() => setActiveTab('custom')}
                                icon={<FiMessageSquare className={activeTab === 'custom' ? 'text-blue-800' : 'text-gray-500'} />}
                                label="Custom Questions"
                            />
                        </div>

                        <div className="min-h-[400px]">
                            {renderTabContent()}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEvaluationForm;
