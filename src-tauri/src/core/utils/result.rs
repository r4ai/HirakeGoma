use serde::{Serialize, Serializer};
use walkdir;

#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    Kv(#[from] kv::Error),

    #[error(transparent)]
    Walkdir(#[from] walkdir::Error),

    #[error(transparent)]
    TauriApi(#[from] tauri::api::Error),

    #[error(transparent)]
    TauriRuntime(#[from] tauri_runtime::Error),

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    PowerShell(#[from] powershell_script::PsError),

    #[error("Failed to parse `{0}`.")]
    Lnk(String),

    #[error(transparent)]
    ProjectDir(#[from] super::path::ProjectDirError),

    #[error(transparent)]
    Db(#[from] crate::core::commands::search_db_command::DbError),
}

impl Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type CommandResult<T, E = CommandError> = anyhow::Result<T, E>;
