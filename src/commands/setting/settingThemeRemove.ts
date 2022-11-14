import { invoke } from "@tauri-apps/api";
export async function settingThemeRemove(key: string): Promise<void> {
  await invoke("setting_theme_remove", { key });
}
