// import { Button } from "@chakra-ui/react";
// import { FC, useContext } from "react";

// import { SelectedPluginContext } from "../../pages/plugin/Plugin";

// interface Props {
//   icon: JSX.Element;
//   title: string;
//   component: JSX.Element;
// }

// export const ThemeSideBarItem: FC<Props> = ({ icon, title, component }) => {
//   const { setSelectedPluginComponent } = useContext(SelectedPluginContext);

//   function handleChange(): void {
//     setSelectedPluginComponent(component);
//   }

//   return (
//     <>
//       <Button
//         leftIcon={icon}
//         variant="ghost"
//         h="100%"
//         w="100%"
//         justifyContent="flex-start"
//         p={3}
//         onClick={handleChange}
//         overflow="hidden"
//         textOverflow="ellipsis"
//       >
//         {title}
//       </Button>
//     </>
//   );
// };
