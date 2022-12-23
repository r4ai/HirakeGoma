use std::fs;
use std::time;

use crate::core::db::search_database_store;
use crate::core::utils::path::parse_json;
use crate::plugins::application_search;
use crate::plugins::application_search::table::PluginAppsearchTable;
use crate::plugins::plugin_store::PluginStore;
use chrono::Utc;
use log::debug;
use log::error;
use log::info;
use log::warn;
use tauri::{
    App, AppHandle, CustomMenuItem, GlobalShortcutManager, Manager, State, SystemTray,
    SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Window,
};
use tauri_plugin_log::fern::colors::ColoredLevelConfig;
use walkdir::WalkDir;
use window_shadows::set_shadow;
#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

use super::commands::core_command::*;
use super::commands::db_command::*;
use super::commands::main_command::*;
use super::commands::search_command::*;
use super::commands::setting_command::*;
use super::db::applications_table::SearchDatabaseApplicationTable;
use super::db::commands_table::SearchDatabaseCommandsTable;
use super::db::main_table::SearchDatabaseMainTable;
use super::db::search_database_store::SearchDatabaseTrait;
use super::db::setting_store::SettingStore;
use super::db::setting_table_hotkey::SettingTableHotkey;
use super::db::setting_table_theme::SettingTableTheme;
use super::utils::path::get_plugin_dir;
use super::utils::result::CommandResult;
use crate::core::db::search_database_store::SearchDatabaseStore;
use crate::plugins::application_search::command::*;
use tauri_plugin_log::{LogTarget, LoggerBuilder};

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

    let setting_table_theme = SettingTableTheme::init(app.state::<SettingStore>());
    let setting_table_hotkey = SettingTableHotkey::init(app.state::<SettingStore>());
    app.manage(setting_table_theme);
    app.manage(setting_table_hotkey);

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

fn init_events(app: &mut App, theme_table: State<'_, SettingTableTheme>) {}

fn init_hotkey(app: &mut App) {
    let app_handle = app.app_handle();
    let hotkey_table = app_handle.state::<SettingTableHotkey>();
    let mut gsm = app_handle.global_shortcut_manager();
    let hotkeys = hotkey_table
        .get_all()
        .expect("Failed to load hotkeys setting");
    for hotkey_item in hotkeys {
        let app_handle_clone = app_handle.clone();
        let _ = match hotkey_item.0.as_str() {
            "open_main_window" => gsm.register(hotkey_item.1.as_str(), move || {
                core_window_toggle_visibility(app_handle_clone.get_window("main_window").unwrap());
            }),
            _ => Ok(()),
        };
    }
}

fn init_plugin(app: &mut App) -> CommandResult<()> {
    let app_handle = app.app_handle();
    let plugin_dir = get_plugin_dir()?;
    info!("Start loading plugins in `{}`", plugin_dir.display());
    if !plugin_dir.exists() {
        warn!(
            "Plugin dir not found, automatically created: {}",
            plugin_dir.display()
        );
        fs::create_dir_all(&plugin_dir)?;
    }
    for entry in fs::read_dir(plugin_dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            info!("Load plugin: {}", path.display());
            let plugin_json = path.join("plugin.json");
            let plugin_data = parse_json(plugin_json)?;

            let activate_keyword = match plugin_data["ActivateKeyword"].as_str() {
                Some(keyword) => keyword,
                None => {
                    error!("Failed to load plugin: {}", path.display());
                    error!("Plugin `{}` don't have `ActivateKeyword`", path.display());
                    continue;
                }
            };
            let command = match plugin_data["Command"].as_str() {
                Some(command) => command,
                None => {
                    error!("Failed to load plugin: {}", path.display());
                    error!("Plugin `{}` don't have `Command`", path.display());
                    continue;
                }
            };
            let title = match plugin_data["Name"].as_str() {
                Some(title) => title,
                None => {
                    error!("Failed to load plugin: {}", path.display());
                    error!("Plugin `{}` don't have `Name`", path.display());
                    continue;
                }
            };
            let description = match plugin_data["Description"].as_str() {
                Some(description) => description,
                None => {
                    error!("Failed to load plugin: {}", path.display());
                    error!("Plugin `{}` don't have `Description`", path.display());
                    continue;
                }
            };

            debug!("activate_keyword: {}", activate_keyword);
            debug!("command: {}", command);
            debug!("title: {}", title);
            debug!("description: {}", description);
        }
    }
    Ok(())
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
        .plugin(
            LoggerBuilder::new()
                .format(move |out, message, record| {
                    out.finish(format_args!(
                        "[{}][{}][{}] {}",
                        record.level(),
                        Utc::now().format("%Y-%m-%d %H:%M:%S"),
                        record.target(),
                        message
                    ))
                })
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .filter(|meta| {
                    if meta.target().contains("HirakeGoma")
                        || meta.target().to_lowercase().contains("tauri")
                    {
                        return true;
                    } else {
                        return (meta.level() == log::Level::Error)
                            || (meta.level() == log::Level::Warn);
                    }
                })
                .with_colors(ColoredLevelConfig::default())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            dbg_search_database_items,
            dbg_search_database_application_items,
            add_app_to_search_database,
            get_all_search_database_items,
            get_all_search_database_application_items,
            clear_search_database,
            search,
            db_get_all,
            db_print_all,
            db_clear,
            core_window_hide,
            core_window_show,
            core_window_toggle_visibility,
            core_window_create,
            core_os_get_name,
            setting_theme_create,
            setting_theme_remove,
            setting_theme_get,
            setting_theme_get_all,
            setting_theme_change,
            setting_theme_activate,
            setting_theme_save,
            setting_theme_get_activated,
            setting_hotkey_change,
            setting_hotkey_get,
            setting_hotkey_get_all,
            setting_hotkey_remove,
            setting_hotkey_save,
            setting_hotkey_update,
            plugin_appsearch_generate_index,
            plugin_appsearch_update_folder_path,
            plugin_appsearch_upload_to_main_table,
            plugin_appsearch_get_all,
            plugin_appsearch_get,
            plugin_appsearch_open,
            setting_hotkey_update
        ])
        .setup(|app| {
            init_store(app);
            init_window(app);
            init_hotkey(app);
            init_plugin(app).expect("Failed to init plugin");
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
                    let app_handle = app.app_handle();
                    let setting_win = WindowList::Setting;
                    let got_window = app_handle.get_window(&setting_win.label());
                    println!("{:?}", &setting_win.label());
                    let _ = match got_window {
                        Some(_) => {
                            core_window_show_that(&app_handle, setting_win);
                            Ok(())
                        }
                        None => core_window_create_that(app_handle, setting_win),
                    };
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Destroyed => {
                let _ = event.window().state::<SettingTableTheme>().save();
                let _ = event.window().state::<SettingTableHotkey>().save();
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
