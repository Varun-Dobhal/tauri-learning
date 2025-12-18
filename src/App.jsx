import { useState } from "react";
import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";
import TitleBar from "./components/TitleBar.jsx";
import Clipboard from "./components/Clipboard.jsx";
import SystemInfo from "./components/SystemInfo.jsx";
import AutostartToggle from "./components/AutostartToggle.jsx";
import SystemMonitor from "./components/SystemMonitor.jsx";
import ProcessList from "./components/ProcessList.jsx";

function App() {
  const [content, setContent] = useState(""); // editor text
  const [filePath, setFilePath] = useState(""); // current file path
  const [unsaved, setUnsaved] = useState(false); // unsaved flag
  const [status, setStatus] = useState("Ready"); // small status message

  return (
    <div className="app-root">
      {/* System Monitor */}
      <SystemMonitor />

      {/* System Processes */}
      <ProcessList />

      {/* Autostart Toggle */}
      <AutostartToggle />

      {/* Title Bar */}
      <TitleBar title="Tauri App Learning" />

      {/* System Info */}
      <SystemInfo />

      {/* Read, Write, Save And Open */}
      <ReadWriteOpenSave
        content={content}
        setContent={setContent}
        filePath={filePath}
        setFilePath={setFilePath}
        setUnsaved={setUnsaved}
        setStatus={setStatus}
      />

      {/* Clipboard + main editor */}
      <Clipboard
        content={content}
        setContent={setContent}
        unsaved={unsaved}
        setUnsaved={setUnsaved}
        status={status}
        setStatus={setStatus}
      />

      {/* Notification (as is) */}
      <Notifications />
    </div>
  );
}

export default App;
