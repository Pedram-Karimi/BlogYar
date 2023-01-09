import { createContext, useContext, useState } from "react";

const FullPostContext = createContext<any>(null);

type ChildComponents = {
  children: JSX.Element;
};

export function FullPostContextProvider({ children }: ChildComponents) {
  const [leftOverData, setLeftOverData] = useState([]);
  function changeLeftOverData(data) {
    setLeftOverData(data);
  }
  return (
    <FullPostContext.Provider value={{ leftOverData, changeLeftOverData }}>
      {children}
    </FullPostContext.Provider>
  );
}

export function useFullPost() {
  return useContext(FullPostContext);
}
