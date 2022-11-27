import { invoke } from "@tauri-apps/api";

export async function getAllSearchDatabaseApplicationItems(): Promise<SearchResults> {
  const res = await invoke<SearchResults>("get_all_search_database_application_items");
  return res;
}
