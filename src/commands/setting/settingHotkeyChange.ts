import { invoke } from "@tauri-apps/api";

export async function settingHotkeyChange(key: string, value: string): Promise<void> {
  await invoke("setting_hotkey_change", { key, value });
}
