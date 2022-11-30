use std::collections::HashMap;

use tauri::{AppHandle, Manager, State};

use crate::core::{
    db::{
        applications_table::SearchDatabaseApplicationTable,
        commands_table::SearchDatabaseCommandsTable,
        main_table::SearchDatabaseMainTable,
        search_database_store::{SearchDatabaseItem, SearchDatabaseTable},
    },
    utils::result::{CommandError, CommandResult},
};

/// ## Args
/// - `table_name`: "main" | "application" | "command"
#[tauri::command]
pub fn db_get_all(
    table_name: String,
    app: AppHandle,
) -> CommandResult<HashMap<String, SearchDatabaseItem>> {
    match table_name.as_str() {
        "main" => {
            let table = app.state::<SearchDatabaseMainTable>();
            table.get_all_items()
        }
        "application" => {
            let table = app.state::<SearchDatabaseApplicationTable>();
            table.get_all_items()
        }
        "command" => {
            let table = app.state::<SearchDatabaseCommandsTable>();
            table.get_all_items()
        }
        _ => return Err(CommandError::Db(DbError::GetTable(table_name))),
    }
}

#[tauri::command]
pub fn db_print_all(table_name: String, app: AppHandle) -> CommandResult<()> {
    match table_name.as_str() {
        "main" => {
            let table = app.state::<SearchDatabaseMainTable>();
            table.print_all_items();
            Ok(())
        }
        "application" => {
            let table = app.state::<SearchDatabaseApplicationTable>();
            table.print_all_items();
            Ok(())
        }
        "command" => {
            let table = app.state::<SearchDatabaseCommandsTable>();
            table.print_all_items();
            Ok(())
        }
        _ => return Err(CommandError::Db(DbError::GetTable(table_name))),
    }
}

#[tauri::command]
pub fn db_clear(table_name: String, app: AppHandle) -> CommandResult<()> {
    match table_name.as_str() {
        "main" => {
            let table = app.state::<SearchDatabaseMainTable>();
            table.clear()
        }
        "application" => {
            let table = app.state::<SearchDatabaseApplicationTable>();
            table.clear()
        }
        "command" => {
            let table = app.state::<SearchDatabaseCommandsTable>();
            table.clear()
        }
        _ => return Err(CommandError::Db(DbError::GetTable(table_name))),
    }
}

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error("Failed to get {0} table.")]
    GetTable(String),
}
