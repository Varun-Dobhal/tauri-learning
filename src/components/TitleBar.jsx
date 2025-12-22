import { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Rust command call karne ke liye
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Settings, Cpu, Anchor, Cog } from "lucide-react";

const appWindow = getCurrentWindow();

export default function TitleBar({ title = "My Desktop Application" }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  // CpuGraph Window Command
  const openCpuGraph = async (e) => {
    e.stopPropagation(); // Window drag ko rokne ke liye
    try {
      await invoke("open_cpu_graph_window");
    } catch (error) {
      console.error("Window open error:", error);
    }
  };

  // Process List Window Command
  const openProcessList = async (e) => {
    e.stopPropagation(); // Window drag ko rokne ke liye
    try {
      await invoke("open_process_list_window");
    } catch (error) {
      console.error("Window open error:", error);
    }
  };

  //  Settings Window Command
  const openSettings = async (e) => {
    e.stopPropagation(); // Window drag ko rokne ke liye
    try {
      await invoke("open_settings_window");
    } catch (error) {
      console.error("Window open error:", error);
    }
  };

  //  Window Control Handlers
  async function handleMinimize() {
    await appWindow.minimize();
  }

  async function handleToggleMaximize() {
    await appWindow.toggleMaximize();
    const max = await appWindow.isMaximized();
    setIsMaximized(max);
  }

  async function handleClose() {
    await appWindow.close();
  }

  async function handleToggleAlwaysOnTop(e) {
    e.stopPropagation();
    try {
      const newValue = !isAlwaysOnTop;
      await appWindow.setAlwaysOnTop(newValue);
      setIsAlwaysOnTop(newValue);
    } catch (err) {
      console.error("AlwaysOnTop error:", err);
    }
  }

  return (
    <div
      className="titlebar"
      data-tauri-drag-region
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "40px",
        background: "#181717",
        color: "white",
        userSelect: "none",
        borderBottom: "1px solid #333",
      }}
    >
      {/* LEFT SIDE: Icon, Title and Settings */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "12px",
          gap: "10px",
        }}
      >
        <div
          className="titlebar-icon-dot"
          style={{
            width: "8px",
            height: "8px",
            background: "#4caf50",
            borderRadius: "50%",
          }}
        />
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#ddd" }}>
          {title}
        </span>

        {/* Settings Button - Aligned with Title */}
        <button
          onClick={openSettings}
          title="Settings"
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "5px",
            padding: "5px",
            borderRadius: "4px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#4caf50")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
        >
          <Settings size={16} />
        </button>

        {/* CPU Graph Button - Aligned with Title */}
        <button
          onClick={openCpuGraph}
          title="CPU Graph"
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "5px",
            padding: "5px",
            borderRadius: "4px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#4caf50")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
        >
          <Cpu size={16} />
        </button>

        {/* Process List Button - Aligned with Title */}
        <button
          onClick={openProcessList}
          title="Process List"
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: "5px",
            padding: "5px",
            borderRadius: "4px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#4caf50")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
        >
          <Cog size={16} />
        </button>
      </div>

      {/* RIGHT SIDE: Extra Tools + Window Controls */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {/* Pin (Always on Top) Toggle */}
        <button
          onClick={handleToggleAlwaysOnTop}
          title="Always on Top"
          style={{
            background: "transparent",
            border: "none",
            color: isAlwaysOnTop ? "#4caf50" : "#666",
            cursor: "pointer",
            padding: "0 10px",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Anchor size={14} />
        </button>

        {/* Window Controls */}
        <div
          className="titlebar-controls"
          style={{ display: "flex", height: "100%" }}
        >
          <button onClick={handleMinimize} className="ctrl-btn">
            <Minus size={16} />
          </button>
          <button onClick={handleToggleMaximize} className="ctrl-btn">
            <Square size={12} fill={isMaximized ? "currentColor" : "none"} />
          </button>
          <button onClick={handleClose} className="ctrl-btn-close">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Inline Styles for Controls */}
      <style>{`
        .ctrl-btn, .ctrl-btn-close {
          background: transparent;
          border: none;
          color: #aaa;
          width: 45px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .ctrl-btn:hover { background: #333; color: white; }
        .ctrl-btn-close:hover { background: #e81123; color: white; }
      `}</style>
    </div>
  );
}
