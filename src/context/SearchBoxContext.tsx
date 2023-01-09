import { createContext, useContext, useState } from "react";

const SearchBoxContext = createContext<any>(null);

type ChildComponents = {
  children: JSX.Element;
};

export function ShBoxContextProvider({ children }: ChildComponents) {
  const [activeSearchBox, setActiveSearchBox] = useState(false);
  function changeActiveSearchBox(bool) {
    setActiveSearchBox(bool);
  }
  return (
    <SearchBoxContext.Provider
      value={{ activeSearchBox, changeActiveSearchBox }}
    >
      {children}
    </SearchBoxContext.Provider>
  );
}
export function useSearchBoxContext() {
  return useContext(SearchBoxContext);
}
