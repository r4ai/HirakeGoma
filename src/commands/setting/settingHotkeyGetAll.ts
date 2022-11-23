import { invoke } from "@tauri-apps/api";
import { Hotkeys } from "../../types/Hotkey";

export async function settingHotkeyGetAll(): Promise<Hotkeys> {
  return await invoke<Hotkeys>("setting_hotkey_get_all");
}
