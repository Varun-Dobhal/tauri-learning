import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import TitleBar from "./TitleBar";

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
    const interval = setInterval(refreshList, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px", // SystemMonitor se match karne ke liye
        margin: "20px auto", // Screen ke center mein lane ke liye
        marginTop: "50px",
        backgroundColor: "#181717",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
      }}
    >
      <TitleBar title="Process List" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3 style={{ color: "#4caf50", margin: 0 }}>Top Processes</h3>
        <span style={{ fontSize: "12px", color: "#666" }}>
          Auto-refresh: 5s
        </span>
      </div>

      <hr style={{ border: "0.5px solid #333", marginBottom: "15px" }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
          <p>Analyzing system tasks...</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {/* Table Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 10px",
              fontSize: "12px",
              color: "#888",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: "150px" }}>Process</span>
            <span style={{ width: "80px", textAlign: "right" }}>CPU</span>
            <span style={{ width: "80px", textAlign: "right" }}>Memory</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {list.slice(0, 10).map(([pid, name, cpu, mem]) => (
              <li
                key={pid}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: "#222",
                  borderRadius: "6px",
                  marginBottom: "5px",
                  fontSize: "14px",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2a2a2a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#222")
                }
              >
                {/* Process Name with PID */}
                <span
                  style={{
                    width: "150px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: "500",
                  }}
                >
                  {name}{" "}
                  <span style={{ fontSize: "10px", color: "#555" }}>
                    ({pid})
                  </span>
                </span>

                {/* CPU Usage with Color Logic */}
                <span
                  style={{
                    width: "80px",
                    textAlign: "right",
                    color: cpu > 20 ? "#ff4d4d" : "#4caf50",
                    fontWeight: "bold",
                  }}
                >
                  {cpu.toFixed(1)}%
                </span>

                {/* Memory in MB */}
                <span
                  style={{
                    width: "80px",
                    textAlign: "right",
                    color: "#2196f3",
                  }}
                >
                  {(Number(mem) / (1024 * 1024)).toFixed(0)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
