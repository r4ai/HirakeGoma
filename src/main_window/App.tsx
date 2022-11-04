import { css, useTheme } from "@emotion/react";
import { register } from "@tauri-apps/api/globalShortcut";
import { FC, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { core_window_toggle_visibility } from "../commands/core";
import { core_window_hide } from "../commands/core/core_window_hide";

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
    void register("CommandOrControl+Space", core_window_toggle_visibility);
  }, []);

  const globalCss = css`
    background: "#0f0f0fff";
    min-width: 100vw;
    max-width: 100vw;
    height: 100%;
    min-height: 100vh;
  `;

  useHotkeys("esc", core_window_hide);

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
