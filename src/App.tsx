import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Form } from "./components/Form";

function App() {
  return (
    <>
      <div>Hello</div>
      <Form />
    </>
  );
}

export default App;
