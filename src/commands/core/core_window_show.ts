import { invoke } from "@tauri-apps/api";

export function core_window_show(): void {
  invoke("core_window_show");
}
