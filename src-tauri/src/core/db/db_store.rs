use crate::core::utils::path::get_project_dir;
use fuzzy_matcher::skim::SkimMatcherV2;
use fuzzy_matcher::FuzzyMatcher;
use kv::{Bucket, Config, Json, Store};
use std::collections::HashMap;
use std::vec;
use std::{fmt::Debug, fs, path::PathBuf};

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct DbItem {
    pub name: String,
    pub score: i64,
    pub item_type: String,
    pub icon_path: String,
    pub file_path: String,
    pub command: String,
}

pub struct DbStore<'a> {
    pub config: Config,
    pub store: Store,
    pub bucket: Bucket<'a, String, Json<DbItem>>,
    pub folder_path: PathBuf,
}

impl DbItem {
    fn new(
        name: String,
        score: i64,
        item_type: String,
        icon_path: String,
        file_path: String,
        command: String,
    ) -> Self {
        Self {
            name,
            score,
            item_type,
            icon_path,
            file_path,
            command,
        }
    }

    pub fn newApplication(name: String, icon_path: String, file_path: String) -> Self {
        Self {
            name,
            score: 0,
            icon_path,
            file_path,
            item_type: String::from("Application"),
            command: String::from(""),
        }
    }
}
