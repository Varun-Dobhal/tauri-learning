import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

const appWindow = getCurrentWindow();

export default function TitleBar({ title = "My Desktop Application" }) {
  const [isMaximized, setIsMaximized] = useState(false);

  async function handleMinimize() {
    try {
      await appWindow.minimize();
    } catch (err) {
      console.error("Minimize error:", err);
    }
  }

  async function handleToggleMaximize() {
    try {
      await appWindow.toggleMaximize();
      const max = await appWindow.isMaximized();
      setIsMaximized(max);
    } catch (err) {
      console.error("Maximize error:", err);
    }
  }

  async function handleClose() {
    try {
      await appWindow.close();
    } catch (err) {
      console.error("Close error:", err);
    }
  }

  async function handleToggleAlwaysOnTop() {
    try {
      const newValue = !isAlwaysOnTop;
      await appWindow.setAlwaysOnTop(newValue);
      setIsAlwaysOnTop(newValue);
    } catch (err) {
      console.error("AlwaysOnTop error:", err);
    }
  }

  async function handleToggleFullscreen() {
    try {
      const newValue = !isFullscreen;
      await appWindow.setFullscreen(newValue);
      setIsFullscreen(newValue);
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }

  return (
    <div className="titlebar" data-tauri-drag-region>
      {/* Left side: icon + title */}
      <div className="titlebar-left">
        <div className="titlebar-icon-dot" />
        <div className="titlebar-title">{title}</div>
      </div>

      {/* Right side: window controls */}
      <div className="titlebar-controls">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMinimize();
          }}
          id="titlebar-minimize"
          title="Minimize"
          aria-label="Minimize window"
        >
          <Minus size={14} strokeWidth={1.5} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleMaximize();
          }}
          id="titlebar-maximize"
          title="Maximize"
          aria-label="Toggle maximize"
        >
          <Square
            size={12}
            strokeWidth={1.5}
            fill={isMaximized ? "currentColor" : "none"}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          id="titlebar-close"
          title="Close"
          aria-label="Close window"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
