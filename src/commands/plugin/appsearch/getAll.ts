import { invoke } from "@tauri-apps/api";

import { PluginAppsearchTable } from "../../../types/PluginAppsearchTable";

export async function getAll(): Promise<PluginAppsearchTable> {
  const res: PluginAppsearchTable = await invoke("plugin_appsearch_get_all");
  return res;
}
