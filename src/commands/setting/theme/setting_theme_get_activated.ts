import { invoke } from "@tauri-apps/api";

export async function setting_theme_get_activated(): Promise<string> {
  return await invoke<string>("setting_theme_get_activated");
}
