use crate::core::utils::path::_get_project_dir;
use kv::{Config, Store};
use std::fs;
use std::path::PathBuf;

pub struct PluginStore {
    pub config: Config,
    pub store: Store,
    pub path: PathBuf,
}

impl PluginStore {
    pub fn init(is_test: bool) -> Self {
        let config_path = if is_test {
            let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("tests")
                .join("resources")
                .join("database")
                .join("plugin");
            let _ = fs::remove_dir_all(&path);
            path
        } else {
            _get_project_dir().unwrap().data_dir().join("plugin")
        };
        dbg!(&config_path);
        let config = Config::new(config_path.clone());
        // dbg!(&db_cfg);
        let store = Store::new(config.clone()).expect("Failed to create plugin store");
        // dbg!(&db_store);
        Self {
            config,
            store,
            path: config_path,
        }
    }
}
