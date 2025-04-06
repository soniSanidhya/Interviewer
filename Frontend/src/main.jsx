import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { store } from "./app/store.js";
import Body from "./components/Body.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import CandidateLogin from "./components/CandidateLogin.jsx";
import Profile from "./components/Profile.jsx";
import InterviewerLogin from "./components/InterviewerLogin";
import InterviewDashBoard from "./components/InterviewDashBoard";
import Lobby from "./components/Lobby";
import RoomInterviewer from "./components/RoomInterviewer";
import RoomCandidate from "./components/RoomCandidate";
import RoomPage from "./components/InterviewComponents/RoomPage";
import CandidateRoom from "./components/InterviewComponents/CandidateRoom";

createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/candidate-signup" element={<CandidateLogin/>}/>
            <Route path="/interviewer-signup" element={<InterviewerLogin/>}/>
            <Route path="/interview-dashboard" element={<InterviewDashBoard/>}/>
            <Route path="/lobby/:interviewID" element={<Lobby />} />
            <Route path="/room/:roomId" element={<RoomCandidate/>} />
            <Route path="/room/i/:roomId" element={<RoomPage />} />
            <Route path="/room/c/:roomId" element={<CandidateRoom />} />
        </Routes>
      </BrowserRouter>
    </Provider>

);
