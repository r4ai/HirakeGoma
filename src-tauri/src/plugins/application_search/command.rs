use crate::core::db::kv_store::{SearchDatabase, SearchDatabaseItem};
use crate::plugins::application_search::parse_lnk::{parse_lnk, parse_url};
use std::error::Error;
use std::path::PathBuf;
use walkdir::WalkDir;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn generate_index(path: &PathBuf) -> Result<(), Box<dyn Error>> {
    let db = SearchDatabase::init(false);
    for entry in WalkDir::new(path) {
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
        let _ = db.insert(entry_item.name.clone(), entry_item);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use kv::Json;
    use serde::de::value;

    #[test]
    fn greet_test() {
        assert_eq!(greet("綾波"), "Hello, 綾波! You've been greeted from Rust!");
    }

    #[test]
    fn generate_index_test() {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("tests")
            .join("resources")
            .join("fake_data");
        let _ = generate_index(&path);
        let db = SearchDatabase::init(false);
        for item in db.bucket.iter() {
            let item_i = item.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Result<Json<SearchDatabaseItem>, kv::Error> = item_i.value();
            dbg!(key_i);
            dbg!(value_i.unwrap().0);
        }
        assert_eq!(0, 0);
    }
}
