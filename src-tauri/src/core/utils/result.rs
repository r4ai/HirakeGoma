use std::error;

use serde::{Serialize, Serializer};
use walkdir;

#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    KvError(#[from] kv::Error),

    #[error(transparent)]
    WalkdirError(#[from] walkdir::Error),

    #[error(transparent)]
    TauriError(#[from] tauri::api::Error),

    #[error(transparent)]
    WindowsError(#[from] windows::core::Error),

    #[error(transparent)]
    IoError(#[from] std::io::Error),
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
