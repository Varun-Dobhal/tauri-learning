import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { invoke } from "@tauri-apps/api/core";
import SystemMonitor from "./components/SystemMonitor.jsx";
import TitleBar from "./components/TitleBar.jsx";
import SystemInfo from "./components/SystemInfo.jsx";
import AutostartToggle from "./components/AutostartToggle.jsx";
import Notifications from "./components/Notifications.jsx";
import Clipboard from "./components/Clipboard.jsx";

export default function App() {
  // Auto update check
  useEffect(() => {
    // Update check karne wala function
    const checkForUpdates = async () => {
      try {
        const update = await check();
        if (update?.available) {
          // Seedha download aur install (Bina user ko pareshan kiye background mein)
          await update.downloadAndInstall();

          // App restart taaki naya version apply ho jaye
          await relaunch();
        }
      } catch (error) {
        console.error("Update check fail ho gaya:", error);
      }
    };

    checkForUpdates();
  }, []);

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
