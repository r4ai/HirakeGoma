import { createContext, FC, ReactNode, useContext, useState } from "react";

interface SideBarContextProps {
  activeIndex: number;
  setActiveIndex: Function;
}

const SideBarContext = createContext<SideBarContextProps>({ activeIndex: 0, setActiveIndex: () => {} });
export const useActiveIndex = () => useContext(SideBarContext);

interface Props {
  children: ReactNode;
}

export const SideBarProvider: FC<Props> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return <SideBarContext.Provider value={{ activeIndex, setActiveIndex }}>{children}</SideBarContext.Provider>;
};
