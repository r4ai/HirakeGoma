import { invoke } from "@tauri-apps/api";

export function core_window_hide(): void {
  invoke("core_window_hide");
}
