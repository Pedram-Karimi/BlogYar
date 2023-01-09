import { useEffect, useState } from "react"; // react

// components

import WriteComment from "./WriteComment";
import CommentBox from "./CommentBox";

// context

import { useComment } from "../../../context/CommentContext";

import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore"; // firestore

import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref
import { ReplyCtxProvider } from "../../../context/ReplyContext";

// props

interface Props {
  id: string | undefined;
  user: any;
}

const CommentSection: React.FC<Props> = ({ user, id }) => {
  // variables ---

  const [comments, setComments] = useState<any>([]);

  // context ---

  const { changeNewComment, newComment } = useComment();

  //get post comments ------------------------------

  useEffect(() => {
    const getData = async () => {
      const q = query(
        collection(db, "Comments"),
        orderBy("createdAt", "desc"),
        limit(10),
        where("id", "==", id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setComments((pervComments) => [
          ...pervComments,
          { ...doc.data(), docId: doc.id },
        ]);
      });
    };
    getData();
  }, []);

  // add new comment ------------------------------

  useEffect(() => {
    if (newComment) {
      setComments((pervComments) => [newComment, ...pervComments]);
      changeNewComment(null);
    }
  }, [newComment]);

  return (
    <div className="comments-container">
      {user && <p className="write-comment-title">Write comment:</p>}
      {user && <WriteComment postId={id ? id : ""} />}
      <div className="comments-container">
        <ReplyCtxProvider>
          {comments.length >= 1 ? (
            comments.map((comment, index) => {
              if (comment) return <CommentBox {...comment} key={index} />;
            })
          ) : (
            <p className="no-comments-text">No comments</p>
          )}
        </ReplyCtxProvider>
      </div>
    </div>
  );
};

export default CommentSection;
