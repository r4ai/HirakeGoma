use crate::core::utils::get_project_dir;
use kv::{Bucket, Config, Json, Store};
use std::{
    fmt::Debug,
    path::{Path, PathBuf},
};
use uuid::Uuid;

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct SearchDatabaseItem {
    name: String,
    item_type: String,
    icon_path: String,
    file_path: String,
    command: String,
}

pub struct SearchDatabase<'a> {
    config: Config,
    store: Store,
    bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    folder_path: PathBuf,
}

impl SearchDatabaseItem {
    fn new(
        name: String,
        item_type: String,
        icon_path: String,
        file_path: String,
        command: String,
    ) -> Self {
        Self {
            name,
            item_type,
            icon_path,
            file_path,
            command,
        }
    }

    pub fn newApplication(name: String, icon_path: String, file_path: String) -> Self {
        Self {
            name,
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
            PathBuf::from("./tests/database/search_database")
        } else {
            get_project_dir()
                .unwrap()
                .data_dir()
                .join("search_database")
        };
        // dbg!(&db_path);
        let db_cfg = Config::new(db_path.clone());
        let db_store = Store::new(db_cfg.clone()).unwrap();
        let db_bucket: Bucket<String, Json<SearchDatabaseItem>> =
            db_store.bucket(Some("search")).unwrap();
        Self {
            config: db_cfg,
            store: db_store,
            bucket: db_bucket,
            folder_path: db_path,
        }
    }
}

pub fn save_database() {}

#[cfg(test)]
mod tests {
    use super::SearchDatabase;
    use super::SearchDatabaseItem;
    use kv::Json;
    use uuid::Uuid;
    #[test]
    fn search_database_test() {
        let db = SearchDatabase::init(true);

        let appname_0 = "AfterEffects".to_string();
        let appdata_0 = SearchDatabaseItem::newApplication(
            appname_0.clone(),
            "./icons/ae.png".to_string(),
            "./tests/data/ae.exe".to_string(),
        );
        let key_0 = appname_0;
        let value_0 = Json(appdata_0);
        db.bucket.set(&key_0, &value_0);
        for item in db.bucket.iter() {
            let item_i = item.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            dbg!(&key_i, &value_i.0);
            assert_eq!(key_0, key_i);
        }
    }
}
