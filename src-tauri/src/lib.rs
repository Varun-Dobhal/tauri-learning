use tauri::{
    Manager, menu::{Menu, MenuItemBuilder}, tray::TrayIconBuilder
};

use std::thread;
use std::time::Duration;
use sysinfo::{System,ProcessesToUpdate};


// System Process ke liye ye function banaya hai
#[tauri::command]
fn get_processes() -> Vec<(u32, String, f32, u64)> {
    let mut sys = System::new_all();
    
    // Step 1: Pehla refresh
    sys.refresh_processes(ProcessesToUpdate::All, true);
    
    // Step 2: Chota gap zaroori hai CPU usage calculate karne ke liye
    thread::sleep(Duration::from_millis(200));
    
    // Step 3: Doosra refresh
    sys.refresh_processes(ProcessesToUpdate::All, true);

    let mut process_list: Vec<(u32, String, f32, u64)> = sys.processes()
        .values()
        .map(|p| {
            (
                p.pid().as_u32(),
                p.name().to_string_lossy().to_string(), // Name handling safely
                p.cpu_usage(),
                p.memory(), // RAM info bhi add kar di (Bytes mein)
            )
        })
        .collect();

    // Step 4: Sort by CPU (High to Low) taaki kaam ki apps upar aayein
    process_list.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap_or(std::cmp::Ordering::Equal));

    process_list
}


// System stats nikalne ke liye ye function banaya hai
#[tauri::command]
fn get_system_stats() -> (f32, u64, u64, String, String, String, u64) {
    let mut sys = System::new_all();

    // CPU usage nikalne ke liye ye 3 steps follow karne hote hain: cpu ka status do points par lena padta hai.
    // 1. Pehla refresh
    sys.refresh_cpu_all(); 
    
    // 2. CPU usage calculate karne ke liye thoda wait 
    thread::sleep(Duration::from_millis(200)); 
    
    // 3. Doosra refresh (ab ye actual usage nikalega)
    sys.refresh_cpu_all(); 
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_usage();
    let used_memory = sys.used_memory();
    let total_memory = sys.total_memory();
    let uptime = sysinfo::System::uptime();

    let sys_name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let kernel_ver = System::kernel_version().unwrap_or_else(|| "Unknown".to_string());
    let host_name = System::host_name().unwrap_or_else(|| "Unknown".to_string());

    (cpu_usage, used_memory, total_memory,sys_name, kernel_ver, host_name,uptime)
    
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()

        //  PLUGINS 
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                None // <--- CHANGE: Ye dusra argument (Option<Vec<String>>) missing tha
                ))


        //  Yaha se Stats function ko frontend se call karne ke liye expose kar rahe hain
        .invoke_handler(tauri::generate_handler![get_system_stats,get_processes])

        // Prevent from closing the window, hide it instead
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
              
                // prevent close
                api.prevent_close(); 
                
                // window hide
                let _ = window.hide(); 
            }
        })
        
        //  SETUP (Tray icon and menu)
        .setup(|app| {
            let handle = app.handle();

 
            // ---- Tray menu items ----
            let show = MenuItemBuilder::with_id("show", "Show").build(handle)?;
            let hide = MenuItemBuilder::with_id("hide", "Hide").build(handle)?;
            let quit = MenuItemBuilder::with_id("quit", "Quit").build(handle)?;

            let tray_menu = Menu::with_items(handle, &[&show, &hide, &quit])?;

            // ---- Tray icon ----
            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "show" => {
                            if let Some(w) = app.get_webview_window("main") {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(w) = app.get_webview_window("main") {
                                let _ = w.hide();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(handle)?;

            Ok(())
        })

        //  RUN
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
