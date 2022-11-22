interface SearchResultItem {
  name: string;
  description: string;
  score: number;
  item_type: string;
  icon_path: string;
  path: string;
  command: string;
  command_args: CommandArgs;
  alias: string[];
}

interface CommandArgs {
  [index: string]: string;
}

type SearchResults = SearchResultItem[];
