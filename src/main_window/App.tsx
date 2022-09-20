import { css, useTheme } from "@emotion/react";
import { FC, useState } from "react";

import { search } from "../commands/main/search";
import { InputBox } from "./components/InputBox";
import { ResultList } from "./components/ResultList";

const App: FC = () => {
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  async function handleInputBoxChange(keyword: string): Promise<void> {
    if (keyword === "") {
      setSearchResults([]);
    } else {
      await search(keyword).then((res) => setSearchResults(res));
    }
  }

  const globalCss = css`
    background-color: ${theme.colors.backgroundColor};
    min-width: 100vw;
    max-width: 100vw;
    height: 100%;
    min-height: 100vh;
  `;

  return (
    <div css={globalCss}>
      <InputBox
        keyword=""
        onChange={(e) => {
          void handleInputBoxChange(e.target.value);
        }}
      />
      <ResultList searchResults={searchResults} />
    </div>
  );
};

export default App;
