import { invoke } from "@tauri-apps/api";

export function settingHotkeyRemove(key: string) {
  invoke("setting_hotkey_get", { key });
}
