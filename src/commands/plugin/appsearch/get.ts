import { invoke } from "@tauri-apps/api";

export async function get<T>(key: string): Promise<T> {
  return await invoke<T>("plugin_appsearch_get", { key });
}
