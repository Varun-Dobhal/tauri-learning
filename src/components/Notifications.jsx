import { useState } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export default function Notifications() {
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

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <button onClick={handleNotify}>🔔 Show Notification</button>
      <span style={{ marginLeft: 10, fontSize: 12 }}>
        Notification status: {notifStatus}
      </span>
    </div>
  );
}
