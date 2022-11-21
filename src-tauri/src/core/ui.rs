use crate::core::db::search_database_store;
use crate::plugins::application_search;
use crate::plugins::application_search::table::PluginAppsearchTable;
use crate::plugins::plugin_store;
use crate::plugins::plugin_store::PluginStore;
use tauri::{
    App, CustomMenuItem, GlobalShortcutManager, Manager, State, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, Window,
};
use window_shadows::set_shadow;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use super::commands::main_command::{
    __cmd__add_app_to_search_database, __cmd__clear_search_database,
    __cmd__dbg_search_database_items, __cmd__get_all_search_database_items, __cmd__search,
    add_app_to_search_database, clear_search_database, dbg_search_database_items,
    get_all_search_database_items, search,
};
use super::commands::theme_command::{
    __cmd__setting_theme_activate, __cmd__setting_theme_change, __cmd__setting_theme_create,
    __cmd__setting_theme_get, __cmd__setting_theme_get_activated, __cmd__setting_theme_get_all,
    __cmd__setting_theme_remove, __cmd__setting_theme_save, setting_theme_activate,
    setting_theme_change, setting_theme_create, setting_theme_get, setting_theme_get_activated,
    setting_theme_get_all, setting_theme_remove, setting_theme_save,
};
use super::db::applications_table::SearchDatabaseApplicationTable;
use super::db::commands_table::SearchDatabaseCommandsTable;
use super::db::main_table::SearchDatabaseMainTable;
use super::db::search_database_store::SearchDatabaseTable;
use super::db::setting_store::SettingStore;
use super::db::theme_table::SettingThemeTable;
use crate::core::db::search_database_store::SearchDatabaseStore;
use crate::plugins::application_search::command::*;

fn init_store(app: &mut App) {
    // * Init stores
    let search_database_store = SearchDatabaseStore::init(false);
    let setting_store = SettingStore::init(false);
    let plugin_store = PluginStore::init(false);
    app.manage(search_database_store);
    app.manage(setting_store);
    app.manage(plugin_store);

    // * Init tables
    let search_database_main_table =
        SearchDatabaseMainTable::init(app.state::<SearchDatabaseStore>());
    let search_database_application_table =
        SearchDatabaseApplicationTable::init(app.state::<SearchDatabaseStore>());
    let search_database_command_table =
        SearchDatabaseCommandsTable::init(app.state::<SearchDatabaseStore>());
    app.manage(search_database_main_table);
    app.manage(search_database_application_table);
    app.manage(search_database_command_table);

    let setting_theme_table = SettingThemeTable::init(app.state::<SettingStore>());
    app.manage(setting_theme_table);

    let plugin_appsearch_table = PluginAppsearchTable::init(app.state::<PluginStore>());
    app.manage(plugin_appsearch_table);
}

fn init_window(app: &mut App) {
    let main_window = app.get_window("main_window").unwrap();
    let setting_window = app.get_window("setting_window").unwrap();

    #[cfg(target_os = "macos")]
    {
        app.set_activation_policy(tauri::ActivationPolicy::Accessory);
        setting_window
            .set_decorations(true)
            .expect("Failed to set decoration true");
        apply_vibrancy(&main_window, NSVisualEffectMaterial::HudWindow, None, None)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    }

    #[cfg(target_os = "windows")]
    {
        setting_window
            .set_decorations(false)
            .expect("Failed to set decoration false");
        apply_blur(&main_window, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    }

    set_shadow(&main_window, true).expect("Unsupported platform!");
    set_shadow(&setting_window, true).expect("Unsupported platform!");
    main_window
        .set_skip_taskbar(true)
        .expect("Failed to set to skip taskbar");

    main_window.hide().expect("failed to hide main_window");
    setting_window
        .hide()
        .expect("failed to hide setting_window")
}

fn init_events(app: &mut App, theme_state: State<'_, SettingThemeTable>) {}

#[tauri::command]
fn core_window_hide(win: Window) {
    win.hide().expect("Failed to hide window.");
}

#[tauri::command]
fn core_window_show(win: Window) {
    win.center().expect("Failed to center the window.");
    win.show().expect("Failed to show window.");
    win.set_focus().expect("Failed to set-focus to window.");
}

#[tauri::command]
fn core_window_toggle_visibility(win: Window) {
    if win.is_visible().unwrap() {
        core_window_hide(win);
    } else {
        core_window_show(win);
    }
}

#[tauri::command]
fn core_os_get_name() -> String {
    #[cfg(target_os = "windows")]
    return "windows".to_string();

    #[cfg(target_os = "macos")]
    return "macos".to_string();

    #[cfg(target_os = "linux")]
    return "linux".to_string();
}

pub fn init_app() {
    let settings = CustomMenuItem::new("settings".to_string(), "Settings");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(settings)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            dbg_search_database_items,
            add_app_to_search_database,
            get_all_search_database_items,
            clear_search_database,
            search,
            core_window_hide,
            core_window_show,
            core_window_toggle_visibility,
            core_os_get_name,
            setting_theme_create,
            setting_theme_remove,
            setting_theme_get,
            setting_theme_get_all,
            setting_theme_change,
            setting_theme_activate,
            setting_theme_save,
            setting_theme_get_activated,
            plugin_appsearch_generate_index,
            plugin_appsearch_update_folder_path,
            plugin_appsearch_upload_to_main_table,
            plugin_appsearch_get_all,
            plugin_appsearch_get
        ])
        .setup(|app| {
            init_store(app);
            init_window(app);
            Ok(())
        })
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main_window").unwrap();
                core_window_toggle_visibility(window);
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {}
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "settings" => {
                    let setting_win = app
                        .get_window("setting_window")
                        .expect("Failed to get setting_window.");
                    setting_win.show().expect("Failed to show setting_window.");
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Destroyed => {
                let _ = event.window().state::<SettingThemeTable>().save();
                let _ = event.window().state::<SearchDatabaseMainTable>().save();
                let _ = event
                    .window()
                    .state::<SearchDatabaseApplicationTable>()
                    .save();
                let _ = event.window().state::<SearchDatabaseCommandsTable>().save();
                let _ = event.window().state::<PluginAppsearchTable>().save();
                println!("Stores has been saved.");
            }
            _ => (),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
