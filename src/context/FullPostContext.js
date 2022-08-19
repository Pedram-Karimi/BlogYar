import { createContext, useContext, useState } from "react";

const FullPostContext = createContext();

export function FullPostContextProvider({ children }) {
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
