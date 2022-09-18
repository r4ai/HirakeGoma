interface SearchResultItem {
  name: string;
  score: number;
  item_type: string;
  icon_path: string;
  file_path: string;
  command: string;
}

type SearchResults = SearchResultItem[];
