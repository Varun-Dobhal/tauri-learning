use crate::state::MonitorState;
use tauri::{AppHandle, Manager, Emitter};
use sysinfo::System;
use std::thread;
use std::time::Duration;


// Common approach for getting system stats
// fn get_system_stats() -> (f32, u64, u64, String, String, String, u64) {
//     let mut sys = System::new_all();

//     // CPU usage nikalne ke liye ye 3 steps follow karne hote hain: cpu ka status do points par lena padta hai.
//     // 1. Pehla refresh
//     sys.refresh_cpu_all(); 
    
//     // 2. CPU usage calculate karne ke liye thoda wait 
//     thread::sleep(Duration::from_millis(200)); 
    
//     // 3. Doosra refresh (ab ye actual usage nikalega)
//     sys.refresh_cpu_all(); 
//     sys.refresh_memory();

//     let cpu_usage = sys.global_cpu_usage();
//     let used_memory = sys.used_memory();
//     let total_memory = sys.total_memory();
//     let uptime = sysinfo::System::uptime();

//     let sys_name = System::name().unwrap_or_else(|| "Unknown".to_string());
//     let kernel_ver = System::kernel_version().unwrap_or_else(|| "Unknown".to_string());
//     let host_name = System::host_name().unwrap_or_else(|| "Unknown".to_string());

//     (cpu_usage, used_memory, total_memory,sys_name, kernel_ver, host_name,uptime)
    
// }

// Improved approach
pub fn start_background_monitor(app: AppHandle) {
    {
        let state = app.state::<MonitorState>();
        let mut running = state.running.lock().unwrap();
        if *running { return; }
        *running = true;
    }

    let app_inner = app.clone();
    thread::spawn(move || {
        let mut sys = System::new_all();
        let state = app_inner.state::<MonitorState>();
        loop {
            if !*state.running.lock().unwrap() { break; }
            sys.refresh_cpu_all();
            thread::sleep(Duration::from_millis(200));
            sys.refresh_cpu_all();
            sys.refresh_memory();

            let payload = (
                sys.global_cpu_usage(), sys.used_memory(), sys.total_memory(),
                System::name().unwrap_or_default(), System::kernel_version().unwrap_or_default(),
                System::host_name().unwrap_or_default(), System::uptime(),
            );

            let _ = app_inner.emit("system-update", payload);
            thread::sleep(Duration::from_secs(2));
        }
    });
}