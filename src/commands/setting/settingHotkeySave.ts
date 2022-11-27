import { invoke } from "@tauri-apps/api";

export async function settingHotkeySave(): Promise<void> {
  await invoke("setting_hotkey_save");
}
