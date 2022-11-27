import { invoke } from "@tauri-apps/api";

export async function settingHotkeyUpdate(): Promise<void> {
  await invoke("setting_hotkey_update");
}
