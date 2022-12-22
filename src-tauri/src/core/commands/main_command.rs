use crate::core::{
    db::{
        applications_table::SearchDatabaseApplicationTable,
        main_table::SearchDatabaseMainTable,
        search_database_store::{SearchDatabaseItem, SearchDatabaseTrait},
    },
    utils::result::CommandResult,
};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub fn dbg_search_database_items(table: State<'_, SearchDatabaseMainTable>) -> Result<(), String> {
    table.print_all_items();
    Ok(())
}

#[tauri::command]
pub fn get_all_search_database_items(
    table: State<'_, SearchDatabaseMainTable>,
) -> CommandResult<HashMap<String, SearchDatabaseItem>> {
    table.get_all_items()
}

#[tauri::command]
pub fn add_app_to_search_database(
    table: State<'_, SearchDatabaseMainTable>,
    app_title: String,
    app_icon_path: String,
    app_path: String,
) -> Result<(), String> {
    let key = app_title.clone();
    let value = SearchDatabaseItem::new_app(app_title, app_icon_path, app_path);
    let _ = table.insert(key, value);
    Ok(())
}

#[tauri::command]
pub fn clear_search_database(table: State<'_, SearchDatabaseMainTable>) -> String {
    let res = table.clear();
    let result_msg: String = match res {
        Ok(_) => String::from("SUCCESS"),
        Err(_) => String::from("ERROR"),
    };
    result_msg
}

#[tauri::command]
pub fn get_all_search_database_application_items(
    table: State<'_, SearchDatabaseApplicationTable>,
) -> CommandResult<HashMap<String, SearchDatabaseItem>> {
    table.get_all_items()
}

#[tauri::command]
pub fn dbg_search_database_application_items(
    table: State<'_, SearchDatabaseApplicationTable>,
) -> Result<(), String> {
    table.print_all_items();
    Ok(())
}
