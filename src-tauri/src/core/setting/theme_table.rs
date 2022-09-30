use super::setting_store::SettingStore;
use crate::core::utils::result::{CommandError, CommandResult};
use kv::{Bucket, Json};
use std::collections::HashMap;
use tauri::State;

pub struct SettingThemeTable<'a> {
    pub bucket: Bucket<'a, String, Json<ThemeItem>>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct ThemeItem {
    pub mode: String,
    pub activated: bool,
    pub colors: ThemeColors,
    pub fonts: ThemeFonts,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct ThemeColors {
    pub accentColor: String,
    pub textColor: String,
    pub descriptionTextColor: String,
    pub lineColor: String,
    pub backgroundColor: String,
    pub inputBoxBackgroundColor: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct ThemeFonts {
    pub inputBoxFont: String,
    pub titleFont: String,
    pub descriptionFont: String,
    pub codeFont: String,
}

impl ThemeItem {
    pub fn new(mode: String, colors: ThemeColors, fonts: ThemeFonts) -> Self {
        Self {
            mode,
            activated: false,
            colors,
            fonts,
        }
    }
}

impl SettingThemeTable<'_> {
    fn init_default_theme(&self) -> CommandResult<()> {
        let mut default_theme_list = HashMap::new();

        let carbon_theme = ThemeItem::new(
            "dark".into(),
            ThemeColors {
                accentColor: "#e0e0e0".into(),
                textColor: "#ededed".into(),
                descriptionTextColor: "#c9c9c9".into(),
                lineColor: "#00000000".into(),
                backgroundColor: "#0f0f0f".into(),
                inputBoxBackgroundColor: "#0d0d0d".into(),
            },
            ThemeFonts {
                inputBoxFont: "".into(),
                titleFont: "".into(),
                descriptionFont: "".into(),
                codeFont: "".into(),
            },
        );
        default_theme_list.insert("carbon".to_string(), carbon_theme);

        let paper_theme = ThemeItem::new(
            "light".into(),
            ThemeColors {
                accentColor: "#e0e0e0".into(),
                textColor: "#121212".into(),
                descriptionTextColor: "#1c1c1c".into(),
                lineColor: "#00000000".into(),
                backgroundColor: "#f2f2f2".into(),
                inputBoxBackgroundColor: "#e3e3e3".into(),
            },
            ThemeFonts {
                inputBoxFont: "".into(),
                titleFont: "".into(),
                descriptionFont: "".into(),
                codeFont: "".into(),
            },
        );
        default_theme_list.insert("paper".to_string(), paper_theme);

        dbg!(self.get_all());
        for theme_item in default_theme_list {
            if !self.exists(&theme_item.0)? {
                self.insert(theme_item.0, theme_item.1)?;
            }
        }

        Ok(())
    }

    pub fn init(store: State<'_, SettingStore>) -> Self {
        let bucket: Bucket<String, Json<ThemeItem>> = store.store.bucket(Some("theme")).unwrap();
        let res = Self { bucket };
        res.init_default_theme();
        res
    }

    pub fn exists(&self, key: &String) -> CommandResult<bool> {
        match self.bucket.contains(key) {
            Ok(res) => Ok(res),
            Err(e) => Err(CommandError::KvError(e)),
        }
    }

    pub fn insert(&self, key: String, value: ThemeItem) -> CommandResult<()> {
        self.bucket.set(&key, &Json(value))?;
        Ok(())
    }

    pub fn remove(&self, key: String) -> CommandResult<()> {
        self.bucket.remove(&key)?;
        Ok(())
    }

    pub fn get(&self, key: &String) -> CommandResult<Option<ThemeItem>> {
        let result: Option<ThemeItem> = match self.bucket.get(key)? {
            None => None,
            Some(value) => Some(value.0),
        };
        Ok(result)
    }

    pub fn get_all(&self) -> CommandResult<HashMap<String, ThemeItem>> {
        let mut result: HashMap<String, ThemeItem> = HashMap::new();
        for item_i in self.bucket.iter() {
            let item_i = item_i?;
            let key_i: String = item_i.key()?;
            let value_i: Json<ThemeItem> = item_i.value()?;
            result.insert(key_i, value_i.0);
        }
        Ok(result)
    }

    pub fn save(&self) -> CommandResult<()> {
        self.bucket.flush()?;
        Ok(())
    }

    pub fn change(&self, key: String, value: ThemeItem) -> CommandResult<()> {
        // TODO: 過去のvalueと新しく置き換えるvalueを比較し、差分のみをDBに反映させる
        let pre_value: ThemeItem = match self.get(&key)? {
            None => {
                return Err(CommandError::KvError(kv::Error::Message(String::from(
                    "Failed to find the item associated to the key.",
                ))))
            }
            Some(res) => res,
        };
        self.bucket.set(&key, &Json(value));
        Ok(())
    }
}
