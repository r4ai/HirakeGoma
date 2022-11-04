import { invoke } from "@tauri-apps/api";
export async function setting_theme_save(): Promise<void> {
  await invoke("setting_theme_save");
}
