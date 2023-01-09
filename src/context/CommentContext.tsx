import { createContext, useContext, useState } from "react";

const CommentContext = createContext<any>(null);

type ChildComponents = {
  children: JSX.Element;
};

export function CommentContextProvider({ children }: ChildComponents) {
  const [newComment, setUpdateComment] = useState(null);
  function changeNewComment(comment: any) {
    setUpdateComment(comment);
  }
  return (
    <CommentContext.Provider value={{ changeNewComment, newComment }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  return useContext(CommentContext);
}
