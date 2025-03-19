import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import InterviewPortalLogin from "./components/InterviewPortalLogin.jsx";
import { store } from "./app/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path="/:token" element={<InterviewPortalLogin />} /></>)
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
