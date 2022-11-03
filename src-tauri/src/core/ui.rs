use crate::core::db::search_database_store;
use crate::plugins::application_search;
use crate::plugins::application_search::table::PluginAppsearchTable;
use crate::plugins::plugin_store;
use crate::plugins::plugin_store::PluginStore;
use tauri::{App, GlobalShortcutManager, Manager, State, SystemTray, SystemTrayEvent, Window};
use window_shadows::set_shadow;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use super::db::applications_table::SearchDatabaseApplicationTable;
use super::db::commands_table::SearchDatabaseCommandsTable;
use super::db::main_command::{
    __cmd__add_app_to_search_database, __cmd__clear_search_database,
    __cmd__dbg_search_database_items, __cmd__get_all_search_database_items, __cmd__search,
    add_app_to_search_database, clear_search_database, dbg_search_database_items,
    get_all_search_database_items, search,
};
use super::db::main_table::SearchDatabaseMainTable;
use super::db::search_database_store::SearchDatabaseTable;
use super::setting::setting_store::SettingStore;
use super::setting::theme_command::{
    __cmd__setting_theme_activate, __cmd__setting_theme_change, __cmd__setting_theme_create,
    __cmd__setting_theme_get, __cmd__setting_theme_get_activated, __cmd__setting_theme_get_all,
    __cmd__setting_theme_remove, __cmd__setting_theme_save, setting_theme_activate,
    setting_theme_change, setting_theme_create, setting_theme_get, setting_theme_get_activated,
    setting_theme_get_all, setting_theme_remove, setting_theme_save,
};
use super::setting::theme_table::SettingThemeTable;
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
        apply_vibrancy(&main_window, NSVisualEffectMaterial::UltraDark)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    }

    #[cfg(target_os = "windows")]
    apply_blur(&main_window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    set_shadow(&main_window, true).expect("Unsupported platform!");
    set_shadow(&setting_window, true).expect("Unsupported platform!");
    main_window.set_skip_taskbar(true);

    main_window.hide().expect("failed to hide main_window");
    setting_window
        .hide()
        .expect("failed to hide setting_window")
}

fn init_events(app: &mut App, theme_state: State<'_, SettingThemeTable>) {}

fn toggle_visibility(win: Window) {
    if win.is_visible().unwrap() {
        win.hide().expect("failed to hide window");
    } else {
        win.center().unwrap();
        win.show().expect("failed to show window");
        win.set_focus().expect("failed to set-focus to window");
    }
}

pub fn init_app() {
    let tray = SystemTray::new();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            dbg_search_database_items,
            add_app_to_search_database,
            get_all_search_database_items,
            clear_search_database,
            search,
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
            let main_window = app.get_window("main_window").unwrap();
            init_store(app);
            init_window(app);
            app.global_shortcut_manager()
                .register("CmdOrCtrl+Space", move || {
                    toggle_visibility(main_window.clone());
                })
                .expect("Failed to register global shortcuts.");
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
                toggle_visibility(window);
            }
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
