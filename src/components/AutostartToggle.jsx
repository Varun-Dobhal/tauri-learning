import { useEffect, useState } from "react";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

export default function AutostartToggle() {
  const [isAutoStart, setIsAutoStart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await isEnabled();
        setIsAutoStart(status);
      } catch (err) {
        console.error("Autostart check failed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const toggleAutostart = async () => {
    const previousState = isAutoStart;
    try {
      setIsAutoStart(!previousState); // Optimistic Update
      if (!previousState) {
        await enable();
      } else {
        await disable();
      }
    } catch (err) {
      setIsAutoStart(previousState); // Revert on error
      alert("System Permission Denied");
    }
  };

  if (loading) return null;

  return (
    <>
      <style>{`
        .autostart-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          max-width: 450px;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #ffffff;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-section h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #f1f1f1;
        }

        .info-section p {
          margin: 0;
          font-size: 13px;
          color: #9ca3af;
        }

        /* Modern Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 22px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #374151;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        input:checked + .slider {
          background-color: #3b82f6; /* Modern Blue */
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .autostart-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* --- Component UI --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <div className="autostart-card">
          <div className="info-section">
            <h4>🚀 Launch on Startup</h4>
            <p>Start the app automatically when you log in.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoStart}
              onChange={toggleAutostart}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </>
  );
}
