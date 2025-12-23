import { useState } from "react";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export default function SmartEditor() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("System Ready");
  const [filePath, setFilePath] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // Functions
  const handleOpen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Text", extensions: ["txt", "md", "log", "js"] }],
      });
      if (selected) {
        const data = await readTextFile(selected);
        setContent(data);
        setFilePath(selected);
        setIsModified(false);
        setStatus("File Loaded");
      }
    } catch (err) {
      setStatus("Error Opening");
    }
  };

  const handleSave = async () => {
    try {
      let path =
        filePath ||
        (await save({ filters: [{ name: "Text", extensions: ["txt"] }] }));
      if (path) {
        await writeTextFile(path, content);
        setFilePath(path);
        setIsModified(false);
        setStatus("Saved");
      }
    } catch (err) {
      setStatus("Error Saving");
    }
  };

  const handleCopy = async () => {
    await writeText(content);
    setStatus("Copied");
    setTimeout(() => setStatus("Ready"), 2000);
  };

  const handlePaste = async () => {
    const text = await readText();
    if (text) {
      setContent((prev) => (prev ? prev + "\n" + text : text));
      setIsModified(true);
      setStatus("Pasted");
    }
  };

  const containerStyle = {
    width: "95%",
    maxWidth: "850px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "20px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "12px",
  };

  const toolbarStyle = { display: "flex", gap: "8px" };

  const btnStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#cbd5e1",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
    textTransform: "uppercase",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "400px",
    background: "#020617",
    color: "#00ff66",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    padding: "20px",
    border: "1px solid rgba(0, 255, 102, 0.2)",
    borderRadius: "8px",
    outline: "none",
    resize: "none",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    fontSize: "10px",
    color: "#64748b",
    fontFamily: "sans-serif",
    letterSpacing: "0.5px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isModified ? "#facc15" : "#00ff66",
              boxShadow: isModified ? "0 0 10px #facc15" : "0 0 8px #00ff66",
            }}
          ></div>
          <span
            style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}
          >
            {filePath ? filePath.split(/[\\/]/).pop() : "NEW_BUFFER.txt"}
          </span>
        </div>

        <div style={toolbarStyle}>
          <button
            style={btnStyle}
            onClick={handleOpen}
            onMouseOver={(e) => (e.target.style.background = "#3b82f6")}
            onMouseOut={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.05)")
            }
          >
            Open
          </button>
          <button style={btnStyle} onClick={handleSave}>
            Save
          </button>
          <div
            style={{
              width: "1px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 4px",
            }}
          ></div>
          <button style={btnStyle} onClick={handleCopy}>
            Copy
          </button>
          <button style={btnStyle} onClick={handlePaste}>
            Paste
          </button>
        </div>
      </div>

      <textarea
        style={textareaStyle}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsModified(true);
        }}
        placeholder=">> Awaiting input..."
        spellCheck={false}
      />

      <div style={footerStyle}>
        <span>
          STATUS: <b style={{ color: "#3b82f6" }}>{status.toUpperCase()}</b>
        </span>
        <span>MODIFIED: {isModified ? "TRUE" : "FALSE"}</span>
      </div>
    </div>
  );
}
