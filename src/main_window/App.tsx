import { css, useTheme } from "@emotion/react";
import { register } from "@tauri-apps/api/globalShortcut";
import { createRef, FC, Ref, RefObject, useEffect, useRef, useState } from "react";
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
  let selectedIndex = 0;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

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

  useEffect(() => {
    // * SET GLOBAL SHORTCUT
    void register("CommandOrControl+Space", coreWindowToggleVisibility);
  }, []);

  useEffect(() => {
    setSelectedItemIndex(0);
    console.log(selectedItemIndex);
  }, [searchResults]);

  useEffect(() => {
    focus(selectedItemIndex);
  }, [selectedItemIndex]);

  const inputBoxRef = useRef<HTMLInputElement>(null);
  const resultListRefs = useRef<RefObject<HTMLDivElement>[]>([]);
  for (let i = 0; i < searchResults.length; i++) {
    resultListRefs.current[i] = createRef<HTMLDivElement>();
  }

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

  const focusLast = () => {
    // ! DEBUG FUNCTION
    resultListRefs.current[searchResults.length - 1].current?.scrollIntoView();
    console.log("FOCUS TO LAST");
  };

  function focus(i: number) {
    if (i < 0 || searchResults.length <= i) {
      console.error("given index is in `i < 0 || searchResults.length <= 1`");
      return;
    }
    console.log("focus to " + i);
    resultListRefs.current[i].current?.scrollIntoView();
  }

  useHotkeys(
    "up",
    () => {
      if (selectedItemIndex === 0) {
        setSelectedItemIndex(searchResults.length - 1);
      } else {
        setSelectedItemIndex((prev) => prev - 1);
      }
    },
    { enableOnFormTags: true, preventDefault: true },
    [selectedItemIndex]
  );

  useHotkeys(
    "down",
    () => {
      if (selectedItemIndex === searchResults.length - 1) {
        setSelectedItemIndex(0);
      } else {
        setSelectedItemIndex((prev) => prev + 1);
      }
    },
    { enableOnFormTags: true, preventDefault: true },
    [selectedItemIndex]
  );
  // TODO: pageDown hotkey using `selectedItem.nextByX`
  // TODO: pageUp hotkey using `selectedItem.prevByX`

  return (
    <div css={globalCss} ref={hideRef} tabIndex={-1}>
      {/* <Button onClick={focusLast}>FOCUS LAST</Button> */}
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
        selectedItemIndex={selectedIndex}
        setHideEnabled={setHideEnabled}
        resultListRefs={resultListRefs}
      />
    </div>
  );
};

export default App;
