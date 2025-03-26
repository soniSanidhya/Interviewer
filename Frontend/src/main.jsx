import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewPortalLogin from "./components/InterviewPortalLogin.jsx";
import { store } from "./app/store.js";
import Body from "./components/Body.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import CandidateLogin from "./components/CandidateLogin.jsx";
import Profile from "./components/Profile.jsx";
import InterviewerLogin from "./components/InterviewerLogin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/candidate-signup" element={<CandidateLogin/>}/>
            <Route path="/interviewer-signup" element={<InterviewerLogin/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
