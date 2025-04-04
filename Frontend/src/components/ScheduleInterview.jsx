import React, { useState } from 'react';

function ScheduleInterview() {
    const [formData, setFormData] = useState({
        interviewerUserName: 'akshat',
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
        try {
            const response = await fetch('http://localhost:5000/api/schedule-interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log('Response:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Schedule Interview</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Interviewer Username:
                    <input
                        type="text"
                        name="interviewerUserName"
                        value={formData.interviewerUserName}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Candidate Username:
                    <input
                        type="text"
                        name="candidateUserName"
                        value={formData.candidateUserName}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Time:
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Duration (minutes):
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Time Zone:
                    <input
                        type="text"
                        name="timeZone"
                        value={formData.timeZone}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Interview Type:
                    <input
                        type="text"
                        name="interviewType"
                        value={formData.interviewType}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Evaluation Form ID:
                    <input
                        type="text"
                        name="evaluationFormId"
                        value={formData.evaluationFormId}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Schedule Interview</button>
            </form>
        </div>
    );
}

export default ScheduleInterview;
