import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSetting, fetchHistory, changeColor } from "../utils.js";
import TitleBar from "./TitleBar"; // Drag karne ke liye TitleBar zaruri hai

export default function CpuGraph() {
  const [history, setHistory] = useState([]);
  const [themeColor, setThemeColor] = useState("#4caf50");

  // 1. LIVE DATA LISTENER (Rust se direct data pakadne ke liye)
  useEffect(() => {
    let unlisten;
    async function setupListener() {
      // Rust ka 'system-update' event listen kar rahe hain
      unlisten = await listen("system-update", (event) => {
        const cpuUsage = event.payload[0]; // Payload mein pehla index CPU hai

        setHistory((prev) => {
          const newPoint = {
            time: new Date().toLocaleTimeString().split(" ")[0], // Sirf HH:MM:SS
            usage: parseFloat(cpuUsage.toFixed(1)),
          };

          // Sirf aakhri 20 points dikhao taaki graph ganda na dikhe
          const newHistory = [...prev, newPoint];
          return newHistory.length > 20 ? newHistory.slice(1) : newHistory;
        });
      });
    }

    setupListener();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // 2. THEME LISTENER (Settings window se color change ke liye)
  useEffect(() => {
    let unlistenTheme;
    const setupTheme = async () => {
      unlistenTheme = await listen("theme-updated", (event) => {
        setThemeColor(event.payload);
      });
    };
    setupTheme();
    return () => {
      if (unlistenTheme) unlistenTheme();
    };
  }, []);

  // 3. LOAD SAVED SETTINGS (Jab window pehli baar khule)
  useEffect(() => {
    const init = async () => {
      const savedColor = await getSetting("color");
      if (savedColor) setThemeColor(savedColor);

      // Database se puraana data load karo (Optional)
      const oldData = await fetchHistory();
      if (oldData) setHistory(oldData.slice(-20));
    };
    init();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        color: "white",
        marginTop: "30px",
      }}
    >
      {/* Nayi window mein bhi TitleBar hona chahiye taaki drag ho sake */}
      <TitleBar title="Live CPU Usage Analytics" />

      <div style={{ padding: "20px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#181717",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h2 style={{ fontSize: "16px", marginBottom: "20px", color: "#888" }}>
            Real-time Performance Metrics
          </h2>

          <div
            style={{
              width: "100%",
              height: 250,
              backgroundColor: "#000",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#222"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#555"
                  fontSize={10}
                  tickMargin={10}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#555"
                  fontSize={10}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: themeColor }}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke={themeColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false} // Performance ke liye isse false rakho
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Theme Toggle Inside Graph Window */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => changeColor("#2196f3")}
              style={btnStyle("#2196f3")}
            >
              Blue
            </button>
            <button
              onClick={() => changeColor("#4caf50")}
              style={btnStyle("#4caf50")}
            >
              Green
            </button>
            <button
              onClick={() => changeColor("#f44336")}
              style={btnStyle("#f44336")}
            >
              Red
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple dynamic button style
const btnStyle = (color) => ({
  backgroundColor: "transparent",
  border: `1px solid ${color}`,
  color: color,
  padding: "5px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "12px",
  transition: "0.3s",
});
