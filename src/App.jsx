import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";
import WindowControls from "./components/WindowControls";

function App() {
  return (
    <div>
      {/* Top bar with window control buttons */}
      <WindowControls />
      {/* Read, Write, Save And Open */}
      <ReadWriteOpenSave />
      {/* Notification */}
      <Notifications />
    </div>
  );
}

export default App;
