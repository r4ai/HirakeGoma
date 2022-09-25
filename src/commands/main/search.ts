import { invoke } from "@tauri-apps/api";

export async function search(keyword: string): Promise<SearchResults> {
  const minScore = 1;
  return await invoke<SearchResults>("search", { keyword, minScore });
}
