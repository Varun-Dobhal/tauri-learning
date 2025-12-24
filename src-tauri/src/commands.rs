use crate::state::{EditorState};
use tauri::State;
use sysinfo::{System, ProcessesToUpdate};
use std::{thread, time::Duration};
use tauri::{Manager}; // Zaruri import window handle karne ke liye


// Naya command window kholne ke liye (Rust Side)
#[tauri::command]
pub async fn open_settings_window(handle: tauri::AppHandle) {
    // 1. Pehle check karo kya "settings" naam ki window pehle se hai?
    if let Some(window) = handle.get_webview_window("settings") {
        // 2. Agar hai, toh use "un-hide" karo aur focus mein lao
        window.show().unwrap();
        window.unminimize().unwrap();
        window.set_focus().unwrap();
    } else {
        // 3. Agar nahi hai, toh hi nayi window banao
        let _ = tauri::WebviewWindowBuilder::new(
            &handle,
            "settings",
            tauri::WebviewUrl::App("/settings".into())
        )
        .title("System Settings")
        .inner_size(450.0, 550.0)
        .resizable(false)
        .always_on_top(true)
        .decorations(false)
        .build();
    }
}

// CpuGraph ke liye new window
#[tauri::command]
pub async fn open_cpu_graph_window(handle: tauri::AppHandle) {
    // 1. Pehle check karo kya "settings" naam ki window pehle se hai?
    if let Some(window) = handle.get_webview_window("cpu-graph") {
        // 2. Agar hai, toh use "un-hide" karo aur focus mein lao
        window.show().unwrap();
        window.unminimize().unwrap();
        window.set_focus().unwrap();
    } else {
        let _ = tauri::WebviewWindowBuilder::new(
            &handle,
            "cpu-graph",
            tauri::WebviewUrl::App("/cpu-graph".into())
        )
        .title("CPU Usage Graph")
        .inner_size(600.0, 500.0)
        .resizable(true)
        .decorations(false)
        .build();
    }
}

// Process List ke liye command
#[tauri::command]
pub async fn open_process_list_window(handle: tauri::AppHandle) {
    // 1. Pehle check karo kya "process-list" naam ki window pehle se hai?
    if let Some(window) = handle.get_webview_window("process-list") {
        // 2. Agar hai, toh use "un-hide" karo aur focus mein lao
        window.show().unwrap();
        window.unminimize().unwrap();
        window.set_focus().unwrap();
    } else {
        let _ = tauri::WebviewWindowBuilder::new(
            &handle,
            "process-list",
            tauri::WebviewUrl::App("/process".into())
        )
        .title("Process List")
        .inner_size(800.0, 600.0)
        .resizable(true)
        .decorations(false)
        .build();
    }
}

#[tauri::command]
pub fn get_processes() -> Vec<(u32, String, f32, u64)> {
    let mut sys = System::new_all();
    sys.refresh_processes(ProcessesToUpdate::All, true);
    thread::sleep(Duration::from_millis(200));
    sys.refresh_processes(ProcessesToUpdate::All, true);

    let mut list: Vec<(u32, String, f32, u64)> = sys.processes()
        .values()
        .map(|p| (p.pid().as_u32(), p.name().to_string_lossy().to_string(), p.cpu_usage(), p.memory()))
        .collect();

    list.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap_or(std::cmp::Ordering::Equal));
    list
}

#[tauri::command]
pub fn set_open_file(path: String, state: State<EditorState>) {
    *state.current_file.lock().unwrap() = Some(path);
    *state.is_dirty.lock().unwrap() = false;
}

#[tauri::command]
pub fn mark_saved(state: State<EditorState>) {
    *state.is_dirty.lock().unwrap() = false;
}

#[tauri::command]
pub fn mark_dirty(state: State<EditorState>) {
    *state.is_dirty.lock().unwrap() = true;
}

#[tauri::command]
pub fn allow_force_close(state: State<EditorState>) {
    *state.force_close.lock().unwrap() = true;
}

// Splash screen ke liye command
#[tauri::command]
pub async fn close_splashscreen(app: tauri::AppHandle) {
    // 1. Splash window ko pakdo
    if let Some(splash_window) = app.get_webview_window("splashscreen") {
        splash_window.close().unwrap();
    }
    // 2. Main window ko dikhao
    if let Some(main_window) = app.get_webview_window("main") {
        main_window.show().unwrap();
        main_window.unminimize().unwrap();
        main_window.set_focus().unwrap();
    }
}