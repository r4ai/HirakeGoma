import { invoke } from "@tauri-apps/api";

export async function settingThemeGetActivated(): Promise<string> {
  return await invoke<string>("setting_theme_get_activated");
}
