import { invoke } from "@tauri-apps/api";

async function dbGetAll(tableName: SearchDatabaseTableNames): Promise<SearchResults> {
  return await invoke<SearchResults>("db_get_all", { tableName });
}
