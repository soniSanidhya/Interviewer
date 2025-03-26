import React, { useState } from 'react';
import axios from 'axios';
import { addUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const CandidateLogin = () => {
    const [fullName, setFullName] = useState("Donald Trump");
    const [userName, setUserName] = useState("donald123");
    const [email, setEmail] = useState("donald@trump.com");
    const [password, setPassword] = useState("DonaldTrump@123");
    const [error, setError] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            console.log(BASE_URL + "/candidate-signup");
            const res = await axios.post(BASE_URL + "/candidate-signup", {userName, fullName, email, password }, { withCredentials: true });
            console.log(res.data);
            dispatch(addUser(res?.data))
            return navigate("/")
        } catch (err) {
            setError(err?.response?.data)
        }
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post(BASE_URL + "/candidate-login", { userName, password }, { withCredentials: true });
            console.log(res.data);
            dispatch(addUser(res?.data))
            return navigate("/interview-dashboard")
        } catch (err) {
            setError(err?.response?.data)
        }
    };

    return (
        <div className="flex items-center justify-center px-4 md:px-0 my-16">
            <div className="card bg-neutral text-neutral-content w-full max-w-md p-6 shadow-xl">
                <div className="card-body items-center text-center gap-6">
                    <h2 className="card-title text-lg md:text-2xl">{!isLoginForm ? "Sign Up" : "Login"}</h2>
                    {!isLoginForm && (<><label className="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" className="grow"placeholder="Full Name"value={fullName}onChange={(e) => setFullName(e.target.value)}/>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" className="grow" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                    </label></>)}
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input type="text" className="grow" placeholder="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="input input-bordered flex items-center gap-2 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                            </svg>
                            <input type="password" placeholder="Password" className="grow" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="label flex justify-end">
                            <span className="label-text-alt hover:cursor-pointer" onClick={() => 
                              setIsLoginForm(!isLoginForm)}>
                                {!isLoginForm ? "Existing User? Login Here" : "New User? Signup Here"}
                            </span>
                        </div>
                    </label>
                    <p className="text-red-500">{typeof error === "string" ? error : JSON.stringify(error)}</p>
                    <div className="card-actions justify-end w-full gap-3">
                        <button className="btn btn-primary w-full" onClick={!isLoginForm ? handleSignUp : handleLogin}>{!isLoginForm ? "Sign Up" : "Login"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateLogin;
