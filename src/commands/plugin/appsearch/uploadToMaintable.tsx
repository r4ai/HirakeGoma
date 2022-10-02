import { invoke } from "@tauri-apps/api";

export async function uploadToMainTable(): Promise<void> {
  await invoke("plugin_appsearch_upload_to_main_table");
}
