import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { listen } from "@tauri-apps/api/event";
import { cpuAlert } from "../utils.js";
import Database from "@tauri-apps/plugin-sql";

// Database Logic
const saveToDb = async (cpuValue) => {
  const db = await Database.load("sqlite:stats.db");
  await db.execute(
    "CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, cpu REAL, time DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  await db.execute("INSERT INTO logs (cpu) VALUES ($1)", [cpuValue]);
  console.log("Data Saved in SQLite!");
};

const fetchHistory = async () => {
  const db = await Database.load("sqlite:stats.db");
  const result = await db.select(
    "SELECT cpu as usage, time FROM logs ORDER BY id DESC LIMIT 20"
  );
  return result.reverse();
};

export default function SystemMonitor() {
  const alerted = useRef(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    cpu: 0,
    usedRam: 0,
    totalRam: 0,
    name: "",
    kernel: "",
    host: "",
    uptime: 0,
  });

  // 1. Listener for Rust Events
  useEffect(() => {
    let unlisten;
    async function setupListener() {
      unlisten = await listen("system-update", (event) => {
        const [cpu, used, total, name, kernel, host, uptime] = event.payload;
        const GB = 1024 * 1024 * 1024;

        cpuAlert(cpu, alerted);

        setStats({
          cpu,
          usedRam: Number(used) / GB,
          totalRam: Number(total) / GB,
          uptime: uptime / 86400,
          name,
          kernel,
          host,
        });

        saveToDb(cpu); // DB mein save kar rahe hain
      });
    }
    setupListener();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // 2. Polling for Database History
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchHistory();
      setHistory(data);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Dashboard Card */}
      <div
        className="app-card"
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "20px",
          backgroundColor: "#181717",
          borderRadius: "12px",
          color: "white",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#4caf50", margin: "0 0 10px 0" }}>
          💻 System Dashboard
        </h2>
        <hr style={{ border: "0.5px solid #333", marginBottom: "20px" }} />

        {/* OS Details */}
        <div style={{ fontSize: "14px", color: "#bbb", marginBottom: "20px" }}>
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

        {/* Progress Bars */}
        <div
          style={{ background: "#222", padding: "15px", borderRadius: "8px" }}
        >
          <div style={{ marginBottom: "15px" }}>
            <p style={{ margin: "0 0 5px 0" }}>
              🧠 CPU: {stats.cpu.toFixed(1)}%
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
                  width: `${stats.cpu}%`,
                  background: stats.cpu > 80 ? "#f44336" : "#4caf50",
                  height: "100%",
                  borderRadius: "4px",
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 5px 0" }}>
              💾 RAM: {stats.usedRam.toFixed(2)} / {stats.totalRam.toFixed(2)}{" "}
              GB
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Graph Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#181717",
          borderRadius: "12px",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
          📈 CPU Usage History
        </h2>
        <div
          style={{
            width: "100%",
            height: 200,
            backgroundColor: "#222",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#4caf50"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
