import { createContext, useContext, useState } from "react";

const SearchBoxContext = createContext();

export function ShBoxContextProvider({ children }) {
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
