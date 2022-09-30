use crate::core::utils::path::get_project_dir;
use kv::{Config, Store};
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
            get_project_dir().unwrap().data_dir().join("setting")
        };
        dbg!(&config_path);
        let config = Config::new(config_path.clone());
        // dbg!(&db_cfg);
        let store = Store::new(config.clone()).expect("Failed to create setting store");
        // dbg!(&db_store);
        Self {
            config,
            store,
            path: config_path,
        }
    }
}
