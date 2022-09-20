use std::collections::HashMap;
use std::sync::Mutex;

use window_shadows::set_shadow;

use crate::core::db::kv_store::SearchDatabase;
use kv::Json;
use tauri;
use tauri::App;
use tauri::Manager;
use tauri::State;
use tauri::Wry;

use crate::plugins::application_search;

use super::db::kv_store::SearchDatabaseItem;
use super::setting::theme::ThemeState;
use super::setting::theme::{
    __cmd__setting_theme_create, __cmd__setting_theme_get_all, setting_theme_create,
    setting_theme_get_all,
};

#[tauri::command]
fn dbg_search_database_items(db: State<'_, SearchDatabase>) -> Result<(), String> {
    db.print_all_item();
    Ok(())
}

#[tauri::command]
fn get_all_search_database_items(
    db: State<'_, SearchDatabase>,
) -> HashMap<String, SearchDatabaseItem> {
    db.get_all_items()
}

#[tauri::command]
fn add_app_to_search_database(
    db: State<'_, SearchDatabase>,
    app_title: String,
    app_icon_path: String,
    app_path: String,
) -> Result<(), String> {
    let key = app_title.clone();
    let value = SearchDatabaseItem::newApplication(app_title, app_icon_path, app_path);
    let _ = db.insert(key, value);
    Ok(())
}

#[tauri::command]
fn clear_search_database(db: State<'_, SearchDatabase>) -> String {
    let res = db.clear();
    let result_msg: String = match res {
        Ok(_) => String::from("SUCCESS"),
        Err(_) => String::from("ERROR"),
    };
    result_msg
}

#[tauri::command]
fn search(
    db: State<'_, SearchDatabase>,
    keyword: String,
    min_score: i64,
) -> Vec<SearchDatabaseItem> {
    db.search(&keyword, min_score)
}

fn init_states(app: &mut App) {
    let search_database_state = SearchDatabase::init(false);
    let theme_state = ThemeState::init();
    app.manage(search_database_state);
    app.manage(theme_state);
}

fn init_window(app: &mut App<Wry>) {}

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
            setting_theme_get_all
        ])
        .setup(|app| {
            init_states(app);

            let window = app.get_window("setting_window").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");

            #[cfg(debug_assertions)]
            app.get_window("setting_window").unwrap().open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
