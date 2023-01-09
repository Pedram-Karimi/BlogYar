import { useState } from "react"; // react-hooks

// firebase tools
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref

import { useNavigate } from "react-router-dom"; // react-router tools

// contexts

import { useUserAuth } from "../../../context/UserAuthContext";
import { useComment } from "../../../context/CommentContext";

//componet
const WriteComment: React.FC<{ postId: string }> = ({ postId }) => {
  //---

  // variables ---

  const [commentText, setCommentText] = useState<string>("");

  // use contexts ---

  const { changeNewComment } = useComment();
  const { user, userDataState } = useUserAuth();

  const navigate = useNavigate(); // react-router navigate

  // uploud comment function ------------------------------

  const uploadComment = async () => {
    // check

    if (!user) {
      navigate("/Login");
    }

    if (commentText !== "") {
      try {
        // uploud the post to the firestore

        const postContentRef = await addDoc(collection(db, "Comments"), {
          commentWriter: user?.uid,
          id: postId,
          commentText: commentText,
          createdAt: serverTimestamp(),
        });

        // upload the post to context

        changeNewComment({
          commentWriter: user?.uid,
          commentWriterPic: userDataState?.UserProfile,
          commentWriterName: userDataState?.UserName,
          commentText: commentText,
          docId: postContentRef.id,
          createdAtNew: "now",
        });

        //
        setCommentText("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  // jsx ---
  return (
    <div className="write-comment">
      <div className="write-comment-header">
        <img src={userDataState?.UserProfile} />
        <p>{userDataState?.UserName}</p>
      </div>
      <textarea
        value={commentText}
        placeholder="Write here..."
        onChange={(e) => {
          setCommentText(e.target.value);
        }}
      />
      <div className="write-comment-footer">
        <button onClick={uploadComment}>send</button>
      </div>
    </div>
  );
};

export default WriteComment;
