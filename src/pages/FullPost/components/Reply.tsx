import { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig";
import { useUserAuth } from "../../../context/UserAuthContext";
import { useCurrReply } from "../../../context/ReplyContext";

// props

interface Props {
  comment: string | undefined;
  mainComment: string;
  receiver: string;
  receiverName?: string;
  replyWriter: any;
  createdAt: string | { seconds: number; nanoseconds: number };
}

type IntrinsicAttributes = {
  // properties for IntrinsicAttributes go here
};

const Reply: React.FC<IntrinsicAttributes & Props> = ({
  comment,
  mainComment,
  receiverName,
  replyWriter,
  createdAt,
}) => {
  //
  // variable ---

  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const replyTextarea = useRef<HTMLSpanElement>(null);
  const [dateInThePast, setDateInThePast] = useState<string>();
  const [writer, setWriter] = useState<any>();

  // context ---

  const { changeCurrReply, changeIsReplying } = useCurrReply();
  const { user, userDataState } = useUserAuth();

  // get comment writer ------------------------------

  useEffect(() => {
    const getWriter = async () => {
      const userRef = doc(db, "users", replyWriter);
      const getUser = await getDoc(userRef);
      setWriter(getUser.data());
    };
    getWriter();
  }, []);

  // post reply

  const postReply = async (e) => {
    setShowReplyForm(false);
    e.preventDefault();
    if (replyTextarea.current?.innerText) {
      changeCurrReply({
        comment: replyTextarea.current?.innerText,
        mainComment: mainComment,
        receiver: replyWriter,
        receiverName: writer?.UserName,
        replyWriter: user.uid,
        createdAt: "now",
      });
      const commentRef = await addDoc(
        collection(db, "Comments", mainComment, "replies"),
        {
          comment: replyTextarea.current?.innerText,
          mainComment: mainComment,
          receiver: replyWriter,
          receiverName: writer?.UserName,
          replyWriter: user.uid,
          createdAt: serverTimestamp(),
        }
      );
    }
  };

  //formating post's publich time ------------------------------

  const getPastDate = (pastTimestamp) => {
    const secondsThatHavePassed = Math.floor(Date.now() / 1000) - pastTimestamp;
    if (secondsThatHavePassed < 60) {
      return secondsThatHavePassed + " seconds ago";
    } else if (secondsThatHavePassed < 3600) {
      return Math.floor(secondsThatHavePassed / 60) + " minutes ago";
    } else if (secondsThatHavePassed < 86400) {
      return Math.floor(secondsThatHavePassed / 3600) + " hours ago";
    } else if (secondsThatHavePassed < 86400 * 30) {
      return Math.floor(secondsThatHavePassed / 86400) + " days ago";
    } else if (secondsThatHavePassed < 86400 * 365) {
      return Math.floor(secondsThatHavePassed / (86400 * 30)) + " months ago";
    } else {
      return Math.floor(secondsThatHavePassed / (86400 * 365)) + " years ago";
    }
  };
  useEffect(() => {
    if (typeof createdAt !== "string") {
      setDateInThePast(getPastDate(createdAt.seconds));
    } else {
      setDateInThePast(createdAt);
    }
  }, [createdAt]);
  return (
    <div className="comment-box reply-level">
      <div className="comment-box-header">
        <Link
          to={replyWriter !== user?.uid ? `//user/${replyWriter}` : "//profile"}
        >
          <img src={writer?.UserProfile} />
        </Link>
        <div>
          <Link
            to={
              replyWriter !== user?.uid ? `//user/${replyWriter}` : "//profile"
            }
            style={{ textDecoration: "none" }}
          >
            <p>{writer?.UserName}</p>
          </Link>
          <p className="comment-publish-time">{dateInThePast}</p>
        </div>
      </div>
      <div>
        <p className="comment-box-body">
          {receiverName && (
            <span style={{ color: "#00d1bc" }}>@{receiverName} </span>
          )}
          {comment}
        </p>
        <div className="reply-buttons">
          <p
            onClick={() => {
              setShowReplyForm(!showReplyForm);
            }}
          >
            Reply
          </p>
        </div>
        {showReplyForm && (
          <form className={`write-reply`} onSubmit={postReply}>
            <p>
              <span
                className="textareaSpan"
                role="textbox"
                contentEditable
                ref={replyTextarea}
              ></span>
            </p>
            <button>comment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reply;
