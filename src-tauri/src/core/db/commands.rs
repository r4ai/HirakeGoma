use crate::core::db::kv_store::SearchDatabase;
use tauri::State;

#[derive(Default)]
struct Sear {
    s: std::sync::Mutex<String>,
    t: std::sync::Mutex<std::collections::HashMap<String, String>>,
}

// #[derive(Default)]
// struct SearchDatabaseState {
//     s: std::sync::Mutex<SearchDatabase>,
//     t: std::sync::Mutex<std::collections::HashMap<String, String>>,
// }

// #[tauri::command]
// async fn command_name(state: tauri::State<'_, MyState>) -> Result<(), String> {
//     *state.s.lock().unwrap() = "new string".into();
//     state.t.lock().unwrap().insert("key".into(), "value".into());
//     Ok(())
// }
