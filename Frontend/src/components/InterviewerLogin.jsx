import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const InterviewerLogin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "akshat",
    email: "",
    password: "akshat123",
    company: "",
    position: "",
    role: ""
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

    axios.post(`${BASE_URL}/getCurrentUser/`, {}, {
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
    <div className="mb-4">
      <label className="block w-full">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border ${
            formErrors[name] ? 'border-red-500' : 'border-gray-200'
          } bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
      </label>
      {formErrors[name] && (
        <p className="mt-1 text-sm text-red-500">{formErrors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
            {isLoginForm ? "Login" : "Sign Up"} to Interview Platform
          </h2>

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
            <p className="text-center p-3 rounded-lg bg-red-50 text-red-500 mb-4">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 mb-4"
          >
            {isSubmitting
              ? (isLoginForm ? "Logging in..." : "Signing up...")
              : (isLoginForm ? "Login" : "Sign Up")}
          </button>
          
          <p className="text-center mt-3">
            <span
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError("");
                setFormErrors({});
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
            >
              {isLoginForm ? "New User? Sign up here" : "Existing User? Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewerLogin;