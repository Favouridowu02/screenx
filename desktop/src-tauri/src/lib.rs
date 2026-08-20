use base64::{engine::general_purpose, Engine as _};
use image::ImageFormat;
use std::io::Cursor;
use xcap::Monitor;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use tauri::{Emitter, Manager};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn capture_screen() -> Result<String, String> {
    let monitors = Monitor::all().map_err(|e| e.to_string())?;
    
    let monitor = monitors
        .into_iter()
        .find(|m| m.is_primary().unwrap_or(false))
        .or_else(|| Monitor::all().ok()?.into_iter().next())
        .ok_or_else(|| "No monitor found".to_string())?;

    let image = monitor.capture_image().map_err(|e| e.to_string())?;

    let mut buf = Cursor::new(Vec::new());
    image
        .write_to(&mut buf, ImageFormat::Png)
        .map_err(|e| e.to_string())?;

    let base64_encoded = general_purpose::STANDARD.encode(buf.into_inner());
    Ok(format!("data:image/png;base64,{}", base64_encoded))
}

use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::WindowEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        if shortcut.matches(Modifiers::CONTROL | Modifiers::ALT, Code::KeyM) {
                            let _ = app.emit("shortcut-triggered", ());
                        }
                    }
                })
                .build(),
        )
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                let shortcut = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyM);
                let _ = app.global_shortcut().register(shortcut);
                
                // Tray Menu
                let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
                let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
                let menu = Menu::with_items(app, &[&show_i, &quit_i])?;
                
                let _tray = TrayIconBuilder::new()
                    .menu(&menu)
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {}
                    })
                    .build(app)?;
            }
            Ok(())
        })
        .on_window_event(|window, event| match event {
            WindowEvent::CloseRequested { api, .. } => {
                let _ = window.hide();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet, capture_screen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
