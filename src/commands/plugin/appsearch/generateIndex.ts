import { invoke } from "@tauri-apps/api";

export async function generateIndex(debug: boolean): Promise<void> {
  await invoke("plugin_appsearch_generate_index", { debug });
}
