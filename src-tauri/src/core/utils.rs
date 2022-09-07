use directories::ProjectDirs;
use std::env;
use std::path::{Path, PathBuf};

pub fn get_project_dir() -> Option<ProjectDirs> {
    ProjectDirs::from("com", "HirakeGoma", "hirake_goma")
}

pub fn get_cargo_toml_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
}

pub fn get_error_icon_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("icon.ico")
}
