#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod core;
mod plugins;

use crate::core::ui;

fn main() {
    #[tauri::command]
    fn ping() -> String {
        String::from("pong!")
    }

    ui::init_app();
}

#[cfg(test)] // cargo test時にtestsモジュールが実行されるように指定
mod tests {
    #[test] // 実際にテストする関数
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
