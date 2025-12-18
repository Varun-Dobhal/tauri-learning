import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

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
