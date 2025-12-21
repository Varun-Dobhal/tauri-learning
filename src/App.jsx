import { invoke } from "@tauri-apps/api/core"; // Tauri v2 mein 'core' use hota hai
import SystemMonitor from "./components/SystemMonitor.jsx";
import ProcessList from "./components/ProcessList.jsx";
import TitleBar from "./components/TitleBar.jsx";
import SystemInfo from "./components/SystemInfo.jsx";
import AutostartToggle from "./components/AutostartToggle.jsx";
import Notifications from "./components/Notifications.jsx";

export default function App() {
  const openSettings = async () => {
    try {
      console.log("Rust command calling...");
      await invoke("open_settings_window");
    } catch (error) {
      console.error("Window open error:", error);
    }
  };

  return (
    <div className="app-root" style={{ padding: "20px" }}>
      <TitleBar title="Tauri App Learning" />

      <button
        onClick={openSettings}
        style={{
          margin: "15px 0",
          padding: "10px 20px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ⚙️ Settings Window
      </button>

      <SystemMonitor />
      <ProcessList />
      <AutostartToggle />
      <SystemInfo />
      <Notifications />
    </div>
  );
}
