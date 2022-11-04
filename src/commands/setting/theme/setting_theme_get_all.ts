import { invoke } from "@tauri-apps/api";

import { Themes } from "../../../types/Theme";

export async function setting_theme_get_all(): Promise<Themes> {
  return await invoke<Themes>("setting_theme_get_all");
}
