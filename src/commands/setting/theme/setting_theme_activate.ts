import { invoke } from "@tauri-apps/api";

export async function setting_theme_activate(themeName: string | undefined): Promise<void> {
  console.log(themeName);
  if (themeName === undefined) {
    return;
  }
  await invoke("setting_theme_activate", { key: themeName });
}
