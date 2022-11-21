import { invoke } from "@tauri-apps/api";
export function coreOsGetName(): Promise<string> {
  return invoke<string>("core_os_get_name");
}
