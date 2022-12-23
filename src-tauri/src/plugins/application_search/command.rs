use super::table::{PluginAppsearchItem, PluginAppsearchTable};
use crate::core::db::applications_table::SearchDatabaseApplicationTable;
use crate::core::db::main_table::SearchDatabaseMainTable;
use crate::core::db::search_database_store::{
    SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTrait,
};
use crate::core::utils::result::{CommandError, CommandResult};
use crate::plugins::application_search::parser::{parse_app, parse_exe, parse_lnk, parse_url};
use kv::Json;
use log::{debug, error, info, trace, warn};
use std::collections::HashMap;
use std::path::PathBuf;
use std::thread;
use tauri::api::shell::open;
use tauri::{plugin, App, AppHandle, Manager, State};
use walkdir::WalkDir;

#[tauri::command]
pub fn plugin_appsearch_generate_index(app: AppHandle, debug: bool) -> CommandResult<()> {
    info!("Start generating application indexes.");
    let res = thread::spawn(move || -> CommandResult<()> {
        let app_handle = app.clone();
        let db_table = app_handle.state::<SearchDatabaseApplicationTable>();
        let plugin_table = app_handle.state::<PluginAppsearchTable>();
        db_table.clear()?;
        let paths = match plugin_table.bucket.get(&String::from("folder_paths"))? {
            None => {
                return Err(CommandError::Kv(kv::Error::Message(String::from(
                    "Failed to find the item associated to the key.",
                ))))
            }
            Some(r) => r.0,
        };
        let PluginAppsearchItem::FolderPaths(paths_vec) = paths;
        for path in paths_vec.iter() {
            debug!("START: parsing items in {}", path);
            for entry in WalkDir::new(PathBuf::from(path)) {
                let entry = entry?;
                let entry_path = entry.path();
                let entry_extension = match entry_path.extension() {
                    Some(ext) => ext.to_str().unwrap().to_string(),
                    None => continue,
                };
                let entry_item = match entry_extension.as_str() {
                    "lnk" => {
                        debug!("Parse .lnk of {}", &entry_path.display());
                        match parse_lnk(app.clone(), &entry_path.to_path_buf()) {
                            Ok(res) => res,
                            Err(e) => {
                                warn!("Failed to parse .lnk: {}", e);
                                continue;
                            }
                        }
                    }
                    "url" => {
                        debug!("Parse .url of {}", &entry_path.display());
                        match parse_url(app.clone(), &entry_path.to_path_buf()) {
                            Ok(res) => res,
                            Err(e) => {
                                warn!("Failed to parse .url: {}", e);
                                continue;
                            }
                        }
                    }
                    "exe" => {
                        if cfg!(target_os = "windows") {
                            debug!("Parse .exe of {}", &entry_path.display());
                            match parse_exe(&entry_path.to_path_buf()) {
                                Ok(o) => o,
                                Err(e) => {
                                    warn!("{}", e);
                                    continue;
                                }
                            }
                        } else {
                            continue;
                        }
                    }
                    "app" => {
                        if cfg!(target_os = "macos") {
                            debug!("Parse .app of {}", &entry_path.display());
                            match parse_app(&entry_path.to_path_buf()) {
                                Ok(o) => o,
                                Err(e) => {
                                    warn!("{}", e);
                                    continue;
                                }
                            }
                        } else {
                            continue;
                        }
                    }
                    _ => {
                        continue;
                    }
                };
                db_table
                    .change(entry_item.name.clone(), entry_item)
                    .unwrap();
            }
            let _ = db_table.save();
            debug!("END: parsing items in {}", path);
        }
        // let apptable = app_handle
        //     .state::<SearchDatabaseApplicationTable>()
        //     .print_all_items();
        if debug {
            dbg!(debug);
        }
        Ok(())
    })
    .join()
    .unwrap();
    info!("Finish generating application indexes.");
    return res;
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
    info!("START: plugin_appsearch_upload_to_main_table command");
    for item_i in app_table.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        trace!("CHANGE: {}", &key_i);
        let value_json_i: Json<SearchDatabaseItem> = item_i.value()?;
        let value_i = value_json_i.0;
        main_table.change(key_i, value_i)?;
    }
    info!("END: plugin_appsearch_upload_to_main_table command");
    Ok(())
}

#[tauri::command]
pub fn plugin_appsearch_open(path: String, app: AppHandle) -> CommandResult<()> {
    let res = open(&app.shell_scope(), path.as_str(), None);
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(CommandError::TauriApi(e)),
    }
}
