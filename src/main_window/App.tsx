import { FC } from "react";
import { InputBox } from "./components/InputBox";
import { css, useTheme } from "@emotion/react";
import { ResultList } from "./components/ResultList";

const App: FC = () => {
  const searchResults: SearchResults = [
    { name: "fugafuga", id: "1", icon_path: "fuga.png", file_path: "fuga/hoge/foo.exe" },
    { name: "fugahoge", id: "2", icon_path: "bar.png", file_path: "fuga/hoge/foe.exe" }
  ];
  const theme = useTheme();

  const globalCss = css`
    background-color: ${theme.colors.backgroundColor};
    width: 100vw;
    height: 100vh;
  `;

  return (
    <div css={globalCss}>
      <InputBox text="after" />
      <ResultList searchResults={searchResults} />
    </div>
  );
};

export default App;
