use crate::core::db::main_table::SearchDatabaseMainTable;
use crate::core::db::search_database_store::{
    SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTable,
};
use crate::core::utils::result::CommandResult;
use crate::plugins::application_search::parse_lnk::{parse_lnk, parse_url};
use std::error::Error;
use std::path::PathBuf;
use tauri::State;
use walkdir::WalkDir;

#[tauri::command]
pub fn plugin_appsearch_generate_index(
    table: State<'_, SearchDatabaseMainTable>,
    path: String,
) -> CommandResult<()> {
    for entry in WalkDir::new(PathBuf::from(path)) {
        let entry = entry?;
        let entry_path = entry.path();
        dbg!(&entry_path);
        dbg!(&entry_path.extension());
        let entry_extension = match entry_path.extension() {
            Some(ext) => ext.to_str().unwrap().to_string(),
            None => continue,
        };
        let entry_item = if &entry_extension == "lnk" {
            dbg!("1");
            parse_lnk(&entry_path.to_path_buf()).unwrap()
        } else if &entry_extension == "url" {
            dbg!("2");
            parse_url(&entry_path.to_path_buf()).unwrap()
        } else {
            continue;
        };
        dbg!(&entry_item);
        let _ = table.insert(entry_item.name.clone(), entry_item);
    }
    Ok(())
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
