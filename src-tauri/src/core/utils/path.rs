use directories::ProjectDirs;
use serde_json::Value;
use std::path::{Path, PathBuf};
use std::{env, fs};
use tauri::AppHandle;

use super::result::{CommandError, CommandResult};

/// Ex.
/// - Windows: C:\Users\USERNAME\AppData\Roaming\HirakeGoma\hirake_goma
/// - Linux: /home/alice/.config/hirake_goma
/// - MacOS: /Users/Alice/Library/Application Support/com.HirakeGoma.hirake_goma
pub fn _get_project_dir() -> Option<ProjectDirs> {
    ProjectDirs::from("com", "HirakeGoma", "hirake_goma")
}

pub fn get_project_data_dir() -> Result<PathBuf, ProjectDirError> {
    match _get_project_dir() {
        Some(p) => Ok(p.data_dir().to_path_buf()),
        None => Err(ProjectDirError::GetDataDir()),
    }
}

pub fn get_project_data_icons_dir() -> Result<PathBuf, ProjectDirError> {
    match get_project_data_dir() {
        Ok(p) => {
            let path = p.join("icons");
            if path.exists() {
                return Ok(path);
            } else {
                match fs::create_dir(&path) {
                    Ok(_) => return Ok(path),
                    Err(_) => return Err(ProjectDirError::GetIconsDir()),
                }
            }
        }
        Err(e) => Err(e),
    }
}

pub fn get_plugin_dir() -> Result<PathBuf, ProjectDirError> {
    match _get_project_dir() {
        Some(p) => Ok(p.config_dir().join("plugins")),
        None => Err(ProjectDirError::GetProjectDir()),
    }
}

pub fn get_cargo_toml_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
}

pub fn get_error_icon_path(app: AppHandle) -> PathBuf {
    app.path_resolver()
        .resolve_resource("resources/error_file.svg")
        .expect("Failed to resolve `resources/error_file.svg`.")
}

pub fn get_default_file_icon_path(app: AppHandle) -> PathBuf {
    app.path_resolver()
        .resolve_resource("resources/default_file.svg")
        .expect("Failed to resolve `resources/default_file.svg`.")
}

pub fn parse_json(path: PathBuf) -> CommandResult<Value> {
    let file = fs::File::open(path)?;
    let reader = std::io::BufReader::new(file);
    let v: Value = serde_json::from_reader(reader)?;
    Ok(v)
}

#[derive(Debug, thiserror::Error)]
pub enum ProjectDirError {
    #[error("Failed to get project dir.")]
    GetProjectDir(),

    #[error("Failed to get data dir.")]
    GetDataDir(),

    #[error("Failed to get icons dir.")]
    GetIconsDir(),
}
