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
        <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    className="grow"
                />
            </label>
            {formErrors[name] && (
                <p className="text-red-400 text-sm mt-1 px-1">{formErrors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="backdrop-blur-lg bg-gray-800/80 border border-gray-700 text-white w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
                <h2 className="text-3xl font-bold text-white">Candidate Login</h2>
                <p className="text-gray-400 text-sm">Access your interview dashboard</p>
    
                {renderInput("userName", "User Name")}
                {renderInput("password", "Password", "password")}
    
                {error && (
                    <p className="text-red-400 text-sm -mt-2">
                        {typeof error === "string" ? error : JSON.stringify(error)}
                    </p>
                )}
    
                <button
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 rounded-lg font-medium text-white tracking-wide"
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
