use super::theme_store::{Theme, ThemeColors, ThemeFonts, ThemeStore};
use crate::core::utils::result::{CommandError, CommandResult};
use kv::Json;
use std::collections::HashMap;
use tauri::{Manager, State};

#[tauri::command]
pub fn setting_theme_create(db: State<'_, ThemeStore>, key: String) -> CommandResult<()> {
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
pub fn setting_theme_remove(db: State<'_, ThemeStore>, key: String) -> CommandResult<()> {
    db.remove(key)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_get(db: State<'_, ThemeStore>, key: String) -> CommandResult<Option<Theme>> {
    db.get(&key)
}

#[tauri::command]
pub fn setting_theme_get_all(db: State<'_, ThemeStore>) -> CommandResult<HashMap<String, Theme>> {
    db.get_all()
}

#[tauri::command]
pub fn setting_theme_change(
    db: State<'_, ThemeStore>,
    key: String,
    value: Theme,
) -> CommandResult<()> {
    db.change(key, value)
}

#[tauri::command]
pub fn setting_theme_activate(
    db: State<'_, ThemeStore>,
    app: tauri::AppHandle,
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
pub fn setting_theme_get_activated(db: State<'_, ThemeStore>) -> CommandResult<Option<String>> {
    for item_i in db.bucket.iter() {
        let item_i = item_i?;
        let key_i: String = item_i.key()?;
        let value_json_i: Json<Theme> = item_i.value()?;
        let value_i: Theme = value_json_i.0;
        if value_i.activated {
            return Ok(Some(key_i));
        }
    }
    Ok(None)
}

#[tauri::command]
pub fn setting_theme_save(db: State<'_, ThemeStore>) -> CommandResult<()> {
    db.save()?;
    Ok(())
}
