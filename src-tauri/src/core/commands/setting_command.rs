use crate::core::commands::core_command::core_window_toggle_visibility;
use crate::core::db::setting_table_hotkey::SettingTableHotkey;
use crate::core::db::setting_table_theme::{SettingTableTheme, ThemeColors, ThemeFonts, ThemeItem};
use crate::core::utils::result::{CommandError, CommandResult};
use kv::Json;
use std::collections::HashMap;
use tauri::{AppHandle, GlobalShortcutManager, Manager, State};

// * THEME COMMANDS

#[tauri::command]
pub fn setting_theme_create(db: State<'_, SettingTableTheme>, key: String) -> CommandResult<()> {
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
pub fn setting_theme_remove(db: State<'_, SettingTableTheme>, key: String) -> CommandResult<()> {
    db.remove(key)?;
    Ok(())
}

#[tauri::command]
pub fn setting_theme_get(
    db: State<'_, SettingTableTheme>,
    key: String,
) -> CommandResult<Option<ThemeItem>> {
    db.get(&key)
}

#[tauri::command]
pub fn setting_theme_get_all(
    db: State<'_, SettingTableTheme>,
) -> CommandResult<HashMap<String, ThemeItem>> {
    db.get_all()
}

#[tauri::command]
pub fn setting_theme_change(
    db: State<'_, SettingTableTheme>,
    key: String,
    value: ThemeItem,
) -> CommandResult<()> {
    db.change(key, value)
}

#[tauri::command]
pub fn setting_theme_activate(
    db: State<'_, SettingTableTheme>,
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
    db: State<'_, SettingTableTheme>,
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
pub fn setting_theme_save(db: State<'_, SettingTableTheme>) -> CommandResult<()> {
    db.save()?;
    Ok(())
}

// * HOTKEY COMMANDS

/// Register all shortcuts in SettingTableHotkey.
#[tauri::command]
pub fn setting_hotkey_update(
    app_handle: AppHandle,
    db: State<'_, SettingTableHotkey>,
) -> CommandResult<()> {
    let mut gsm = app_handle.global_shortcut_manager();
    let hotkeys = db.get_all().expect("Failed to load hotkeys setting");
    gsm.unregister_all().expect("Failed to unregister all.");
    for hotkey_item in hotkeys {
        let app_handle_clone = app_handle.clone();
        let _ = match hotkey_item.0.as_str() {
            "open_main_window" => gsm.register(hotkey_item.1.as_str(), move || {
                core_window_toggle_visibility(app_handle_clone.get_window("main_window").unwrap());
            }),
            _ => Ok(()),
        };
    }
    Ok(())
}

#[tauri::command]
pub fn setting_hotkey_remove(db: State<'_, SettingTableHotkey>, key: String) -> CommandResult<()> {
    db.remove(key)?;
    Ok(())
}

#[tauri::command]
pub fn setting_hotkey_get(
    db: State<'_, SettingTableHotkey>,
    key: String,
) -> CommandResult<Option<String>> {
    db.get(&key)
}

#[tauri::command]
pub fn setting_hotkey_get_all(
    db: State<'_, SettingTableHotkey>,
) -> CommandResult<HashMap<String, String>> {
    db.get_all()
}

#[tauri::command]
pub fn setting_hotkey_change(
    db: State<'_, SettingTableHotkey>,
    key: String,
    value: String,
) -> CommandResult<()> {
    db.change(key, value)
}

#[tauri::command]
pub fn setting_hotkey_save(db: State<'_, SettingTableHotkey>) -> CommandResult<()> {
    db.save()?;
    Ok(())
}
