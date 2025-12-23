mod state;
mod commands;
mod monitor;
mod setup;
use std::sync::Mutex;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Plugins
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())

        // State
        .manage(state::MonitorState { running: Mutex::new(false) })
        .manage(state::EditorState {
            current_file: Mutex::new(None),
            is_dirty: Mutex::new(false),
            force_close: Mutex::new(false),
        })

        // Commands (Ab ek hi jagah se)
        .invoke_handler(tauri::generate_handler![
            commands::close_splashscreen,
            commands::open_process_list_window,
            commands::open_cpu_graph_window,
            commands::open_settings_window, 
            commands::get_processes,
            commands::set_open_file,
            commands::mark_dirty,
            commands::mark_saved,
            commands::allow_force_close
        ])


        // Without save, prevent app from closing(CURRENTLY DISABLED KAR RA HU)
            // .on_window_event(|window, event| {
            //     if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            //         let state = window.state::<EditorState>();
                    
            //         let dirty = *state.is_dirty.lock().unwrap();
            //         let force_close = *state.force_close.lock().unwrap();
                    
            //         if dirty && !force_close {
            //             api.prevent_close();
            //             let _ = window.emit("confirm-close", ());
            //         }
            //     }
            // })
            
        // Prevent from closing the window, hide it instead
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })

        // Modular Setup
        .setup(|app| {
            setup::init(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}