use crate::state::{EditorState};
use tauri::State;
use sysinfo::{System, ProcessesToUpdate};
use std::{thread, time::Duration};

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