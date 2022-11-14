use crate::core::utils::{path::get_project_dir, result::CommandResult};
use fuzzy_matcher::{skim::SkimMatcherV2, FuzzyMatcher};
use kv::{Bucket, Config, Json, Store};
use std::{collections::HashMap, fmt::Debug, fs, path::PathBuf};
use tauri::State;

pub struct SearchDatabaseStore {
    pub config: Config,
    pub store: Store,
    // pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    pub path: PathBuf,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct SearchDatabaseItem {
    pub name: String,
    pub description: String,
    pub score: i64,
    pub item_type: String,
    pub icon_path: String,
    pub path: String,
    pub command: String,
}

impl SearchDatabaseItem {
    fn new(
        name: String,
        description: String,
        score: i64,
        item_type: String,
        icon_path: String,
        path: String,
        command: String,
    ) -> Self {
        Self {
            name,
            description,
            score,
            item_type,
            icon_path,
            path,
            command,
        }
    }

    pub fn new_app(name: String, icon_path: String, file_path: String) -> Self {
        Self {
            name,
            description: file_path.clone(),
            score: 0,
            icon_path,
            path: file_path,
            item_type: String::from("Application"),
            command: String::from(""),
        }
    }
}

impl SearchDatabaseStore {
    pub fn init(is_test: bool) -> Self {
        let config_path = if is_test {
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
        dbg!(&config_path);
        let config = Config::new(config_path.clone());
        // dbg!(&db_cfg);
        let store = Store::new(config.clone()).expect("Failed to create store");
        // dbg!(&db_store);
        Self {
            config,
            store,
            path: config_path,
        }
    }
}

pub trait SearchDatabaseTable<'a> {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>>;

    fn init(store: State<'_, SearchDatabaseStore>) -> Self;

    fn insert(&self, key: String, value: SearchDatabaseItem) -> Result<(), kv::Error> {
        let json_value = Json(value);
        self.access_to_bucket().set(&key, &json_value)?;
        Ok(())
    }

    fn get(&self, key: &String) -> Result<SearchDatabaseItem, kv::Error> {
        let res = self.access_to_bucket().get(key)?.unwrap().0;
        Ok(res)
    }

    fn clear(&self) -> Result<(), kv::Error> {
        self.access_to_bucket().clear()
    }

    fn print_all_items(&self) {
        dbg!("START PRINTING ALL ITEMS");
        for item_i in self.access_to_bucket().iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            dbg!(&key_i, &value_i.0);
        }
    }

    fn get_all_items(&self) -> HashMap<String, SearchDatabaseItem> {
        let mut result: HashMap<String, SearchDatabaseItem> = HashMap::new();
        for item_i in self.access_to_bucket().iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            result.insert(key_i, value_i.0);
        }
        result
    }

    fn search(&self, keyword: &String, min_score: i64) -> Vec<SearchDatabaseItem> {
        let mut result: Vec<SearchDatabaseItem> = vec![];
        let matcher = SkimMatcherV2::default();
        for item_i in self.access_to_bucket().iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<SearchDatabaseItem> = item_i.value().unwrap();
            let mut value_i = value_i.0;
            let score = matcher.fuzzy_match(key_i.as_str(), keyword).unwrap_or(0);
            value_i.score = score;
            if score >= min_score {
                let res_len = result.len();
                if res_len == 0 {
                    result.push(value_i);
                    continue;
                }
                for (i, res_item_i) in result.iter().enumerate() {
                    let res_item_i_score = res_item_i.score;
                    if score > res_item_i_score {
                        result.insert(i, value_i);
                        break;
                    } else if i == res_len - 1 {
                        result.push(value_i);
                        break;
                    }
                }
            }
        }
        result
    }

    fn save(&self) -> CommandResult<()> {
        self.access_to_bucket().flush()?;
        Ok(())
    }
}
