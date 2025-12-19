import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
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

  const loadStats = async () => {
    try {
      // Destructure 7 values from the tuple
      const [cpu, used, total, name, kernel, host, uptime] = await invoke(
        "get_system_stats"
      );
      const GB = 1024 * 1024 * 1024;

      // 2. Notification Logic
      await cpuAlert(cpu, alerted);

      setStats({
        cpu,
        usedRam: Number(used) / GB,
        totalRam: Number(total) / GB,
        uptime: uptime / 86400, // convert seconds to days
        name,
        kernel,
        host,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#181717ff",
        borderRadius: "10px",
      }}
    >
      <h2>💻 System Dashboard</h2>
      <hr />

      {/* Nayi Details Section */}
      <div
        style={{ marginBottom: "20px", fontSize: "14px", color: "#bbb6b6ff" }}
      >
        <p>
          <strong>OS Name:</strong> {stats.name}
        </p>
        <p>
          <strong>Kernel:</strong> {stats.kernel}
        </p>
        <p>
          <strong>Hostname:</strong> {stats.host}
        </p>
      </div>

      {/* Stats Section */}
      <div>
        <p>🧠 CPU Usage: {stats.cpu.toFixed(1)}%</p>
        <p>
          💾 RAM: {stats.usedRam.toFixed(2)} GB / {stats.totalRam.toFixed(2)} GB
        </p>
        <p>⏱ Uptime: {stats.uptime.toFixed(2)} days</p>
      </div>
    </div>
  );
}
