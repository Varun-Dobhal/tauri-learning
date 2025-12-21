use tauri::{App, Manager, menu::{Menu, MenuItemBuilder}, tray::TrayIconBuilder,WebviewWindowBuilder};
use crate::monitor;

pub fn init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle();

    // 1. Start Monitor
    monitor::start_background_monitor(handle.clone());

    // 2. Tray Menu
    let show = MenuItemBuilder::with_id("show", "Show").build(handle)?;
    let hide = MenuItemBuilder::with_id("hide", "Hide").build(handle)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit").build(handle)?;
    let tray_menu = Menu::with_items(handle, &[&show, &hide, &quit])?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&tray_menu)
        .on_menu_event(|app, event| {
            match event.id().as_ref() {
                "show" => { if let Some(w) = app.get_webview_window("main") { let _ = w.show(); let _ = w.set_focus(); } }
                "hide" => { if let Some(w) = app.get_webview_window("main") { let _ = w.hide(); } }
                "quit" => { app.exit(0); }
                _ => {}
            }
        })
        .build(handle)?;

    Ok(())
}