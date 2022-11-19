interface SearchResultItem {
  name: string;
  description: string;
  score: number;
  item_type: string;
  icon_path: string;
  path: string;
  command: string;
  alias: string[];
}

type SearchResults = SearchResultItem[];
