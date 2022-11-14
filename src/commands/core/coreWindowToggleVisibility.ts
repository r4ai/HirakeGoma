import { invoke } from "@tauri-apps/api";

export function coreWindowToggleVisibility(): void {
  invoke("core_window_toggle_visibility");
}
