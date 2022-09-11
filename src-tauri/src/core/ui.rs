use std::collections::HashMap;
use std::sync::Mutex;

use crate::core::db::kv_store::SearchDatabase;
use kv::Json;
use tauri;
use tauri::App;
use tauri::Manager;
use tauri::State;
use tauri::Wry;

use crate::plugins::application_search;

use super::db::kv_store::SearchDatabaseItem;

#[derive(Debug)]
struct MyState {
    text1: String,
    text2: String,
}

#[tauri::command]
fn get_my_state(mystate: State<'_, MyState>) -> Result<(), String> {
    println!("{:?}", mystate);
    Ok(())
}

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
fn add_search_database_item(db: State<'_, SearchDatabase>) -> Result<(), String> {
    let key = "Night Taxi".to_string();
    let value = SearchDatabaseItem::newApplication(
        "Night Taxi".to_string(),
        "C:/hoge.png".to_string(),
        "C:/hoge.exe".to_string(),
    );
    let _ = db.insert(key, value);
    Ok(())
}

pub fn init_app() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            application_search::command::greet,
            get_my_state,
            dbg_search_database_items,
            add_search_database_item,
            get_all_search_database_items
        ])
        .setup(|app| {
            let state = MyState {
                text1: "hello".to_owned(),
                text2: "world".to_owned(),
            };
            app.manage(state);

            let search_database_state = SearchDatabase::init(false);
            app.manage(search_database_state);

            #[cfg(debug_assertions)]
            app.get_window("search_window").unwrap().open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_window(app: &mut App<Wry>) {}
