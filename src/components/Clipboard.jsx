import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { ask } from "@tauri-apps/plugin-dialog";

export default function Clipboard({
  content,
  setContent,
  unsaved,
  setUnsaved,
  status,
  setStatus,
}) {
  const listenerRef = useRef(false);

  useEffect(() => {
    if (listenerRef.current) return;
    listenerRef.current = true;

    let unlisten;

    (async () => {
      unlisten = await listen("confirm-close", async () => {
        const shouldSave = await ask("Save and Quit?", {
          title: "Tauri Editor",
          kind: "warning",
          okLabel: "Yes, Save",
          cancelLabel: "No, Exit",
        });

        if (shouldSave) {
          await invoke("mark_saved");
        }

        await invoke("allow_force_close");

        // window.close()
        const win = getCurrentWindow();
        await win.close();
      });
    })();

    return () => {
      if (unlisten) unlisten();
      listenerRef.current = false;
    };
  }, []);

  // Clipboard logic same
  async function handleCopyToClipboard() {
    await writeText(content || "");
    setStatus("Copied to clipboard");
  }

  async function handlePasteFromClipboard() {
    const text = await readText();
    if (text != null) {
      setContent((p) => (p ? p + "\n" + text : text));
      setUnsaved(true);
      setStatus("Pasted");
      await invoke("mark_dirty");
    }
  }

  return (
    <div className="app-card">
      <h2>{unsaved ? "● Tauri Text Editor" : "Tauri Text Editor"}</h2>

      <button onClick={handleCopyToClipboard}>Copy</button>
      <button onClick={handlePasteFromClipboard}>Paste</button>

      <textarea
        className="hacker-editor"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setUnsaved(true);
          invoke("mark_dirty");
        }}
      />
    </div>
  );
}
