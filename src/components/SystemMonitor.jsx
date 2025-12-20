import { useEffect, useState, useRef } from "react";
import { listen } from "@tauri-apps/api/event"; // Invoke ki jagah Listen use hoga
import { cpuAlert } from "../utils.js";

export default function SystemMonitor() {
  const alerted = useRef(false);
  const [stats, setStats] = useState({
    cpu: 0,
    usedRam: 0,
    totalRam: 0,
    name: "",
    kernel: "",
    host: "",
    uptime: 0,
  });

  useEffect(() => {
    let unlisten;

    async function setupListener() {
      // Rust se aane wale "system-update" event ko pakadne ke liye
      unlisten = await listen("system-update", (event) => {
        // Rust ne payload mein (cpu, used, total, name, kernel, host, uptime) bheja hai
        const [cpu, used, total, name, kernel, host, uptime] = event.payload;

        const GB = 1024 * 1024 * 1024;

        // 1. Notification Logic
        cpuAlert(cpu, alerted);

        // 2. State Update
        setStats({
          cpu,
          usedRam: Number(used) / GB,
          totalRam: Number(total) / GB,
          uptime: uptime / 86400, // Seconds to Days
          name,
          kernel,
          host,
        });
      });
    }

    setupListener();

    // Cleanup: Jab component band ho, toh listener bhi hata do
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <div
      className="app-card"
      style={{
        width: "100%",
        maxWidth: "450px",
        minHeight: "480px",
        padding: "20px",
        backgroundColor: "#181717",
        borderRadius: "12px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        margin: "10px auto",
      }}
    >
      <h2 style={{ color: "#4caf50", margin: "0 0 10px 0" }}>
        💻 System Dashboard
      </h2>
      <hr style={{ border: "0.5px solid #333", marginBottom: "20px" }} />

      {/* OS Details */}
      <div style={{ marginBottom: "auto", fontSize: "14px", color: "#bbb" }}>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>OS Name:</strong> <span>{stats.name}</span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Kernel:</strong> <span>{stats.kernel}</span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Hostname:</strong> <span>{stats.host}</span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Uptime:</strong> <span>{stats.uptime.toFixed(2)} days</span>
        </p>
      </div>

      {/* Real-time Stats Bars */}
      <div
        style={{
          marginTop: "20px",
          background: "#222",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "0 0 5px 0" }}>🧠 CPU: {stats.cpu.toFixed(1)}%</p>
          <div
            style={{
              width: "100%",
              background: "#333",
              height: "8px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: `${stats.cpu}%`,
                background: stats.cpu > 80 ? "#f44336" : "#4caf50",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.5s",
              }}
            ></div>
          </div>
        </div>

        <div>
          <p style={{ margin: "0 0 5px 0" }}>
            💾 RAM: {stats.usedRam.toFixed(2)} / {stats.totalRam.toFixed(2)} GB
          </p>
          <div
            style={{
              width: "100%",
              background: "#333",
              height: "8px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: `${(stats.usedRam / stats.totalRam) * 100}%`,
                background: "#2196f3",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.5s",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
