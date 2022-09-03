import { FC } from "react";
import { Form } from "./components/main_window/Form";
import { InputBox } from "./components/main_window/InputBox";
import { ResultList } from "./components/main_window/ResultList";

const App: FC = () => {
  const searchResults: SearchResults = [
    { name: "fugafuga", id: "1", icon: "fuga.png", file_path: "fuga/hoge/foo.exe" },
    { name: "fugahoge", id: "2", icon: "bar.png", file_path: "fuga/hoge/foe.exe" }
  ];

  return (
    <>
      <div>Hello</div>
      <InputBox text="fuga-" />
      <ResultList searchResults={searchResults} />
    </>
  );
};

export default App;
