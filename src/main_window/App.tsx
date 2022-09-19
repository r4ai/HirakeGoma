import { css, useTheme } from "@emotion/react";
import { invoke } from "@tauri-apps/api";
import { FC, useState } from "react";

import { InputBox } from "./components/InputBox";
import { ResultList } from "./components/ResultList";

const App: FC = () => {
  const theme = useTheme();

  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  function search(keyword: string): void {
    const minScore = 1;
    void invoke<SearchResults>("search", { keyword, minScore }).then((res) => {
      console.log(res);
      setSearchResults(res);
    });
  }

  function handleInputBoxChange(keyword: string): void {
    if (keyword === "") {
      setSearchResults([]);
    } else {
      search(keyword);
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
          handleInputBoxChange(e.target.value);
        }}
      />
      <ResultList searchResults={searchResults} />
    </div>
  );
};

export default App;
