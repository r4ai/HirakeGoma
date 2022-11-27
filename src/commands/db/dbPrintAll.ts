import { invoke } from "@tauri-apps/api";

async function dbPrintAll(tableName: SearchDatabaseTableNames): Promise<void> {
  await invoke<SearchResults>("db_print_all", { tableName });
}
