import React, { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import SystemMonitor from "./components/SystemMonitor.jsx";
import TitleBar from "./components/TitleBar.jsx";
import SystemInfo from "./components/SystemInfo.jsx";
import AutostartToggle from "./components/AutostartToggle.jsx";
import Notifications from "./components/Notifications.jsx";
import Clipboard from "./components/Clipboard.jsx";

export default function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        await invoke("close_splashscreen");
      } catch (e) {
        console.error("Failed to close splashscreen:", e);
      }
    };
    initApp();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TitleBar title="Tauri App Learning" />

      <div className="app-root">
        <AutostartToggle />
        <Notifications />
        <SystemInfo />
        <SystemMonitor />
        <Clipboard />
      </div>
    </div>
  );
}
