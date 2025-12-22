import SystemMonitor from "./components/SystemMonitor.jsx";
import TitleBar from "./components/TitleBar.jsx";
import SystemInfo from "./components/SystemInfo.jsx";
import AutostartToggle from "./components/AutostartToggle.jsx";
import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";
import Clipboard from "./components/Clipboard.jsx";

export default function App() {
  return (
    <div className="app-root" style={{ padding: "20px" }}>
      <TitleBar title="Tauri App Learning" />
      <SystemMonitor />
      <AutostartToggle />
      <ReadWriteOpenSave />
      <Clipboard />
      <SystemInfo />
      <Notifications />
    </div>
  );
}
