use super::table::{PluginAppsearchItem, PluginAppsearchTable};
use crate::core::db::applications_table::SearchDatabaseApplicationTable;
use crate::core::db::main_table::SearchDatabaseMainTable;
use crate::core::db::search_database_store::{SearchDatabaseItem, SearchDatabaseTable};
use crate::core::utils::result::{CommandError, CommandResult};
use crate::plugins::application_search::parser::{parse_lnk, parse_url};
use kv::Json;
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::api::shell::open;
use tauri::{App, AppHandle, Manager, State};
use walkdir::WalkDir;

#[tauri::command]
pub fn plugin_appsearch_generate_index(
    db_table: State<'_, SearchDatabaseApplicationTable>,
    plugin_table: State<'_, PluginAppsearchTable>,
) -> CommandResult<()> {
    let paths = match plugin_table.bucket.get(&String::from("folder_paths"))? {
        None => {
            return Err(CommandError::KvError(kv::Error::Message(String::from(
                "Failed to find the item associated to the key.",
            ))))
        }
        Some(r) => r.0,
    };
    let PluginAppsearchItem::FolderPaths(paths_vec) = paths;
    for path in paths_vec.iter() {
        for entry in WalkDir::new(PathBuf::from(path)) {
            let entry = entry?;
            let entry_path = entry.path();
            dbg!(&entry_path);
            let entry_extension = match entry_path.extension() {
                Some(ext) => ext.to_str().unwrap().to_string(),
                None => continue,
            };
            let entry_item = if &entry_extension == "lnk" {
                println!("--- PARSE .LNK FILE ---");
                parse_lnk(&entry_path.to_path_buf()).unwrap()
            } else if &entry_extension == "url" {
                println!("--- PARSE .URL FILE ---");
                parse_url(&entry_path.to_path_buf()).unwrap()
            } else {
                continue;
            };
            dbg!(&entry_item);
            let _ = db_table.insert(entry_item.name.clone(), entry_item);
        }
    }
    Ok(())
}

#[tauri::command]
pub fn plugin_appsearch_update_folder_path(
    table: State<'_, PluginAppsearchTable>,
    paths: Vec<String>,
) -> CommandResult<()> {
    let key = String::from("folder_paths");
    let is_contain = table.bucket.contains(&key)?;
    if is_contain {
        table.bucket.remove(&key)?;
    }
    table
        .bucket
        .set(&key, &Json(PluginAppsearchItem::FolderPaths(paths)))?;
    table.print_all_items();
    Ok(())
}

#[tauri::command]
pub fn plugin_appsearch_get(
    table: State<'_, PluginAppsearchTable>,
    key: String,
) -> CommandResult<Option<PluginAppsearchItem>> {
    let res = match table.bucket.get(&key)? {
        None => None,
        Some(r) => Some(r.0),
    };
    Ok(res)
}

#[tauri::command]
pub fn plugin_appsearch_get_all(
    table: State<'_, PluginAppsearchTable>,
) -> CommandResult<HashMap<String, PluginAppsearchItem>> {
    let res = table.get_all()?;
    Ok(res)
}

#[tauri::command]
pub fn plugin_appsearch_upload_to_main_table(
    app_table: State<'_, SearchDatabaseApplicationTable>,
    main_table: State<'_, SearchDatabaseMainTable>,
) -> CommandResult<()> {
    dbg!("Upload to main table");
    for item_i in app_table.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<SearchDatabaseItem> = item_i.value()?;
        let value_i = value_json_i.0;
        main_table.insert(key_i, value_i)?;
    }
    dbg!("Successfully Uploaded to main table");
    Ok(())
}

#[tauri::command]
pub fn plugin_appsearch_open(path: String, app: AppHandle) -> CommandResult<()> {
    let res = open(&app.shell_scope(), path.as_str(), None);
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(CommandError::TauriError(e)),
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use kv::Json;
//     use serde::de::value;

//     #[test]
//     fn greet_test() {
//         assert_eq!(greet("綾波"), "Hello, 綾波! You've been greeted from Rust!");
//     }

//     #[test]
//     fn generate_index_dbg() {
//         let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
//             .join("tests")
//             .join("resources")
//             .join("fake_data");
//         let _ = generate_index(&path);
//         let db = SearchDatabaseStore::init(false);
//         for item in db.bucket.iter() {
//             let item_i = item.unwrap();
//             let key_i: String = item_i.key().unwrap();
//             let value_i: Result<Json<SearchDatabaseItem>, kv::Error> = item_i.value();
//             dbg!(key_i);
//             dbg!(value_i.unwrap().0);
//         }
//         assert_eq!(0, 0);
//     }

//     #[test]
//     fn dbg_read_db_dbg() {
//         let _ = dbg_read_db();
//     }
// }
