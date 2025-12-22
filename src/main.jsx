import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SettingsPage from "./components/SettingsPage";
import CpuGraph from "./components/CpuGraph";
import ProcessList from "./components/ProcessList";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/cpu-graph" element={<CpuGraph />} />
        <Route path="/process" element={<ProcessList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
