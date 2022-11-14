import { invoke } from "@tauri-apps/api";

export function coreWindowShow(): void {
  invoke("core_window_show");
}
