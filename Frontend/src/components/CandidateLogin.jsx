import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const CandidateLogin = () => {
    const [formData, setFormData] = useState({
        userName: "rishi",
        password: "rishi123"
    });
        
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [alreadyLogin, setAlreadyLogin] = useState(false);

    useEffect(() => {
        if (alreadyLogin) {
            navigate('/interview-dashboard', { replace: true });
        }

        axios.post(`${BASE_URL}/getCurrentUser/`, {}, { withCredentials: true })
            .then(response => {
                if (response.data.user?.type === "candidate") {
                    setAlreadyLogin(true);
                    navigate('/interview-dashboard', { replace: true });
                }
            })
            .catch(() => { });
    }, []);

    const validate = () => {
        const { userName, password } = formData;
        const errors = {};

        if (!userName.trim()) errors.userName = "Username is required";
        if (!password.trim()) errors.password = "Password is required";

        return errors;
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setFormErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/candidate-login`, formData, { withCredentials: true });
            dispatch(addUser(res.data));
            navigate("/interview-dashboard");
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    };

    const renderInput = (name, placeholder, type = "text") => (
        <div className="w-full mb-4">
            <label className="flex flex-col w-full">
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`input-field ${formErrors[name] ? 'error' : ''}`}
                />
            </label>
            {formErrors[name] && (
                <p className="text-sm mt-1 px-1" style={{ color: 'var(--color-error)' }}>
                    {formErrors[name]}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-gray-50)' }}>
            <div className="card w-full max-w-md p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--color-gray-900)' }}>
                        Candidate Login
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
                        Access your interview dashboard
                    </p>
                
                    <div className="w-full space-y-4 pt-4">
                        {renderInput("userName", "User Name")}
                        {renderInput("password", "Password", "password")}
                    </div>
            
                    {error && (
                        <p className="text-sm w-full text-left" style={{ color: 'var(--color-error)' }}>
                            {typeof error === "string" ? error : JSON.stringify(error)}
                        </p>
                    )}
            
                    <button
                        className="btn-primary w-full"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateLogin;
