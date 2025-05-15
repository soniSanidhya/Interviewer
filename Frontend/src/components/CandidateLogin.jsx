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
                {/* <span className="text-sm text-slate-600 mb-1">{placeholder}</span> */}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white text-slate-800"
                />
            </label>
            {formErrors[name] && (
                <p className="text-red-500 text-sm mt-1 px-1">{formErrors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
            <div className="bg-white border border-[#E5E7EB] w-full max-w-md rounded-2xl shadow-lg p-8 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-bold text-[#111827]">Candidate Login</h2>
                    <p className="text-[#6B7280] text-sm">Access your interview dashboard</p>
                
                    <div className="w-full space-y-4 pt-4">
                        {renderInput("userName", "User Name")}
                        {renderInput("password", "Password", "password")}
                    </div>
            
                    {error && (
                        <p className="text-[#EF4444] text-sm w-full text-left">
                            {typeof error === "string" ? error : JSON.stringify(error)}
                        </p>
                    )}
            
                    <button
                        className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1E40AF] active:scale-98 transition-all duration-200 rounded-lg font-medium text-white tracking-wide shadow-sm"
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
