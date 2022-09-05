#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod core;
mod plugins;

use crate::core::db::kv_store::SearchDatabase;

use crate::plugins::application_search;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![application_search::command::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)] // cargo test時にtestsモジュールが実行されるように指定
mod tests {
    #[test] // 実際にテストする関数
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
