import { useEffect } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export default function ReadWriteOpenSave({
  content,
  setContent,
  filePath,
  setFilePath,
  setUnsaved,
  setStatus,
}) {
  // Keyboard shortcuts: Ctrl+O (open), Ctrl+S (save)
  useEffect(() => {
    function handleKeydown(e) {
      const key = e.key.toLowerCase();

      // Ctrl / Cmd + O → Open File
      if ((e.ctrlKey || e.metaKey) && key === "o") {
        e.preventDefault();
        handleOpenFile();
      }

      // Ctrl / Cmd + S → Save File
      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        handleSaveFile();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // content + filePath depend because save needs latest values
  }, [content, filePath]);

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
        setStatus("No file selected");
        return;
      }

      const path = Array.isArray(selected) ? selected[0] : selected;

      setFilePath(path);

      const data = await readTextFile(path);
      console.log("File content:", data);

      setContent(data);
      setUnsaved(false);
      setStatus(`Opened: ${path}`);
    } catch (err) {
      console.error("Error in handleOpenFile:", err);
      setStatus("Error opening file");
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
          setStatus("Save cancelled");
          return;
        }

        setFilePath(path);
      }

      await writeTextFile(path, content);
      setUnsaved(false);
      setStatus(`Saved: ${path}`);
      alert("File saved successfully!");
    } catch (err) {
      console.error("Error in handleSaveFile:", err);
      setStatus("Error saving file");
      alert("Error saving file: " + err);
    }
  }

  return (
    <>
      <div style={{ padding: 25, paddingBottom: 10 }}>
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
    </>
  );
}
