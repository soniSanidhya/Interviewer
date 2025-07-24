import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const InterviewerLogin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
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
      navigate("/");
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
          className={`input-field ${formErrors[name] ? 'error' : ''}`}
        />
      </label>
      {formErrors[name] && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
          {formErrors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-gray-50)' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="card p-8">
          <h2 className="text-center text-3xl font-bold mb-6" style={{ color: 'var(--color-gray-900)' }}>
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
            <div className="text-center p-3 rounded-lg mb-4" style={{ 
              backgroundColor: 'var(--color-gray-50)', 
              color: 'var(--color-error)',
              border: `1px solid var(--color-error)`
            }}>
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full mb-4 disabled:opacity-70"
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
              className="cursor-pointer font-medium hover:underline transition-colors"
              style={{ color: 'var(--color-primary)' }}
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