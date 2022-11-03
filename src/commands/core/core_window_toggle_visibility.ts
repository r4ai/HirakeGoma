import { invoke } from "@tauri-apps/api";

export function core_window_toggle_visibility(): void {
  invoke("core_window_toggle_visibility");
}
