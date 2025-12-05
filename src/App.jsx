import { useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

function App() {
  const [content, setContent] = useState(""); //File content
  const [filePath, setFilePath] = useState(""); //File path
  const [notifStatus, setNotifStatus] = useState("unknown"); //Notifications

  // Request notification permission on load
  async function ensureNotificationPermission() {
    try {
      let permissionGranted = await isPermissionGranted();
      console.log("Notification permission initially:", permissionGranted);

      // If not we need to request it
      if (!permissionGranted) {
        const permission = await requestPermission();
        console.log("Notification permission after request:", permission);
        permissionGranted = permission === "granted";
      }

      setNotifStatus(permissionGranted ? "granted" : "denied");
      return permissionGranted;
    } catch (err) {
      console.error("Error in handleNotification:", err);
    }
  }

  // Notification button handler
  async function handleNotify() {
    const ok = await ensureNotificationPermission();
    if (!ok) {
      alert("Notifications are not allowed on this system/app.");
      return;
    }

    await sendNotification({
      title: "Tauri Text Editor",
      body: "File editor ready, Varun!",
    });
  }

  // Open file
  async function handleOpenFile() {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [{ name: "Text File", extensions: ["txt"] }],
      });

      console.log("Selected from dialog:", selected);

      if (!selected) {
        alert("No file selected");
        return;
      }

      setFilePath(selected);

      const data = await readTextFile(selected);
      console.log("File content:", data);

      setContent(data);
    } catch (err) {
      console.error("Error in handleOpenFile:", err);
      alert("Error opening file: " + err);
    }
  }

  // Save file
  async function handleSaveFile() {
    try {
      let path = filePath;

      if (!path) {
        path = await save({
          filters: [{ name: "Text File", extensions: ["txt"] }],
        });

        console.log("Save dialog path:", path);

        if (!path) {
          alert("Save cancelled");
          return;
        }

        setFilePath(path);
      }

      await writeTextFile(path, content);
      alert("File saved successfully!");
    } catch (err) {
      console.error("Error in handleSaveFile:", err);
      alert("Error saving file: " + err);
    }
  }

  return (
    <div style={{ padding: 25 }}>
      <h1>Tauri Text Editor</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleOpenFile}>📂 Open File</button>
        <button onClick={handleSaveFile} style={{ marginLeft: 10 }}>
          💾 Save File
        </button>
      </div>

      <div style={{ fontSize: 12, color: "#666" }}>
        Current file: {filePath || "(new file)"}
      </div>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <button onClick={handleNotify}>🔔 Show Notification</button>
        <span style={{ marginLeft: 10, fontSize: 12 }}>
          Notification status: {notifStatus}
        </span>
      </div>

      <textarea
        style={{ width: "100%", height: "70vh", marginTop: 20 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

export default App;
