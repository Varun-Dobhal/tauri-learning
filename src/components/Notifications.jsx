import { useState, useEffect } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export default function Notifications() {
  const [notifStatus, setNotifStatus] = useState("unknown");

  // Load initial status
  useEffect(() => {
    async function checkInit() {
      const granted = await isPermissionGranted();
      setNotifStatus(granted ? "granted" : "unknown");
    }
    checkInit();
  }, []);

  async function ensureNotificationPermission() {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      setNotifStatus(permissionGranted ? "granted" : "denied");
      return permissionGranted;
    } catch (err) {
      console.error("Notification Error:", err);
      setNotifStatus("error");
    }
  }

  async function handleNotify() {
    const ok = await ensureNotificationPermission();
    if (!ok) {
      alert("Please enable notifications in your system settings.");
      return;
    }

    sendNotification({
      title: "Tauri Text Editor",
      body: "System notifications are now active! 🚀",
    });
  }

  return (
    <div className="notif-wrapper">
      <style>{`
        .notif-wrapper {
          display: flex;
          justify-content: center;
          padding: 10px 15px;
          width: 100%;
          box-sizing: border-box;
        }

        .notif-card {
          width: 95%;
          max-width: 800px;
          background: rgba(30, 30, 46, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .notif-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notif-icon-circle {
          width: 40px;
          height: 40px;
          background: rgba(137, 180, 250, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .notif-text h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #f1f1f1;
        }

        .status-container {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }

        .status-dot-small {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        /* Dynamic Status Colors */
        .status-granted { color: #a6e3a1; }
        .bg-granted { background-color: #a6e3a1; box-shadow: 0 0 8px #a6e3a1; }
        
        .status-denied { color: #f38ba8; }
        .bg-denied { background-color: #f38ba8; }

        .status-unknown { color: #f9e2af; }
        .bg-unknown { background-color: #f9e2af; }

        .notif-btn {
          background: #89b4fa;
          color: #11111b;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notif-btn:hover {
          background: #b4befe;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(137, 180, 250, 0.3);
        }

        .notif-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="notif-card">
        <div className="notif-info">
          <div className="notif-icon-circle">🔔</div>
          <div className="notif-text">
            <h4>Push Notifications</h4>
            <div className="status-container">
              <div className={`status-dot-small bg-${notifStatus}`}></div>
              <span className={`status-label status-${notifStatus}`}>
                {notifStatus === "granted"
                  ? "Service Active"
                  : `Status: ${notifStatus}`}
              </span>
            </div>
          </div>
        </div>

        <button className="notif-btn" onClick={handleNotify}>
          Test System Ping
        </button>
      </div>
    </div>
  );
}
