import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";
import WindowsControls from "./components/WindowsControls.jsx";

function App() {
  return (
    <div>
      {/* Top bar with window control buttons */}
      <WindowsControls />
      {/* Read, Write, Save And Open */}
      <ReadWriteOpenSave />
      {/* Notification */}
      <Notifications />
    </div>
  );
}

export default App;
