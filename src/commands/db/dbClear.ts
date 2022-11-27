import { invoke } from "@tauri-apps/api";

async function dbClear(tableName: SearchDatabaseTableNames): Promise<void> {
  await invoke("db_clear", { tableName });
}
