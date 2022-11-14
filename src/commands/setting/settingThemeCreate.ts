import { invoke } from "@tauri-apps/api";

export async function settingThemeCreate(key: string): Promise<void> {
  await invoke("setting_theme_create", { key });
}
