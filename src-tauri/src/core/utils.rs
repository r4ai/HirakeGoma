use directories::ProjectDirs;
use std::path::Path;

pub fn get_project_dir() -> Option<ProjectDirs> {
    ProjectDirs::from("com", "HirakeGoma", "hirake_goma")
}
