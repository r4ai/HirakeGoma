use directories::ProjectDirs;
use std::path::{Path, PathBuf};
use std::{env, fs};

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

pub fn get_cargo_toml_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
}

pub fn get_error_icon_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("icon.ico")
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
