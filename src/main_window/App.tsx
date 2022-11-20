import { css, useTheme } from "@emotion/react";
import { register } from "@tauri-apps/api/globalShortcut";
import { FC, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { coreWindowToggleVisibility } from "../commands/core";
import { coreWindowHide } from "../commands/core/coreWindowHide";
import { rgba } from "emotion-rgba";

import { search } from "../commands/main/search";
import { InputBox } from "./components/InputBox";
import { ResultList } from "./components/ResultList";
import { useIterator } from "./hooks/useIterator";
import { Button } from "@chakra-ui/react";

const App: FC = () => {
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState<SearchResults>([]);
  const selectedItem = useIterator(searchResults.length - 1);

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

  async function handleInputBoxChange(keyword: string): Promise<void> {
    if (keyword === "") {
      setSearchResults([]);
    } else {
      await search(keyword).then((res) => setSearchResults(res));
    }
  }

  function focus(): void {}

  useEffect(() => {
    // * SET GLOBAL SHORTCUT
    void register("CommandOrControl+Space", coreWindowToggleVisibility);
  }, []);

  useEffect(() => {
    // ! DEBUG
    console.log(selectedItem);
  }, [selectedItem]);

  const inputBoxRef = useRef<HTMLInputElement>(null);

  const [hideEnabled, setHideEnabled] = useState(true);
  const hideRef = useHotkeys("escape", coreWindowHide, { enabled: hideEnabled, enableOnFormTags: true, keyup: true });
  const focusInputBoxRef = useHotkeys(
    "escape",
    () => {
      setHideEnabled(true);
      // TODO: FOCUS INPUT BOX
      inputBoxRef.current?.focus();
      console.log("FOCUS INPUTBOX !!!");
    },
    { enableOnFormTags: true, keyup: true }
  );

  useHotkeys("up", selectedItem.prev, { enableOnFormTags: true, keyup: true });
  useHotkeys("down", selectedItem.next, { enableOnFormTags: true, keyup: true });
  useHotkeys("left", selectedItem.first, { enableOnFormTags: true, keyup: true });
  useHotkeys("right", selectedItem.last, { enableOnFormTags: true, keyup: true });
  // TODO: pageDown hotkey using `selectedItem.nextByX`
  // TODO: pageUp hotkey using `selectedItem.prevByX`

  return (
    <div css={globalCss} ref={hideRef} tabIndex={-1}>
      <InputBox
        keyword=""
        onChange={(e) => {
          void handleInputBoxChange(e.target.value);
        }}
        setHideEnabled={setHideEnabled}
        inputBoxRef={inputBoxRef}
      />
      <ResultList
        searchResults={searchResults}
        selectedItemIndex={selectedItem.i}
        ref={focusInputBoxRef}
        setHideEnabled={setHideEnabled}
      />
    </div>
  );
};

export default App;
