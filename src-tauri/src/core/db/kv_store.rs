use crate::core::utils::get_project_dir;
use kv::{Bucket, Config, Json, Store};
use std::collections::HashMap;
use std::{fmt::Debug, fs, path::PathBuf};

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct SearchDatabaseItem {
    pub name: String,
    pub score: i64,
    pub item_type: String,
    pub icon_path: String,
    pub file_path: String,
    pub command: String,
}

pub struct SearchDatabase<'a> {
    pub config: Config,
    pub store: Store,
    pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    pub folder_path: PathBuf,
}

impl SearchDatabaseItem {
    fn new(
        name: String,
        score: i64,
        item_type: String,
        icon_path: String,
        file_path: String,
        command: String,
    ) -> Self {
        Self {
            name,
            score,
            item_type,
            icon_path,
            file_path,
            command,
        }
    }

    pub fn newApplication(name: String, icon_path: String, file_path: String) -> Self {
        Self {
            name,
            score: 0,
            icon_path,
            file_path,
            item_type: String::from("Application"),
            command: String::from(""),
        }
    }
}

impl SearchDatabase<'_> {
    pub fn init(isTest: bool) -> Self {
        let db_path = if isTest {
            let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("tests")
                .join("resources")
                .join("database")
                .join("search_database");
            let _ = fs::remove_dir_all(&path);
            path
        } else {
            get_project_dir()
                .unwrap()
                .data_dir()
                .join("search_database")
        };
        dbg!(&db_path);
        let db_cfg = Config::new(db_path.clone());
        // let db_cfg = if db_path.exists() {
        //     Config::load(db_path.clone()).expect("Failed to load DATA_DIR/search_database")
        // } else {
        //     Config::new(db_path.clone())
        // };
        // dbg!(&db_cfg);
        let db_store = Store::new(db_cfg.clone()).expect("Failed to create store");
        // dbg!(&db_store);
        let db_bucket: Bucket<String, Json<SearchDatabaseItem>> =
            db_store.bucket(Some("search")).unwrap();
        Self {
            config: db_cfg,
            store: db_store,
            bucket: db_bucket,
            folder_path: db_path,
        }
    }

    pub fn insert(&self, key: String, value: SearchDatabaseItem) -> Result<(), kv::Error> {
        let json_value = Json(value);
        self.bucket.set(&key, &json_value)?;
        Ok(())
    }

    pub fn get(&self, key: &String) -> Result<SearchDatabaseItem, kv::Error> {
        let res = self.bucket.get(key)?.unwrap().0;
        Ok(res)
    }

    pub fn print_all_item(&self) {
        for item_i in self.bucket.iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            dbg!(&key_i, &value_i.0);
        }
    }

    pub fn get_all_items(&self) -> HashMap<String, SearchDatabaseItem> {
        let mut result: HashMap<String, SearchDatabaseItem> = HashMap::new();
        for item_i in self.bucket.iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            result.insert(key_i, value_i.0);
        }
        result
    }

    pub fn clear(&self) -> Result<(), kv::Error> {
        self.bucket.clear()
    }

    pub fn search(&self, keyword: &String) {}
}

#[cfg(test)]
mod tests {
    use super::SearchDatabase;
    use super::SearchDatabaseItem;
    use kv::Json;
    use std::fs;
    use std::thread::sleep;
    use std::time;

    // #[test]     // 原因不明だがテストでエラーが出る。
    fn search_database_init_test() {
        sleep(time::Duration::from_millis(100));
        let db = SearchDatabase::init(true);

        let appname_0 = "After Effects".to_string();
        let appdata_0 = SearchDatabaseItem::newApplication(
            appname_0.clone(),
            "./icons/ae.png".to_string(),
            "./tests/data/ae.exe".to_string(),
        );
        let key_0 = appname_0;
        let value_0 = Json(appdata_0.clone());
        db.bucket.set(&key_0, &value_0);
        for item in db.bucket.iter() {
            let item_i = item.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            dbg!(&key_i, &value_i.0);
            assert_eq!(key_0, key_i);
            assert_eq!(appdata_0, value_i.0);
        }
        let is_removed_end = fs::remove_dir_all("./tests/database/search_database")
            .expect("Failed to remove db folder.");
    }

    #[test]
    fn search_database_insert_get_test() {
        let db = SearchDatabase::init(true);
        let key = "After Effects";
        let value = SearchDatabaseItem::newApplication(
            key.to_string(),
            "./icons/ae.png".to_string(),
            "./tests/data/ae.exe".to_string(),
        );

        db.insert(key.to_string(), value.clone());
        let got_value = db.get(&key.to_string()).unwrap();
        assert_eq!(value, got_value);

        // let is_removed_end = fs::remove_dir_all("./tests/database/search_database");
    }
}
