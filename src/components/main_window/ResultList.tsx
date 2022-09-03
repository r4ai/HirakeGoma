import React, { FC } from "react";
import { SearchResults } from "../../types/SearchResult";
import { List, ListItem, ListItemText } from "@mui/material";

interface Props {
  searchResults: SearchResults;
}

export const ResultList: FC<Props> = ({ searchResults }) => {
  return (
    <div>
      <List>
        {searchResults.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
