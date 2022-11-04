use super::theme_table::{SettingThemeTable, ThemeColors, ThemeFonts, ThemeItem};
use crate::core::utils::result::{CommandError, CommandResult};
use kv::Json;
use std::collections::HashMap;
use tauri::{Manager, State};

#[tauri::command]
pub fn setting_theme_create(db: State<'_, SettingThemeTable>, key: String) -> CommandResult<()> {
    let mode = "dark".into();
    let colors = ThemeColors {
        accentColor: "#e0e0e0".into(),
        textColor: "#ededed".into(),
        descriptionTextColor: "#c9c9c9".into(),
        lineColor: "#00000000".into(),
        backgroundColor: "#0f0f0f".into(),
        backgroundTransparency: 0.7,
        inputBoxBackgroundColor: "#0d0d0d".into(),
        inputBoxBackgroundTransparency: 0.7,
    };
    let fonts = ThemeFonts {
        inputBoxFont: "".into(),
        titleFont: "".into(),
        descriptionFont: "".into(),
        codeFont: "".into(),
    };
    let value = ThemeItem::new(mode, colors, fonts);
    db.insert(key, value)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_remove(db: State<'_, SettingThemeTable>, key: String) -> CommandResult<()> {
    db.remove(key)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_get(
    db: State<'_, SettingThemeTable>,
    key: String,
) -> CommandResult<Option<ThemeItem>> {
    db.get(&key)
}

#[tauri::command]
pub fn setting_theme_get_all(
    db: State<'_, SettingThemeTable>,
) -> CommandResult<HashMap<String, ThemeItem>> {
    db.get_all()
}

#[tauri::command]
pub fn setting_theme_change(
    db: State<'_, SettingThemeTable>,
    key: String,
    value: ThemeItem,
) -> CommandResult<()> {
    db.change(key, value)
}

#[tauri::command]
pub fn setting_theme_activate(
    db: State<'_, SettingThemeTable>,
    app: tauri::AppHandle,
    key: String,
) -> CommandResult<()> {
    // * DEACTIVATE CURRENT THEME
    for item_i in db.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<ThemeItem> = item_i.value()?;
        let value_i: ThemeItem = value_json_i.0;
        if value_i.activated {
            let new_value_i = ThemeItem {
                activated: false,
                ..value_i
            };
            let _ = db.change(key_i, new_value_i);
        }
    }

    // * ACTIVATE NEW THEME
    let value: ThemeItem = match db.get(&key)? {
        None => {
            return Err(CommandError::KvError(kv::Error::Message(String::from(
                "Failed to find the item associated to the key.",
            ))))
        }
        Some(res) => ThemeItem {
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
pub fn setting_theme_get_activated(
    db: State<'_, SettingThemeTable>,
) -> CommandResult<Option<String>> {
    for item_i in db.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<ThemeItem> = item_i.value()?;
        let value_i: ThemeItem = value_json_i.0;
        if value_i.activated {
            return Ok(Some(key_i));
        }
    }
    Ok(None)
}

#[tauri::command]
pub fn setting_theme_save(db: State<'_, SettingThemeTable>) -> CommandResult<()> {
    db.save()?;
    Ok(())
}
