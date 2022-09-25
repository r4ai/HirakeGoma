import { invoke } from "@tauri-apps/api";

export async function createTheme(key: string): Promise<void> {
  await invoke("setting_theme_create", { key });
}
