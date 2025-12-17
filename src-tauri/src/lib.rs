use tauri::{
    Manager, menu::{Menu, MenuItemBuilder}, tray::TrayIconBuilder
};
 use tauri_plugin_autostart::{MacosLauncher,ManagerExt};

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
