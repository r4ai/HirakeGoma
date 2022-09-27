use super::db_store::{DbItem, DbStore};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub fn dbg_search_database_items(db: State<'_, DbStore>) -> Result<(), String> {
    db.print_all_item();
    Ok(())
}

#[tauri::command]
pub fn get_all_search_database_items(db: State<'_, DbStore>) -> HashMap<String, DbItem> {
    db.get_all_items()
}

#[tauri::command]
pub fn add_app_to_search_database(
    db: State<'_, DbStore>,
    app_title: String,
    app_icon_path: String,
    app_path: String,
) -> Result<(), String> {
    let key = app_title.clone();
    let value = DbItem::newApplication(app_title, app_icon_path, app_path);
    let _ = db.insert(key, value);
    Ok(())
}

#[tauri::command]
pub fn clear_search_database(db: State<'_, DbStore>) -> String {
    let res = db.clear();
    let result_msg: String = match res {
        Ok(_) => String::from("SUCCESS"),
        Err(_) => String::from("ERROR"),
    };
    result_msg
}

#[tauri::command]
pub fn search(db: State<'_, DbStore>, keyword: String, min_score: i64) -> Vec<DbItem> {
    db.search(&keyword, min_score)
}
