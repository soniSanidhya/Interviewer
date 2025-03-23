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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            {/* <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
