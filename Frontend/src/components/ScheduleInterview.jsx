import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

function ScheduleInterview() {
    const [interviewerName, setInterviewerName] = useState('');
    const [interviewerId, setInterviewerId] = useState('');
    const [evalForms, setEvalForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [modal, setModal] = useState({ show: false, success: false, message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${BASE_URL}/getCurrentUser/`, {}, { withCredentials: true })
            .then(res => {
                if (res.data.user.type === 'interviewer') {
                    setInterviewerName(res.data.user.userName);
                    setInterviewerId(res.data.user._id);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (interviewerId) {
            axios.post(`${BASE_URL}/getAllEvaluationFormByInterviewerId/${interviewerId}`, {}, { withCredentials: true })
                .then(res => {
                    setEvalForms(res.data.evalForms || []);
                    setLoadingForms(false);
                })
                .catch(err => {
                    console.error('Error fetching evaluation forms:', err);
                    setLoadingForms(false);
                });
        }
    }, [interviewerId]);

    const [formData, setFormData] = useState({
        interviewerUserName: '',
        candidateEmail: '',
        date: '',
        time: '',
        duration: 10,
        timeZone: 'Asia/Kolkata',
        interviewType: 'technical',
        evaluationFormId: '',
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, interviewerUserName: interviewerName }));
    }, [interviewerName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setModal({ show: false, success: false, message: '' });

        try {
            const res = await fetch(`${BASE_URL}/schedule-interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await res.json();

            if (res.ok) {
                setModal({
                    show: true,
                    success: true,
                    message: `Interview scheduled successfully. Mail sent to ${formData.candidateEmail}!`
                });
            } else {
                setModal({ show: true, success: false, message: result.message || 'Failed to schedule interview.' });
            }
        } catch (err) {
            setModal({ show: true, success: false, message: 'Network error. Please try again.' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleModalClose = () => {
        setModal({ show: false, success: false, message: '' });
        if (modal.success) {
            navigate('/interview-dashboard'); // Replace with your actual dashboard route
        } else {
            navigate(0); // Refresh current page
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 relative">
            <div className="w-full max-w-xl bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-700">
                <h1 className="text-3xl font-semibold text-indigo-400 mb-8 text-center">Schedule Interview</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Input Components */}
      {[
        { label: "Interviewer Username", name: "interviewerUserName", readOnly: true, value: formData.interviewerUserName },
        { label: "Candidate Email", name: "candidateEmail", value: formData.candidateEmail },
        { label: "Interview Type", name: "interviewType", value: formData.interviewType },
        { label: "Time Zone", name: "timeZone", value: formData.timeZone },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-300">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={field.value}
            onChange={handleChange}
            readOnly={field.readOnly}
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      ))}

      {/* Evaluation Form Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Evaluation Form</label>
        {loadingForms ? (
          <div className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-400">
            Loading evaluation forms...
          </div>
        ) : (
          <select
            name="evaluationFormId"
            value={formData.evaluationFormId}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an evaluation form</option>
            {evalForms.map(form => (
              <option key={form._id} value={form.formName}>
                {form.formName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

                    <button
                        type="submit"
                        disabled={loadingSubmit}
                        className={`w-full ${
                            loadingSubmit ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white font-medium py-2 px-4 rounded-md shadow-md transition-all duration-200`}
                    >
                        {loadingSubmit ? 'Scheduling...' : 'Schedule Interview'}
                    </button>
                </form>
            </div>

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className={`text-xl font-semibold mb-4 ${modal.success ? 'text-green-600' : 'text-red-600'}`}>
                            {modal.success ? 'Success' : 'Error'}
                        </h2>
                        <p className="mb-6">{modal.message}</p>
                        <button
                            onClick={handleModalClose}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleInterview;

