import { useEffect, useState, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { cpuAlert, saveToDb } from "../utils.js";

export default function SystemMonitor() {
  const alerted = useRef(false);

  const [stats, setStats] = useState({
    cpu: 0,
    usedRam: 0,
    totalRam: 0,
    name: "Loading...",
    kernel: "Loading...",
    host: "Loading...",
    uptime: 0,
  });

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

        saveToDb(cpu);
      });
    }
    setupListener();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const ramPercentage = (stats.usedRam / stats.totalRam) * 100 || 0;

  return (
    <div className="system-monitor-wrapper">
      <style>{`
        .system-monitor-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0 15px;
          box-sizing: border-box;
        }

        .monitor-card {
          width: 95%;
          max-width: 800px;
          background: rgba(30, 30, 46, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
        }

        .monitor-header h2 {
          font-size: 18px;
          color: #a6e3a1; /* Green accent */
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-tag {
          font-size: 10px;
          background: rgba(243, 139, 168, 0.2);
          color: #f38ba8;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-box {
          background: rgba(0, 0, 0, 0.2);
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 13px;
          color: #cdd6f4;
          font-family: 'JetBrains Mono', monospace;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .progress-container {
          width: 100%;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          color: #cdd6f4;
        }

        .bar-bg {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .bar-fill {
          height: 100%;
          transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
        }

        .cpu-fill { background: linear-gradient(90deg, #a6e3a1, #94e2d5); }
        .ram-fill { background: linear-gradient(90deg, #89b4fa, #b4befe); }
        .danger-fill { background: linear-gradient(90deg, #f38ba8, #eba0ac) !important; }

      `}</style>

      <div className="monitor-card">
        <div className="monitor-header">
          <h2>System Monitor</h2>
          <span className="live-tag">Live Feed</span>
        </div>

        {/* System Details Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">OS Name</span>
            <span className="stat-value">{stats.name || "N/A"}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Hostname</span>
            <span className="stat-value">{stats.host || "N/A"}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Kernel</span>
            <span className="stat-value">{stats.kernel || "N/A"}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Uptime</span>
            <span className="stat-value">{stats.uptime.toFixed(2)} Days</span>
          </div>
        </div>

        {/* Usage Progress Bars */}
        <div className="progress-section">
          {/* CPU Usage */}
          <div className="progress-container">
            <div className="progress-info">
              <span>CPU Usage</span>
              <span style={{ color: stats.cpu > 80 ? "#f38ba8" : "#a6e3a1" }}>
                {stats.cpu.toFixed(1)}%
              </span>
            </div>
            <div className="bar-bg">
              <div
                className={`bar-fill cpu-fill ${
                  stats.cpu > 80 ? "danger-fill" : ""
                }`}
                style={{ width: `${stats.cpu}%` }}
              ></div>
            </div>
          </div>

          {/* RAM Usage */}
          <div className="progress-container">
            <div className="progress-info">
              <span>RAM Usage</span>
              <span>
                {stats.usedRam.toFixed(2)} / {stats.totalRam.toFixed(2)} GB
              </span>
            </div>
            <div className="bar-bg">
              <div
                className={`bar-fill ram-fill ${
                  ramPercentage > 90 ? "danger-fill" : ""
                }`}
                style={{ width: `${ramPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
