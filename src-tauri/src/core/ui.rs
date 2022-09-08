use crate::plugins::application_search;

pub fn init() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![application_search::command::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
