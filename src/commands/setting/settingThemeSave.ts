import { invoke } from "@tauri-apps/api";
export async function settingThemeSave(): Promise<void> {
  await invoke("setting_theme_save");
}
