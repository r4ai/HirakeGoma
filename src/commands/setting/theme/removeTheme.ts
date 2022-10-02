import { invoke } from "@tauri-apps/api";
export async function removeTheme(key: string): Promise<void> {
  await invoke("setting_theme_remove", { key });
}
