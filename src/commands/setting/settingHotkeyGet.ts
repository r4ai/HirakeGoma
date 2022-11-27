import { invoke } from "@tauri-apps/api";

export async function settingHotkeyGet(key: string | null): Promise<string> {
  return await invoke<string>("setting_hotkey_get", { key });
}
