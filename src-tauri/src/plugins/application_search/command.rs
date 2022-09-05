#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(test)]
mod tests {
    use super::greet;

    #[test]
    fn greet_test() {
        assert_eq!(greet("綾波"), "Hello, 綾波! You've been greeted from Rust!");
    }
}
