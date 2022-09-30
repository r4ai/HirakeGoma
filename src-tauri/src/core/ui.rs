use crate::plugins::application_search;
use tauri;
use tauri::App;
use tauri::Manager;
use tauri::State;
use window_shadows::set_shadow;

use super::db::main_command::{
    __cmd__add_app_to_search_database, __cmd__clear_search_database,
    __cmd__dbg_search_database_items, __cmd__get_all_search_database_items, __cmd__search,
    add_app_to_search_database, clear_search_database, dbg_search_database_items,
    get_all_search_database_items, search,
};
use super::db::main_table::SearchDatabaseMainTable;
use super::db::search_database_store::SearchDatabaseTable;
use super::setting::setting_store::SettingStore;
use crate::core::db::search_database_store::SearchDatabaseStore;

use super::setting::theme_command::{
    __cmd__setting_theme_activate, __cmd__setting_theme_change, __cmd__setting_theme_create,
    __cmd__setting_theme_get, __cmd__setting_theme_get_activated, __cmd__setting_theme_get_all,
    __cmd__setting_theme_remove, __cmd__setting_theme_save, setting_theme_activate,
    setting_theme_change, setting_theme_create, setting_theme_get, setting_theme_get_activated,
    setting_theme_get_all, setting_theme_remove, setting_theme_save,
};
use super::setting::theme_table::SettingThemeTable;

fn init_store(app: &mut App) {
    // * Init stores
    let search_database_store = SearchDatabaseStore::init(false);
    let setting_store = SettingStore::init(false);
    app.manage(search_database_store);
    app.manage(setting_store);

    // * Init tables
    let search_database_main_table =
        SearchDatabaseMainTable::init(app.state::<SearchDatabaseStore>());
    let setting_theme_table = SettingThemeTable::init(app.state::<SettingStore>());
    app.manage(search_database_main_table);
    app.manage(setting_theme_table);
}

fn init_window(app: &mut App) {
    let setting_window = app.get_window("setting_window").unwrap();
    set_shadow(&setting_window, true).expect("Unsupported platform!");
}

fn init_events(app: &mut App, theme_state: State<'_, SettingThemeTable>) {}

pub fn init_app() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            application_search::command::greet,
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
            setting_theme_get_activated
        ])
        .setup(|app| {
            init_store(app);
            init_window(app);

            #[cfg(debug_assertions)]
            app.get_window("setting_window").unwrap().open_devtools();

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Destroyed => {
                let theme_state = event.window().state::<SettingThemeTable>();
                let _ = theme_state.save();
                println!("ThemeState has been saved.");
            }
            _ => (),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
