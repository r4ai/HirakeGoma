use std::collections::HashMap;

use kv::Bucket;
use tauri::State;

use crate::core::utils::result::{CommandError, CommandResult};

use super::setting_store::SettingStore;

pub struct SettingTableHotkey<'a> {
    pub bucket: Bucket<'a, String, String>,
}

impl SettingTableHotkey<'_> {
    fn init_default_hotkey(&self) -> CommandResult<()> {
        let default_hotkeys = vec![(
            "open_main_window".to_string(),
            "CommandOrControl+Space".to_string(),
        )]
        .into_iter()
        .collect::<HashMap<String, String>>();

        for hotkey_item in default_hotkeys {
            if !self.exists(&hotkey_item.0)? {
                self.insert(hotkey_item.0, hotkey_item.1)?;
            }
        }
        Ok(())
    }

    pub fn init(store: State<'_, SettingStore>) -> Self {
        let bucket: Bucket<String, String> = store.store.bucket(Some("hotkey")).unwrap();
        let res = Self { bucket };
        res.init_default_hotkey();
        res
    }

    pub fn exists(&self, key: &String) -> CommandResult<bool> {
        match self.bucket.contains(key) {
            Ok(res) => Ok(res),
            Err(e) => Err(CommandError::KvError(e)),
        }
    }

    pub fn insert(&self, key: String, value: String) -> CommandResult<()> {
        self.bucket.set(&key, &value)?;
        Ok(())
    }

    pub fn remove(&self, key: String) -> CommandResult<()> {
        self.bucket.remove(&key)?;
        Ok(())
    }

    pub fn get(&self, key: &String) -> CommandResult<Option<String>> {
        let result: Option<String> = match self.bucket.get(key)? {
            None => None,
            Some(value) => Some(value),
        };
        Ok(result)
    }

    pub fn get_all(&self) -> CommandResult<HashMap<String, String>> {
        let mut result: HashMap<String, String> = HashMap::new();
        for item_i in self.bucket.iter() {
            let item_i = item_i?;
            let key_i: String = item_i.key()?;
            let value_i: String = item_i.value()?;
            result.insert(key_i, value_i);
        }
        Ok(result)
    }

    pub fn save(&self) -> CommandResult<()> {
        self.bucket.flush()?;
        Ok(())
    }

    pub fn change(&self, key: String, value: String) -> CommandResult<()> {
        let pre_value: String = match self.get(&key)? {
            None => {
                return Err(CommandError::KvError(kv::Error::Message(String::from(
                    "Failed to find the item associated to the key.",
                ))))
            }
            Some(res) => res,
        };
        self.bucket.set(&key, &value);
        Ok(())
    }
}
