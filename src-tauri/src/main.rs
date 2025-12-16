#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
  Manager, menu::{Menu, MenuItem}, tray::TrayIconBuilder
};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app_handle = app.handle();

      // ----- MENU ITEMS (Result -> ?) -----
      let show = MenuItem::new(app_handle, "show", true, None::<&str>)?;
      let hide = MenuItem::new(app_handle, "hide", true, None::<&str>)?;
      let quit = MenuItem::new(app_handle, "quit", true, None::<&str>)?;

      // ----- TRAY MENU -----
      let tray_menu = Menu::with_items(
        app_handle,
        &[&show, &hide, &quit],
      )?;

      // ----- TRAY ICON -----
      TrayIconBuilder::new()
        .menu(&tray_menu)
        .on_menu_event(move |app, event| {
          let window = app.get_webview_window("main").unwrap();

          match event.id().as_ref() {
            "show" => {
              window.show().unwrap();
              window.set_focus().unwrap();
            }
            "hide" => {
              window.hide().unwrap();
            }
            "quit" => {
              std::process::exit(0);
            }
            _ => {}
          }
        })
        .build(app_handle)?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
