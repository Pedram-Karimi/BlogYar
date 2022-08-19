import { useEffect, useState } from "react"; //  react-hooks

import { doc, getDoc } from "firebase/firestore"; //  firestore tools

import { Link } from "react-router-dom"; // react-router tools

// contexts

import { useUserAuth } from "../../../context/UserAuthContext";

import { db } from "../../../Firebase/FirebaseConfig"; //  firebase db ref

//this is component props interface

interface Props {
  commentText: string;
  commentWriter: string;
  createdAt: string;
}

const CommentBox: React.FC<Props> = ({
  commentText,
  commentWriter,
  createdAt,
}) => {
  //---

  // variables ---

  const [writer, setWriter] = useState<any>();

  // use contexts ---

  const { user } = useUserAuth();

  // get comment writer ------------------------------
  useEffect(() => {
    const getWriter = async () => {
      const userRef = doc(db, "users", commentWriter);
      const getUser = await getDoc(userRef);
      setWriter(getUser.data());
    };
    getWriter();
  }, []);

  // jsx ---
  return (
    <div className="comment-box">
      <div className="comment-box-header">
        <Link
          to={
            commentWriter !== user?.uid ? `/user/${commentWriter}` : "/profile"
          }
        >
          <img src={writer?.UserProfile} />
        </Link>
        <div>
          <Link
            to={
              commentWriter !== user?.uid
                ? `/user/${commentWriter}`
                : "/profile"
            }
            style={{ textDecoration: "none" }}
          >
            <p>{writer?.UserName}</p>
          </Link>
          <p className="comment-publish-time">7 days ago</p>
        </div>
      </div>
      <p className="comment-box-body">{commentText}</p>
    </div>
  );
};

export default CommentBox;
