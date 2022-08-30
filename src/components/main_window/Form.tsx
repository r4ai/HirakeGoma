// import { invoke } from "@tauri-apps/api/tauri";
// import { useState } from "react";

// export const Form = () => {
//   const [name, setName] = useState("");
//   const [greetMessage, setGreetMessage] = useState("");

//   const greetCommand = async (nameValue: string) => {
//     const result: string = await invoke("greet", { name: nameValue });
//     setGreetMessage(result);
//   };

//   const handleSubmit = () => {
//     greetCommand(name);
//   };

//   return (
//     <>
//       <div>
//         <label>お名前: </label>
//         <input
//           type="text"
//           onChange={(e) => {
//             setName(e.target.value);
//           }}
//         />
//         <button onClick={handleSubmit}>挨拶</button>
//       </div>
//       <p>{greetMessage}</p>
//     </>
//   );
// };
