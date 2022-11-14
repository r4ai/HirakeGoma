import { invoke } from "@tauri-apps/api";

export function coreWindowHide(): void {
  invoke("core_window_hide");
}
