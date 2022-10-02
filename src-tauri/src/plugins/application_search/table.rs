use crate::{
    core::utils::result::{CommandError, CommandResult},
    plugins::plugin_store::PluginStore,
};
use kv::{Bucket, Json};
use std::collections::HashMap;
use tauri::State;

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub enum PluginAppsearchItem {
    FolderPaths(Vec<String>),
}

pub struct PluginAppsearchTable<'a> {
    pub bucket: Bucket<'a, String, Json<PluginAppsearchItem>>,
}

impl PluginAppsearchTable<'_> {
    pub fn init(store: State<'_, PluginStore>) -> Self {
        let bucket: Bucket<String, Json<PluginAppsearchItem>> =
            store.store.bucket(Some("appsearch")).unwrap();
        Self { bucket }
    }

    pub fn get_all(&self) -> CommandResult<HashMap<String, PluginAppsearchItem>> {
        let mut result: HashMap<String, PluginAppsearchItem> = HashMap::new();
        for item_i in self.bucket.iter() {
            let item_i = item_i?;
            let key_i: String = item_i.key()?;
            let value_i: Json<PluginAppsearchItem> = item_i.value()?;
            result.insert(key_i, value_i.0);
        }
        Ok(result)
    }

    pub fn print_all_items(&self) {
        for item_i in self.bucket.iter() {
            let item_i = item_i.unwrap();
            let key_i: String = item_i.key().unwrap();
            let value_i: Json<PluginAppsearchItem> = item_i.value().unwrap();
            dbg!(&key_i, &value_i.0);
        }
    }

    pub fn save(&self) -> CommandResult<()> {
        self.bucket.flush()?;
        Ok(())
    }
}
