import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const InterviewerLogin = () => {
    const [formData, setFormData] = useState({
        fullName: "Donald Trump",
        userName: "akshat",
        email: "donald@trump.com",
        password: "akshat123",
        company: "Trump Organization",
        position: "CEO",
        role: "Founder"
    });

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadyLogin, setAlreadyLogin] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (alreadyLogin) {
            navigate('/interview-dashboard', { replace: true });
        }

        axios.post(`${BASE_URL}/getCurrentUser`, {}, {
            withCredentials: true
        })
            .then(response => {
                if (response.data.user?.type === "interviewer") {
                    setAlreadyLogin(true);
                    navigate('/interview-dashboard', { replace: true });
                }
            })
            .catch(() => { });
    }, []);

    const validate = () => {
        const errors = {};
        const { fullName, userName, email, password, company, position, role } = formData;

        if (!userName.trim()) errors.userName = "Username is required";
        if (!password.trim()) errors.password = "Password is required";

        if (!isLoginForm) {
            if (!fullName.trim()) errors.fullName = "Full name is required";
            if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid email is required";
            if (password.length < 6) errors.password = "Password must be at least 6 characters";
            if (!company.trim()) errors.company = "Company name is required";
            if (!position.trim()) errors.position = "Position is required";
            if (!role.trim()) errors.role = "Role is required";
        }

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
            setIsSubmitting(true);
            const endpoint = isLoginForm ? "/interviewer-login" : "/interviewer-signup";
            const payload = isLoginForm
                ? { userName: formData.userName, password: formData.password }
                : formData;

            const res = await axios.post(`${BASE_URL}${endpoint}`, payload, { withCredentials: true });
            dispatch(addUser(res.data));
            navigate("/interview-dashboard");
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInput = (name, placeholder, type = "text") => (
        <div className="w-full relative">
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
        <div className="flex items-center justify-center px-4 md:px-0 my-16">
            <div className="card bg-neutral text-neutral-content w-full max-w-md p-6 shadow-xl">
                <div className="card-body items-center text-center gap-6">
                    <h2 className="card-title text-lg md:text-2xl">{isLoginForm ? "Login" : "Sign Up"}</h2>

                    {!isLoginForm && (
                        <>
                            {renderInput("fullName", "Full Name")}
                            {renderInput("email", "Email")}
                            {renderInput("company", "Company")}
                            {renderInput("position", "Position")}
                            {renderInput("role", "Role")}
                        </>
                    )}

                    {renderInput("userName", "User Name")}
                    {renderInput("password", "Password", "password")}

                    {error && (
                        <p className="text-red-500 text-sm text-center">{typeof error === "string" ? error : JSON.stringify(error)}</p>
                    )}

                    <span
                        className="label-text-alt hover:cursor-pointer underline"
                        onClick={() => {
                            setIsLoginForm(!isLoginForm);
                            setError("");
                            setFormErrors({});
                        }}
                    >
                        {isLoginForm ? "New User? Signup Here" : "Existing User? Login Here"}
                    </span>

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? (isLoginForm ? "Logging in..." : "Signing up...")
                            : (isLoginForm ? "Login" : "Sign Up")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewerLogin;
