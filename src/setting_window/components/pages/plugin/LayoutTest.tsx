// import { Grid, GridItem, VStack } from "@chakra-ui/react";
// import { FC, useState, createContext, ReactElement, useEffect } from "react";
// import { FiSearch } from "react-icons/fi";

// import { ThemeSideBarItem } from "../../parts/main";
// import { ApplicationSearch } from "./application_search/Generate";

// interface SelectedPluginComponentProps {
//   selectedPluginComponent: ReactElement;
//   setSelectedPluginComponent: Function;
// }

// export const SelectedPluginContext = createContext<SelectedPluginComponentProps>({
//   selectedPluginComponent: <></>,
//   setSelectedPluginComponent: () => {}
// });

// export const Plugin: FC = () => {
//   const [selectedPluginComponent, setSelectedPluginComponent] = useState<ReactElement>(<></>);
//   useEffect(() => {
//     console.log(selectedPluginComponent);
//   }, [selectedPluginComponent]);

//   return (
//     <SelectedPluginContext.Provider value={{ selectedPluginComponent, setSelectedPluginComponent }}>
//       <Grid templateAreas={`"sideBar main"`} gridTemplateColumns="150px 1fr" alignItems="start" alignSelf="start">
//         <GridItem area="sideBar" bg="red.900" position="sticky" overflow="auto" top="0">
//           <VStack>
//             <ThemeSideBarItem title="Application search" icon={<FiSearch />} component={<ApplicationSearch />} />
//           </VStack>
//         </GridItem>
//         <GridItem area="main">{selectedPluginComponent}</GridItem>
//       </Grid>
//     </SelectedPluginContext.Provider>
//   );
// };
