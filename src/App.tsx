import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Form } from "./components/main_window/Form";

function App() {
  return (
    <>
      <div>Hello</div>
      <Form />
    </>
  );
}

export default App;
