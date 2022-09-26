import { invoke } from "@tauri-apps/api";
export async function saveTheme(): Promise<void> {
  await invoke("setting_theme_save");
}
