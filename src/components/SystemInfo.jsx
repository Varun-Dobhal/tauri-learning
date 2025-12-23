import { useEffect, useState } from "react";
import { platform, arch, version } from "@tauri-apps/plugin-os";
import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";

export default function SystemInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function loadInfo() {
      try {
        const data = {
          os: await platform(),
          osVersion: await version(),
          arch: await arch(),
          appName: await getName(),
          appVersion: await getVersion(),
          tauriVersion: await getTauriVersion(),
        };
        setInfo(data);
      } catch (err) {
        console.error("SystemInfo error:", err);
      }
    }
    loadInfo();
  }, []);

  if (!info) return null;

  return (
    <div className="system-wrapper">
      <style>{`
        .system-wrapper {
          display: flex;
          justify-content: center;
          padding: 10px 15px 30px 15px;
          width: 100%;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .system-card {
          width: 95%;
          max-width: 800px;
          background: rgba(30, 30, 46, 0.6);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .system-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 15px;
        }

        .system-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #f1f1f1;
          letter-spacing: -0.5px;
        }

        .chip {
          background: rgba(137, 180, 250, 0.15);
          color: #89b4fa;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 14px;
          border-radius: 12px;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .info-item:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-3px);
          border-color: rgba(137, 180, 250, 0.3);
        }

        .info-label {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .info-value {
          display: block;
          font-size: 14px;
          color: #cdd6f4;
          font-weight: 500;
          font-family: 'JetBrains Mono', monospace;
        }

        .icon-box {
          margin-right: 8px;
          opacity: 0.8;
        }
      `}</style>

      <div className="system-card">
        <div className="system-header">
          <h2>System Diagnostics</h2>
          <span className="chip">Hardware Verified</span>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">🖥 Operating System</span>
            <span className="info-value">
              {info.os} ({info.osVersion})
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">⚙ Architecture</span>
            <span className="info-value">{info.arch}</span>
          </div>

          <div className="info-item">
            <span className="info-label">📛 Application Name</span>
            <span className="info-value">{info.appName}</span>
          </div>

          <div className="info-item">
            <span className="info-label">🔢 App Version</span>
            <span className="info-value">v{info.appVersion}</span>
          </div>

          <div className="info-item">
            <span className="info-label">🦀 Tauri Framework</span>
            <span className="info-value">{info.tauriVersion}</span>
          </div>

          <div className="info-item">
            <span className="info-label">⚡ Status</span>
            <span className="info-value" style={{ color: "#a6e3a1" }}>
              ● Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
