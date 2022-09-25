import { invoke } from "@tauri-apps/api";

export async function activateTheme(themeName: string | undefined): Promise<void> {
  console.log(themeName);
  if (themeName === undefined) {
    return;
  }
  await invoke("setting_theme_activate", { key: themeName });
}
