#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq, Clone)]
pub struct SettingThemeState {
    pub name: String,
    pub score: i64,
    pub item_type: String,
    pub icon_path: String,
    pub file_path: String,
    pub command: String,
}
