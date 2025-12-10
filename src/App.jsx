import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";
import TitleBar from "./components/TitleBar.jsx";

function App() {
  return (
    <div>
      {/* Title Bar */}
      <TitleBar title="Tauri App Learning" />
      {/* Read, Write, Save And Open */}
      <ReadWriteOpenSave />

      {/* Notification */}
      <Notifications />
    </div>
  );
}

export default App;
