use crate::core::utils::path::get_project_dir;
use crate::core::utils::result::CommandResult;
use kv::{Bucket, Config, Json, Store};
use std::{collections::HashMap, path::PathBuf};
use tauri::{Manager, State};

#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct Theme {
    pub mode: String,
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
pub fn setting_theme_get_all(db: State<'_, ThemeState>) -> CommandResult<HashMap<String, Theme>> {
    db.get_all()
}
