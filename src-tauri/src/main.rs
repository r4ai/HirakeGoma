#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod core;
mod plugins;

use crate::core::db::kv_store::SearchDatabase;
use crate::core::ui;

fn main() {
    ui::init_app();
    // let search_window = tauri::WindowBuilder::new(
    //     &app,
    //     "search_window",
    //     tauri::WindowUrl::App("index.html".into()),
    // );
}

#[cfg(test)] // cargo test時にtestsモジュールが実行されるように指定
mod tests {
    #[test] // 実際にテストする関数
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
