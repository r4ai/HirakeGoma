use crate::core::db::kv_store::SearchDatabaseItem;
use crate::core::utils::path::get_project_dir;
use crate::core::utils::result::{CommandError, CommandResult};
use anyhow::Context;
use kv::{Bucket, Config, Json, Store};
use std::{collections::HashMap, path::PathBuf};
use tauri::{AppHandle, Manager, State};

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct Theme {
    pub mode: String,
    pub activated: bool,
    pub colors: ThemeColors,
    pub fonts: ThemeFonts,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct ThemeColors {
    accentColor: String,
    textColor: String,
    descriptionTextColor: String,
    lineColor: String,
    backgroundColor: String,
    inputBoxBackgroundColor: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct ThemeFonts {
    inputBoxFont: String,
    titleFont: String,
    descriptionFont: String,
    codeFont: String,
}

pub struct ThemeState<'a> {
    pub config: Config,
    pub store: Store,
    pub bucket: Bucket<'a, String, Json<Theme>>,
    pub folder_path: PathBuf,
}

impl Theme {
    pub fn new(mode: String, colors: ThemeColors, fonts: ThemeFonts) -> Self {
        Self {
            mode,
            activated: false,
            colors,
            fonts,
        }
    }
}

impl ThemeState<'_> {
    fn init_default_theme(&self) -> CommandResult<()> {
        let carbon_theme = Theme::new(
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

        let paper_theme = Theme::new(
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

        self.insert("carbon".into(), carbon_theme)?;
        self.insert("paper".into(), paper_theme)?;

        Ok(())
    }

    pub fn init() -> Self {
        let db_path = get_project_dir()
            .unwrap()
            .data_dir()
            .join("setting")
            .join("theme");
        let db_cfg = Config::new(db_path.clone());
        let db_store = Store::new(db_cfg.clone()).expect("Failed to create store");
        let db_bucket: Bucket<String, Json<Theme>> = db_store.bucket(Some("theme")).unwrap();
        let res = Self {
            config: db_cfg,
            store: db_store,
            bucket: db_bucket,
            folder_path: db_path,
        };
        res.init_default_theme()
            .expect("Failed to load default themes.");
        res
    }

    pub fn insert(&self, key: String, value: Theme) -> CommandResult<()> {
        self.bucket.set(&key, &Json(value))?;
        Ok(())
    }

    pub fn remove(&self, key: String) -> CommandResult<()> {
        self.bucket.remove(&key)?;
        Ok(())
    }

    pub fn get(&self, key: &String) -> CommandResult<Option<Theme>> {
        let result: Option<Theme> = match self.bucket.get(key)? {
            None => None,
            Some(value) => Some(value.0),
        };
        Ok(result)
    }

    pub fn get_all(&self) -> CommandResult<HashMap<String, Theme>> {
        let mut result: HashMap<String, Theme> = HashMap::new();
        for item_i in self.bucket.iter() {
            let item_i = item_i?;
            let key_i: String = item_i.key()?;
            let value_i: Json<Theme> = item_i.value()?;
            result.insert(key_i, value_i.0);
        }
        Ok(result)
    }

    pub fn change(&self, key: String, value: Theme) -> CommandResult<()> {
        // TODO: 過去のvalueと新しく置き換えるvalueを比較し、差分のみをDBに反映させる
        let pre_value: Theme = match self.get(&key)? {
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

#[tauri::command]
pub fn setting_theme_create(db: State<'_, ThemeState>, key: String) -> CommandResult<()> {
    let mode = "dark".into();
    let colors = ThemeColors {
        accentColor: "#e0e0e0".into(),
        textColor: "#ededed".into(),
        descriptionTextColor: "#c9c9c9".into(),
        lineColor: "#00000000".into(),
        backgroundColor: "#0f0f0f".into(),
        inputBoxBackgroundColor: "#0d0d0d".into(),
    };
    let fonts = ThemeFonts {
        inputBoxFont: "".into(),
        titleFont: "".into(),
        descriptionFont: "".into(),
        codeFont: "".into(),
    };
    let value = Theme::new(mode, colors, fonts);
    db.insert(key, value)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_remove(db: State<'_, ThemeState>, key: String) -> CommandResult<()> {
    db.remove(key)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_get(db: State<'_, ThemeState>, key: String) -> CommandResult<Option<Theme>> {
    db.get(&key)
}

#[tauri::command]
pub fn setting_theme_get_all(db: State<'_, ThemeState>) -> CommandResult<HashMap<String, Theme>> {
    db.get_all()
}

#[tauri::command]
pub fn setting_theme_change(
    db: State<'_, ThemeState>,
    key: String,
    value: Theme,
) -> CommandResult<()> {
    db.change(key, value)
}

#[tauri::command]
pub fn setting_theme_activate(
    db: State<'_, ThemeState>,
    app: AppHandle,
    key: String,
) -> CommandResult<()> {
    // * DEACTIVATE CURRENT THEME
    for item_i in db.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<Theme> = item_i.value()?;
        let value_i: Theme = value_json_i.0;
        if value_i.activated {
            let new_value_i = Theme {
                activated: false,
                ..value_i
            };
            let _ = db.change(key_i, new_value_i);
        }
    }

    // * ACTIVATE NEW THEME
    let value: Theme = match db.get(&key)? {
        None => {
            return Err(CommandError::KvError(kv::Error::Message(String::from(
                "Failed to find the item associated to the key.",
            ))))
        }
        Some(res) => Theme {
            activated: true,
            ..res
        },
    };
    db.change(key.clone(), value)?;

    // * EMIT THEME_ACTIVATED EVENT
    #[derive(Clone, serde::Serialize)]
    #[serde(rename_all = "camelCase")]
    struct Payload {
        activated_theme: String,
    }
    app.emit_all(
        "theme_activated",
        Payload {
            activated_theme: key,
        },
    )
    .unwrap();

    Ok(())
}

#[tauri::command]
pub fn setting_theme_get_activated(db: State<'_, ThemeState>) -> CommandResult<Option<Theme>> {
    for item_i in db.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<Theme> = item_i.value()?;
        let value_i: Theme = value_json_i.0;
        if value_i.activated {
            return db.get(&key_i);
        }
    }
    Ok(None)
}
