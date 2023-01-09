import { createContext, useContext, useState } from "react";

type ChildComponents = {
  children: JSX.Element;
};

const ReplyCtx = createContext<any>(null);

export const ReplyCtxProvider = ({ children }: ChildComponents) => {
  const [currReply, setCurrReply] = useState<string>();
  const changeCurrReply = (comment: string) => {
    setCurrReply(comment);
  };
  return (
    <ReplyCtx.Provider value={{ currReply, changeCurrReply }}>
      {children}
    </ReplyCtx.Provider>
  );
};

export function useCurrReply() {
  return useContext(ReplyCtx);
}
