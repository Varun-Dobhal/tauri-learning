// Save and Quit wala feature
// import { useEffect, useRef } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { listen } from "@tauri-apps/api/event";
// import { getCurrentWindow } from "@tauri-apps/api/window";
// import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
// import { ask } from "@tauri-apps/plugin-dialog";

// export default function Clipboard({
//   content,
//   setContent,
//   unsaved,
//   setUnsaved,
//   status,
//   setStatus,
// }) {
//   const listenerRef = useRef(false);

//   useEffect(() => {
//     if (listenerRef.current) return;
//     listenerRef.current = true;

//     let unlisten;

//     (async () => {
//       unlisten = await listen("confirm-close", async () => {
//         const shouldSave = await ask("Save and Quit?", {
//           title: "Tauri Editor",
//           kind: "warning",
//           okLabel: "Yes, Save",
//           cancelLabel: "No, Exit",
//         });

//         if (shouldSave) {
//           await invoke("mark_saved");
//         }

//         await invoke("allow_force_close");

//         // window.close()
//         const win = getCurrentWindow();
//         await win.close();
//       });
//     })();

//     return () => {
//       if (unlisten) unlisten();
//       listenerRef.current = false;
//     };
//   }, []);

//   // Clipboard logic same
//   async function handleCopyToClipboard() {
//     await writeText(content || "");
//     setStatus("Copied to clipboard");
//   }

//   async function handlePasteFromClipboard() {
//     const text = await readText();
//     if (text != null) {
//       setContent((p) => (p ? p + "\n" + text : text));
//       setUnsaved(true);
//       setStatus("Pasted");
//       await invoke("mark_dirty");
//     }
//   }

//   return (
//     <div className="app-card">
//       <h2>{unsaved ? "● Tauri Text Editor" : "Tauri Text Editor"}</h2>

//       <button onClick={handleCopyToClipboard}>Copy</button>
//       <button onClick={handlePasteFromClipboard}>Paste</button>

//       <textarea
//         className="hacker-editor"
//         value={content}
//         onChange={(e) => {
//           setContent(e.target.value);
//           setUnsaved(true);
//           invoke("mark_dirty");
//         }}
//       />
//     </div>
//   );
// }

// Fillhal Save and Quit wala feature off kara he.
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";

export default function Clipboard({
  content,
  setContent,
  unsaved,
  setUnsaved,
  status,
  setStatus,
}) {
  async function handleCopyToClipboard() {
    try {
      await writeText(content || "");
      setStatus("Copied to clipboard");
    } catch (err) {
      console.error("Copy error:", err);
      setStatus("Failed to copy");
    }
  }

  async function handlePasteFromClipboard() {
    try {
      const text = await readText();
      if (text != null) {
        setContent((prev) => (prev ? prev + "\n" + text : text));
        setUnsaved(true);
        setStatus("Pasted from clipboard");
      }
    } catch (err) {
      console.error("Paste error:", err);
      setStatus("Failed to paste");
    }
  }

  return (
    <div className="app-card">
      <h2 className="app-heading">
        {unsaved ? "● Tauri Text Editor" : "Tauri Text Editor"}
      </h2>

      <p className="app-text">
        Simple text editor with file open/save (above) and clipboard actions.
      </p>

      {/* Top action buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {/* File buttons yahan se hata diye – woh upar ReadWriteOpenSave handle karta hai */}
        <button onClick={handleCopyToClipboard}>Copy</button>
        <button onClick={handlePasteFromClipboard}>Paste</button>
      </div>

      {/* Text editor */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <textarea
          className="hacker-editor"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setUnsaved(true);
          }}
          spellCheck={false}
        />
      </div>

      {/* Status bar */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          opacity: 0.8,
        }}
      >
        <span>{status}</span>
        <span>{unsaved ? "Unsaved changes" : "All changes saved"}</span>
      </div>
    </div>
  );
}
