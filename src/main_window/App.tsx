import { css, useTheme } from "@emotion/react";
import { register } from "@tauri-apps/api/globalShortcut";
import { createRef, FC, MutableRefObject, Ref, RefObject, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { coreWindowToggleVisibility } from "../commands/core";
import { coreWindowHide } from "../commands/core/coreWindowHide";
import { rgba } from "emotion-rgba";

import { search } from "../commands/main/search";
import { InputBox } from "./components/InputBox";
import { ResultList } from "./components/ResultList";
import { useIterator } from "./hooks/useIterator";
import { Button } from "@chakra-ui/react";
import { usePrevious } from "./hooks/usePrevious";

const App: FC = () => {
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState<SearchResults>([]);
  let selectedIndex = 0;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [prevSelectedItemIndex, setPrevSelectedItemIndex] = useState(0);
  const [upCount, setUpCount] = useState(0);

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
    // void register("CommandOrControl+Space", coreWindowToggleVisibility);
  }, []);

  useEffect(() => {
    // * INITIALIZE SELECTED_ITEM_INDEX
    setSelectedItemIndex(0);
    console.log(selectedItemIndex);
  }, [searchResults]);

  useEffect(() => {
    // * SCROLL TO SELECTED ITEM ELEMENT
    if (selectedItemIndex - prevSelectedItemIndex > 0) {
      focus(selectedItemIndex, "down");
    } else {
      focus(selectedItemIndex, "up");
    }
  }, [selectedItemIndex]);

  const inputBoxRef = useRef<HTMLInputElement>(null);
  const resultListRefs = useRef<RefObject<HTMLDivElement>[]>([]);
  for (let i = 0; i < searchResults.length; i++) {
    resultListRefs.current[i] = createRef<HTMLDivElement>();
    // console.log(`created ref ${i}`);
  }

  const [hideEnabled, setHideEnabled] = useState(true);
  const hideRef = useHotkeys("escape", coreWindowHide, { enabled: hideEnabled, enableOnFormTags: true, keyup: true });
  const focusInputBoxRef = useHotkeys(
    "escape",
    () => {
      setHideEnabled(true);
      inputBoxRef.current?.focus();
    },
    { enableOnFormTags: true, keyup: true }
  );

  // TODO: custom hooks へ矢印キーの処理を分離する。
  function focus(i: number, direction: "up" | "down") {
    if (i < 0 || searchResults.length <= i) {
      console.error("given index is in `i < 0 || searchResults.length <= 1`");
      return;
    }
    const element = resultListRefs.current[i]?.current;
    if (!element) {
      return;
    }
    const maxElementNum = Math.floor((document.body.clientHeight * 0.9) / (element?.scrollHeight + 10)) - 1;
    console.log(`focus to ${i} / ${searchResults.length - 1}`);
    if (i === 0) {
      setUpCount(maxElementNum);
      element?.scrollIntoView();
    } else if (i === searchResults.length - 1) {
      setUpCount(0);
      element?.scrollIntoView();
    } else {
      if (direction === "down") {
        setUpCount((prev) => Math.max(prev - 1, 0));
        if (upCount === 0) {
          resultListRefs.current[i - maxElementNum]?.current?.scrollIntoView();
        }
      } else {
        setUpCount((prev) => Math.min(prev + 1, maxElementNum));
        if (upCount === maxElementNum) {
          element?.scrollIntoView();
        }
      }
    }
  }

  useHotkeys(
    "up",
    () => {
      setPrevSelectedItemIndex(selectedItemIndex);
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
      setPrevSelectedItemIndex(selectedItemIndex);
      if (selectedItemIndex === searchResults.length - 1) {
        setSelectedItemIndex(0);
      } else {
        setSelectedItemIndex((prev) => prev + 1);
      }
    },
    { enableOnFormTags: true, preventDefault: true },
    [selectedItemIndex]
  );
  // TODO: pageDown hotkey
  // TODO: pageUp hotkey

  return (
    <div css={globalCss} ref={hideRef as MutableRefObject<HTMLDivElement>} tabIndex={-1}>
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
        selectedItemIndex={selectedItemIndex}
        setHideEnabled={setHideEnabled}
        resultListRefs={resultListRefs}
      />
    </div>
  );
};

export default App;
