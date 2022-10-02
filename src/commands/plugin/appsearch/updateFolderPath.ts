import { invoke } from "@tauri-apps/api";

export async function updateFolderPath(paths: string[]): Promise<void> {
  await invoke("plugin_appsearch_update_folder_path", { paths });
}
