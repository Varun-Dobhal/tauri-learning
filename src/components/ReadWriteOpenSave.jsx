import React from "react";
import { useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export default function ReadWriteOpenSave() {
  const [content, setContent] = useState(""); //File content
  const [filePath, setFilePath] = useState(""); //File path

  // Open file
  async function handleOpenFile() {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [{ name: "Text File", extensions: ["txt"] }],
      });

      console.log("Selected from dialog:", selected);

      if (!selected) {
        alert("No file selected");
        return;
      }

      setFilePath(selected);

      const data = await readTextFile(selected);
      console.log("File content:", data);

      setContent(data);
    } catch (err) {
      console.error("Error in handleOpenFile:", err);
      alert("Error opening file: " + err);
    }
  }

  // Save file
  async function handleSaveFile() {
    try {
      let path = filePath;

      if (!path) {
        path = await save({
          filters: [{ name: "Text File", extensions: ["txt"] }],
        });

        console.log("Save dialog path:", path);

        if (!path) {
          alert("Save cancelled");
          return;
        }

        setFilePath(path);
      }

      await writeTextFile(path, content);
      alert("File saved successfully!");
    } catch (err) {
      console.error("Error in handleSaveFile:", err);
      alert("Error saving file: " + err);
    }
  }

  return (
    <>
      <div style={{ padding: 25 }}>
        <h1>Tauri Text Editor</h1>
        <div style={{ marginBottom: 10 }}>
          <button onClick={handleOpenFile}>📂 Open File</button>
          <button onClick={handleSaveFile} style={{ marginLeft: 10 }}>
            💾 Save File
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#ffffffff" }}>
          Current file: {filePath || "(new file)"}
        </div>
      </div>

      <textarea
        className="hacker-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
      />
    </>
  );
}
