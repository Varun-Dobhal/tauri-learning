import { useEffect, useState } from "react";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

export default function AutostartToggle() {
  const [isAutoStart, setIsAutoStart] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. App load hote hi status check karein
  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await isEnabled();
        setIsAutoStart(status);
      } catch (err) {
        console.error("Autostart status check failed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  // 2. Button click handle karne ke liye function
  const toggleAutostart = async () => {
    try {
      if (isAutoStart) {
        await disable(); // Agar pehle se on hai toh off kar do
        console.log("Autostart Disabled");
      } else {
        await enable(); // Agar off hai toh on kar do
        console.log("Autostart Enabled");
      }

      // State update karein taki UI badal jaye
      setIsAutoStart(!isAutoStart);
    } catch (err) {
      alert("Error: Permissions missing or plugin not configured!");
      console.error(err);
    }
  };

  if (loading) return <p>Checking settings...</p>;

  return (
    <div
      className="settings-card"
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>🚀 Startup Settings</h3>
      <p>App will start automatically when you turn on your PC.</p>

      <button
        onClick={toggleAutostart}
        style={{
          padding: "10px 20px",
          backgroundColor: isAutoStart ? "#ff4d4d" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {isAutoStart ? "Disable Autostart" : "Enable Autostart"}
      </button>

      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        Current Status: <strong>{isAutoStart ? "ON" : "OFF"}</strong>
      </p>
    </div>
  );
}
