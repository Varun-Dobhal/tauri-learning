import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ask } from "@tauri-apps/plugin-dialog";
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
    const handleUpdates = async () => {
      try {
        const update = await check();

        if (update) {
          // Ek sundar sa popup
          const confirmUpdate = await ask(
            `New version ${update.version} taiyaar hai! Kya aap abhi install karna chahte hain Bolo Bolo?`,
            {
              title: "Software Update found!",
              kind: "info",
              okLabel: "Yes Do it Baby!",
              cancelLabel: "Baad mein",
            }
          );

          if (confirmUpdate) {
            console.log("Download shuru ho raha hai...");
            await update.downloadAndInstall();
            await relaunch();
          }
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    };

    handleUpdates();
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
      <TitleBar title="System Monitor" />

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
