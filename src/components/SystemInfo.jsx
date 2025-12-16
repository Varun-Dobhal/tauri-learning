import { useEffect, useState } from "react";
import { platform, arch, version } from "@tauri-apps/plugin-os";
import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";

export default function SystemInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function loadInfo() {
      const data = {
        os: await platform(),
        osVersion: await version(),
        arch: await arch(),
        appName: await getName(),
        appVersion: await getVersion(),
        tauriVersion: await getTauriVersion(),
      };

      setInfo(data);
    }

    loadInfo();
  }, []);

  if (!info) return <p>Loading system info...</p>;

  return (
    <div className="app-card">
      <h2 className="app-heading">System Information</h2>

      <ul className="app-grid-list">
        <li>🖥 OS: {info.os}</li>
        <li>📦 OS Version: {info.osVersion}</li>
        <li>⚙ Architecture: {info.arch}</li>
        <li>📛 App Name: {info.appName}</li>
        <li>🔢 App Version: {info.appVersion}</li>
        <li>🦀 Tauri Version: {info.tauriVersion}</li>
      </ul>
    </div>
  );
}
