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
    width: 100vw;
    min-width: 0;
    height: 100vh;
    min-height: 0;
    display: grid;
    grid-template-rows: 10% 90%;
    grid-template-columns: auto;
  `;

  useHotkeys("esc", coreWindowHide);

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
