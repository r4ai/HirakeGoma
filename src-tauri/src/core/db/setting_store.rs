use crate::core::utils::path::_get_project_dir;
use crate::core::utils::result::CommandResult;
use kv::{Config, Store};
use log::debug;
use std::fs;
use std::path::PathBuf;

pub struct SettingStore {
    pub config: Config,
    pub store: Store,
    pub path: PathBuf,
}

impl SettingStore {
    pub fn init(is_test: bool) -> Self {
        let config_path = if is_test {
            let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("tests")
                .join("resources")
                .join("database")
                .join("setting");
            let _ = fs::remove_dir_all(&path);
            path
        } else {
            _get_project_dir().unwrap().data_dir().join("setting")
        };
        debug!(
            "SettingStore's config_path: {}",
            &config_path
                .to_str()
                .unwrap_or("Failed to translate config_path(&PathBuf) to &str.")
        );
        let config = Config::new(config_path.clone());
        let store = Store::new(config.clone()).expect("Failed to create setting store");
        Self {
            config,
            store,
            path: config_path,
        }
    }
}
