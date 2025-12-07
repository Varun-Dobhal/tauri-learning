import { useState } from "react";
import { appWindow } from "@tauri-apps/api/window";

export default function WindowControls() {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  async function handleMinimize() {
    await appWindow.minimize();
  }

  async function handleToggleMaximize() {
    await appWindow.toggleMaximize();
  }

  async function handleClose() {
    await appWindow.close();
  }

  async function handleCenter() {
    await appWindow.center();
  }

  async function handleToggleAlwaysOnTop() {
    const newValue = !isAlwaysOnTop;
    await appWindow.setAlwaysOnTop(newValue);
    setIsAlwaysOnTop(newValue);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        padding: "4px 8px",
        borderBottom: "1px solid #ddd",
        background: "#f5f5f5",
      }}
    >
      <button onClick={handleCenter}>🎯</button>
      <button onClick={handleToggleAlwaysOnTop}>
        {isAlwaysOnTop ? "📌 On Top" : "📍 Normal"}
      </button>
      <button onClick={handleMinimize}>⬇</button>
      <button onClick={handleToggleMaximize}>⬜</button>
      <button onClick={handleClose} style={{ color: "red" }}>
        ❌
      </button>
    </div>
  );
}
