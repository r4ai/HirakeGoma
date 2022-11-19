import { css, useTheme } from "@emotion/react";
import { register } from "@tauri-apps/api/globalShortcut";
import { FC, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { coreWindowToggleVisibility } from "../commands/core";
import { coreWindowHide } from "../commands/core/coreWindowHide";
import { rgba } from "emotion-rgba";

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

  useEffect(() => {
    void register("CommandOrControl+Space", coreWindowToggleVisibility);
  }, []);

  const globalCss = css`
    background: ${rgba(theme.colors.backgroundColor, theme.colors.backgroundTransparency)};
    min-width: 100vw;
    max-width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  `;

  useHotkeys("esc", coreWindowHide);

  return (
    <div css={globalCss}>
      <InputBox
        css={css`
          grid-row: 1;
        `}
        keyword=""
        onChange={(e) => {
          void handleInputBoxChange(e.target.value);
        }}
      />
      <ResultList
        css={css`
          grid-row: 2;
          overflow-y: scroll;
        `}
        searchResults={searchResults}
      />
    </div>
  );
};

export default App;
