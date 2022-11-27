use crate::core::utils::{path::_get_project_dir, result::CommandResult};
use fuzzy_matcher::{skim::SkimMatcherV2, FuzzyMatcher};
use kv::{Bucket, Config, Json, Store};
use log::{debug, info};
use std::{collections::HashMap, fmt::Debug, fs, path::PathBuf, vec};
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
    pub command_args: HashMap<String, String>,
    pub alias: Vec<String>,
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
        command_args: HashMap<String, String>,
        alias: Vec<String>,
    ) -> Self {
        Self {
            name,
            description,
            score,
            item_type,
            icon_path,
            path,
            command,
            command_args,
            alias,
        }
    }

    pub fn new_app(name: String, icon_path: String, file_path: String) -> Self {
        Self {
            name,
            description: file_path.clone(),
            score: 0,
            icon_path,
            path: file_path.clone(),
            item_type: String::from("Application"),
            command: String::from("plugin_appsearch_open"),
            command_args: vec![(String::from("path"), file_path)]
                .into_iter()
                .collect::<HashMap<String, String>>(),
            alias: vec![],
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
            _get_project_dir()
                .unwrap()
                .data_dir()
                .join("search_database")
        };
        info!(
            "config_path of SearchDatabaseStore: {}",
            &config_path.display()
        );
        let config = Config::new(config_path.clone());
        let store = Store::new(config.clone()).expect("Failed to create store");
        Self {
            config,
            store,
            path: config_path,
        }
    }
}

pub trait SearchDatabaseTable<
    'a,
    S: Send + Sync + 'static,
    I: serde::Serialize + serde::de::DeserializeOwned + Clone + Debug,
>
{
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<I>>;

    fn access_to_name(&self) -> &String;

    fn init(store: State<'_, S>) -> Self;

    fn insert(&self, key: String, value: I) -> CommandResult<()> {
        let json_value = Json(value);
        debug!("Set `{}` key to the {}.", &key, &self.access_to_name());
        self.access_to_bucket().set(&key, &json_value)?;
        Ok(())
    }

    /// If given key has already exist, change the value. If not, insert new item.
    fn change(&self, key: String, value: I) -> CommandResult<()> {
        let is_exist = self.access_to_bucket().contains(&key)?;
        let json_value = Json(value);
        if is_exist {
            debug!("Remove `{}` key from the {}.", &key, &self.access_to_name());
            self.access_to_bucket().remove(&key)?;
            debug!("Set `{}` key to the {}.", &key, &self.access_to_name());
            self.access_to_bucket().set(&key, &json_value)?;
        } else {
            debug!("Set `{}` key to the {}.", &key, &self.access_to_name());
            self.access_to_bucket().set(&key, &json_value)?;
        };
        Ok(())
    }

    fn get(&self, key: &String) -> CommandResult<I> {
        debug!(
            "Get value corresponding to `{}` key in the {}.",
            &key,
            &self.access_to_name()
        );
        let res = self.access_to_bucket().get(key)?.unwrap().0;
        Ok(res)
    }

    fn clear(&self) -> CommandResult<()> {
        debug!("Remove all items in the {}.", self.access_to_name());
        self.access_to_bucket().clear()?;
        Ok(())
    }

    fn print_all_items(&self) {
        debug!("Print all items in the {}.", self.access_to_name());
        for item_i in self.access_to_bucket().iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            dbg!(&key_i);
            let value_i: Json<I> = item_i.value().unwrap();
            dbg!(&value_i.0);
        }
    }

    fn get_all_items(&self) -> CommandResult<HashMap<String, I>> {
        debug!("Get all items in the {}.", self.access_to_name());
        let mut result: HashMap<String, I> = HashMap::new();
        for item_i in self.access_to_bucket().iter() {
            let item_i = item_i?;
            let key_i: String = item_i.key()?;
            let value_i: Json<I> = item_i.value()?;
            result.insert(key_i, value_i.0);
        }
        Ok(result)
    }

    fn save(&self) -> CommandResult<()> {
        debug!("Save {}.", self.access_to_name());
        self.access_to_bucket().flush()?;
        Ok(())
    }
}

pub trait DbSearchTrait {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>>;

    fn access_to_name(&self) -> &String;

    fn search(&self, keyword: &str, min_score: i64) -> Vec<SearchDatabaseItem> {
        debug!("Search {} in {}", keyword, self.access_to_name());
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
}
