import { createContext, useContext, useState } from "react";

const CommentContext = createContext();

export function CommentContextProvider({ children }) {
  const [newComment, setUpdateComment] = useState(null);
  function changeNewComment(comment) {
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
