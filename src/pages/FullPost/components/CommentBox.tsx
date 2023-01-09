import { useEffect, useState, useRef } from "react"; //  react-hooks

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore"; //  firestore tools

import { Link } from "react-router-dom"; // react-router tools

// contexts

import { useUserAuth } from "../../../context/UserAuthContext";

import { db } from "../../../Firebase/FirebaseConfig"; //  firebase db ref

// components

import Reply from "./Reply";
import { useCurrReply } from "../../../context/ReplyContext";

//this is component props interface

interface Props {
  commentText: string;
  commentWriter: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  commentWriterPic?: string;
  commentWriterName?: string;
  createdAtNew?: string;
  docId: string;
}

// reply type

interface replyType {
  comment: string | undefined;
  mainComment: string;
  receiver: string;
  replyWriter: any;
  createdAt:
    | {
        seconds: number;
        nanoseconds: number;
      }
    | string;
}

const CommentBox: React.FC<Props> = ({
  commentText,
  commentWriter,
  createdAt,
  commentWriterPic,
  commentWriterName,
  createdAtNew,
  docId,
}) => {
  //---
  // variables ---

  const [writer, setWriter] = useState<any>();
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [dateInThePast, setDateInThePast] = useState<string>();
  const [replies, setReplies] = useState<({ id: string } | replyType)[]>([]);
  const replyTextarea = useRef<HTMLSpanElement>(null);

  // use contexts ---

  const { user, userDataState } = useUserAuth();
  const { currReply } = useCurrReply();

  // get comment writer ------------------------------

  useEffect(() => {
    if (!commentWriterPic) {
      const getWriter = async () => {
        const userRef = doc(db, "users", commentWriter);
        const getUser = await getDoc(userRef);
        setWriter(getUser.data());
      };
      getWriter();
    } else {
      setWriter({
        commentWriter,
        commentWriterPic,
        commentWriterName,
        commentText,
        createdAtNew,
      });
    }
  }, []);

  // get replies ------------------------------

  useEffect(() => {
    if (replies.length === 0) {
      const getReplies = async () => {
        const replies = await getDocs(
          collection(db, "Comments", docId, "replies")
        );
        replies.docs.forEach((doc) => {
          setReplies((pervRelies) => [
            ...pervRelies,
            { ...doc.data(), id: doc.id },
          ]);
        });
      };
      getReplies();
    }
  }, [showReplies]);

  // post reply ------------------------------

  const postReply = async (e) => {
    setShowReplyForm(false);
    setReplies([]);
    e.preventDefault();
    if (replyTextarea.current?.innerText) {
      setReplies((pervComments) => [
        ...pervComments,
        {
          comment: replyTextarea.current?.innerText,
          mainComment: docId,
          receiver: commentWriter,
          replyWriter: user.uid,
          createdAt: "now",
        },
      ]);
      const commentRef = await addDoc(
        collection(db, "Comments", docId, "replies"),
        {
          comment: replyTextarea.current.innerText,
          mainComment: docId,
          receiver: commentWriter,
          replyWriter: user.uid,
          createdAt: serverTimestamp(),
        }
      );
    }
  };

  // update replies ------------------------------

  useEffect(() => {
    if (currReply) {
      setReplies((pervComments) => [
        ...pervComments,
        {
          ...currReply,
        },
      ]);
    }
  }, [currReply]);

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
    if (createdAt) setDateInThePast(getPastDate(createdAt.seconds));
  }, [createdAt]);

  // jsx ---
  return (
    <div className="comment-box">
      <div className="comment-box-header">
        <Link
          to={
            commentWriter !== user?.uid ? `/user/${commentWriter}` : "/profile"
          }
        >
          <img src={commentWriterPic ?? writer?.UserProfile} />
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
            <p>{commentWriterName ?? writer?.UserName}</p>
          </Link>
          <p className="comment-publish-time">{dateInThePast}</p>
        </div>
      </div>
      <div>
        <p className="comment-box-body">{commentText}</p>

        <div className="reply-buttons">
          <p
            onClick={() => {
              setShowReplies(!showReplies);
            }}
          >
            {showReplies ? "Hide replies" : "Show replies"}
          </p>
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

        {/* replies div */}

        {showReplies && (
          <div className="replies-box">
            {replies.map((reply: any, index: number) => {
              if (reply.mainComment === docId)
                return <Reply {...reply} key={index} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
