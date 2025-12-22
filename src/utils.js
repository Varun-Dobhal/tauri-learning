import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";
import { LazyStore } from "@tauri-apps/plugin-store";
import Database from "@tauri-apps/plugin-sql";
import { emit } from "@tauri-apps/api/event";

// "cpuAlert" export kar rahe hain
export const cpuAlert = async (cpu, alerted) => {
  if (cpu > 80 && !alerted.current) {
    let permission = await isPermissionGranted();
    if (!permission) {
      permission = (await requestPermission()) === "granted";
    }

    if (permission) {
      sendNotification({
        title: "⚠ High CPU Usage",
        body: `CPU is at ${cpu.toFixed(1)}%`,
      });
      alerted.current = true;
    }
  } else if (cpu < 5) {
    alerted.current = false;
  }
};

// user ki "Preferred Theme Color"
// 1. Store file create/load karo (Ye settings.json naam ki file bana dega)
const store = new LazyStore("settings.json");

export const saveSetting = async (key, value) => {
  await store.set(key, value);
  await store.save(); // Ye file likhta hai
};

export const getSetting = async (key) => {
  const val = await store.get(key);
  return val;
};

export const changeColor = async (newColor) => {
  try {
    // 1. File mein save kara taki whai saved color mile
    await store.set("color", newColor);
    await store.save();
    // 2. SABHI WINDOWS KO SIGNAL BHEJO (Global Broadcast)
    await emit("theme-updated", newColor);
  } catch (err) {
    console.error("Failed to change color:", err);
  }
};

// Database Logic
export const saveToDb = async (cpuValue) => {
  const db = await Database.load("sqlite:stats.db");
  await db.execute(
    "CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, cpu REAL, time DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  await db.execute("INSERT INTO logs (cpu) VALUES ($1)", [cpuValue]);
  console.log("Data Saved in SQLite!");
};

export const fetchHistory = async () => {
  const db = await Database.load("sqlite:stats.db");
  const result = await db.select(
    "SELECT cpu as usage, time FROM logs ORDER BY id DESC LIMIT 20"
  );
  return result.reverse();
};
