import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function ProcessList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshList = async () => {
    try {
      const data = await invoke("get_processes");
      setList(data);
      setLoading(false);
    } catch (err) {
      console.error("Process fetch failed:", err);
    }
  };

  useEffect(() => {
    refreshList();
    // Processes heavy hote hain, isliye 5 second mein ek baar refresh thik hai
    const interval = setInterval(refreshList, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="app-card"
      style={{ padding: "15px", background: "#1e1e1e", borderRadius: "10px" }}
    >
      <h3 style={{ color: "#fff" }}>🔥 Top Processes</h3>
      {loading ? (
        <p>Analyzing tasks...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {/* Top 10 heavy processes */}
          {list.slice(0, 10).map(([pid, name, cpu, mem]) => (
            <li
              key={pid}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #333",
                color: "#ccc",
                fontSize: "14px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  width: "120px",
                  overflow: "hidden",
                }}
              >
                {name}
              </span>
              <span style={{ color: cpu > 20 ? "#ff4d4d" : "#4caf50" }}>
                {cpu.toFixed(1)}% CPU
              </span>
              <span>{(Number(mem) / (1024 * 1024)).toFixed(0)} MB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
