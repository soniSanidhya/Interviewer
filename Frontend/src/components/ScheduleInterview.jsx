import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

function ScheduleInterview() {
    const [interviewerName, setInterviewerName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.post(`${BASE_URL}/getCurrentUser/`, {}, { withCredentials: true })
            .then(response => {
                if (response.data.user.type === 'interviewer') {
                    setInterviewerName(response.data.user.userName);
                }
            })
            .catch(error => console.error("Error fetching current user:", error));
    }, []);

    const [formData, setFormData] = useState({
        interviewerUserName: '',
        candidateUserName: 'rishi',
        date: '2025-04-04',
        time: '11:21',
        duration: 10,
        timeZone: 'Asia/Kolkata',
        interviewType: 'technical',
        evaluationFormId: '67b9620cc8a248c32d65e249',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const response = await fetch(`${BASE_URL}/schedule-interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("Interview scheduled successfully!");
            } else {
                setErrorMessage(result.message || "Failed to schedule interview.");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("Network error. Please try again.");
        }
    };

    useEffect(() => {
        setFormData(prev => ({ ...prev, interviewerUserName: interviewerName }));
    }, [interviewerName]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                <h1 className="text-3xl font-semibold text-indigo-700 mb-8 text-center">Schedule Interview</h1>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Input Component */}
                    {[
                        { label: "Interviewer Username", name: "interviewerUserName", readOnly: true, value: formData.interviewerUserName },
                        { label: "Candidate Username", name: "candidateUserName", value: formData.candidateUserName },
                        { label: "Interview Type", name: "interviewType", value: formData.interviewType },
                        { label: "Time Zone", name: "timeZone", value: formData.timeZone },
                        { label: "Evaluation Form ID", name: "evaluationFormId", value: formData.evaluationFormId },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                type="text"
                                name={field.name}
                                value={field.value}
                                onChange={handleChange}
                                readOnly={field.readOnly}
                                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    ))}

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Feedback Messages */}
                    {successMessage && (
                        <p className="text-green-600 text-sm text-center">{successMessage}</p>
                    )}
                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-all duration-200"
                    >
                        Schedule Interview
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ScheduleInterview;
