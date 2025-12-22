import { emit } from "@tauri-apps/api/event";
import { saveSetting } from "../utils.js";
import TitleBar from "./TitleBar.jsx";

export default function SettingsPage() {
  const updateTheme = async (color) => {
    await saveSetting("color", color);
    await emit("theme-updated", color); // Ye signal bhej raha hai
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#181717",
        height: "100vh",
        color: "white",
      }}
    >
      <TitleBar title="System Settings" />
      <h2
        style={{
          marginTop: "50px",
        }}
      >
        System Settings
      </h2>
      <hr style={{ borderColor: "#333" }} />
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={() => updateTheme("#2196f3")}
          style={{
            background: "#2196f3",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Blue
        </button>
        <button
          onClick={() => updateTheme("#4caf50")}
          style={{
            background: "#4caf50",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Green
        </button>
        <button
          onClick={() => updateTheme("#f44336")}
          style={{
            background: "#f44336",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Red
        </button>
      </div>
    </div>
  );
}
