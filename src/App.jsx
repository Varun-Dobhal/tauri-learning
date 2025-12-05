import Notifications from "./components/Notifications.jsx";
import ReadWriteOpenSave from "./components/ReadWriteOpenSave.jsx";

function App() {
  return (
    <div>
      {/* Read, Write, Save And Open */}
      <ReadWriteOpenSave />
      {/* Notification */}
      <Notifications />
    </div>
  );
}

export default App;
