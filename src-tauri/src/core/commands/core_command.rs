use std::error::Error;

use tauri::{AppHandle, Manager, Window, WindowBuilder, WindowUrl};
use window_shadows::set_shadow;
use window_vibrancy::{apply_blur, apply_vibrancy, clear_blur, NSVisualEffectMaterial};

use crate::{
    core::{
        db::{
            applications_table::SearchDatabaseApplicationTable,
            main_table::SearchDatabaseMainTable, search_database_store::SearchDatabaseTable,
            setting_table_hotkey::SettingTableHotkey, setting_table_theme::SettingTableTheme,
        },
        utils::result::CommandResult,
    },
    plugins::application_search::table::PluginAppsearchTable,
};

#[derive(Debug)]
pub enum WindowList {
    Main,
    Setting,
}

impl WindowList {
    pub fn label(&self) -> String {
        match self {
            WindowList::Main => String::from("main_window"),
            WindowList::Setting => String::from("setting_window"),
        }
    }

    pub fn url(&self) -> WindowUrl {
        match self {
            WindowList::Main => WindowUrl::App("index.html".into()),
            WindowList::Setting => WindowUrl::App("src/setting_window/setting.html".into()),
        }
    }

    pub fn builder<'a>(&'a self, app_handle: &'a AppHandle) -> WindowBuilder {
        match self {
            WindowList::Main => WindowBuilder::new(app_handle, self.label(), self.url())
                .title("HirakeGoma")
                .fullscreen(false)
                .inner_size(700.0, 600.0)
                .center()
                .resizable(false)
                .transparent(true)
                .always_on_top(true)
                .decorations(false),
            WindowList::Setting => {
                if core_os_get_name() != "windows" {
                    WindowBuilder::new(app_handle, self.label(), self.url())
                        .inner_size(600.0, 800.0)
                } else {
                    WindowBuilder::new(app_handle, self.label(), self.url())
                        .inner_size(800.0, 600.0)
                        .decorations(false)
                }
            }
        }
    }
}

#[tauri::command]
pub fn core_window_hide(win: Window) {
    win.hide().expect("Failed to hide window.");
}

#[tauri::command]
pub fn core_window_show(win: Window) {
    win.center().expect("Failed to center the window.");
    win.show().expect("Failed to show window.");
    win.set_focus().expect("Failed to set-focus to window.");
}

#[tauri::command]
pub async fn core_window_create(app_handle: AppHandle, win_label: String) -> CommandResult<()> {
    let window = match win_label.as_str() {
        "main_window" => WindowList::Main,
        "setting_window" => WindowList::Setting,
        _ => {
            return Err(crate::core::utils::result::CommandError::TauriError(
                tauri::api::Error::Command("unknown window label".to_string()),
            ))
        }
    };
    let win = window.builder(&app_handle).build().unwrap();
    core_window_decorate(win).expect("Failed to decorate the window.");
    Ok(())
}

#[tauri::command]
pub fn core_window_toggle_visibility(win: Window) {
    if win.is_visible().unwrap() {
        core_window_hide(win);
    } else {
        core_window_show(win);
    }
}

pub fn core_window_show_that(app_handle: &AppHandle, win: WindowList) {
    core_window_show(app_handle.get_window(&win.label()).unwrap())
}

pub fn core_window_hide_that(app_handle: &AppHandle, win: WindowList) {
    core_window_hide(app_handle.get_window(&win.label()).unwrap())
}

pub fn core_window_toggle_visibility_that(app_handle: &AppHandle, win: WindowList) {
    let got_win = app_handle.get_window(&win.label()).unwrap();
    if got_win.is_visible().unwrap() {
        core_window_hide(got_win);
    } else {
        core_window_show(got_win);
    }
}

pub fn core_window_create_that(app_handle: AppHandle, win: WindowList) -> CommandResult<()> {
    std::thread::spawn(move || {
        let win = win.builder(&app_handle).build().unwrap();
        core_window_decorate(win).expect("Failed to decorate the window.");
    });
    Ok(())
}

pub fn core_window_decorate(win: Window) -> CommandResult<()> {
    if win.label() == "main_window" {
        #[cfg(target_os = "macos")]
        {
            apply_vibrancy(&win, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
        }

        #[cfg(target_os = "windows")]
        {
            apply_blur(&win, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
        }
    }

    set_shadow(&win, true).expect("Unsupported platform!");
    Ok(())
}

#[tauri::command]
pub fn core_os_get_name() -> String {
    #[cfg(target_os = "windows")]
    return "windows".to_string();

    #[cfg(target_os = "macos")]
    return "macos".to_string();

    #[cfg(target_os = "linux")]
    return "linux".to_string();
}

#[tauri::command]
pub fn core_db_save(app_handle: AppHandle) -> CommandResult<()> {
    // * SETTING STORE
    app_handle.state::<SettingTableHotkey>().save().unwrap();
    app_handle.state::<SettingTableTheme>().save().unwrap();

    // * SEARCH DATABASE STORE
    app_handle
        .state::<SearchDatabaseMainTable>()
        .save()
        .unwrap();
    app_handle
        .state::<SearchDatabaseApplicationTable>()
        .save()
        .unwrap();

    // * PLUGIN STORE
    app_handle.state::<PluginAppsearchTable>().save().unwrap();

    println!("Stores has been saved.");
    Ok(())
}
