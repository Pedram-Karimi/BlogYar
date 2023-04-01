import { useEffect, useState } from "react"; // react hooks
import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref
import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore"; // firestore tools

// context

import { useUserAuth } from "../../../context/UserAuthContext";

import { Link, useNavigate } from "react-router-dom"; // react-router tools

// this component props interface

interface Props {
  postWriterId: string;
  postWriterName: string;
  postWriterPic: string;
  createdAt: number;
}

const PostWriter: React.FC<Props> = ({
  postWriterId,
  postWriterName,
  postWriterPic,
  createdAt,
}) => {
  //---

  //variables ---

  const { user, userSubs } = useUserAuth();
  const [followed, setFollowed] = useState<Boolean>();
  const navigate = useNavigate();
  const [dateInThePast, setDateInThePast] = useState<string>();

  // follow check ------------------------------

  useEffect(() => {
    if (userSubs)
      if (userSubs.includes(postWriterId)) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
  });

  // follow function ------------------------------

  const handleFollow = () => {
    if (user) {
      const bookmarkRef = doc(db, "subscriptions", user?.uid);
      const userRef = doc(db, "users", postWriterId);
      setDoc(
        bookmarkRef,
        {
          subscriptions: userSubs.includes(postWriterId)
            ? arrayRemove(postWriterId)
            : arrayUnion(postWriterId),
        },
        { merge: true }
      );
      const updateWriterFollower = async () => {
        const userRef = doc(db, "users", postWriterId);
        try {
          await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
              throw "Document does not exist!";
            }
            const newFollowedData = userSubs.includes(postWriterId)
              ? userDoc.data().Followers + -1
              : userDoc.data().Followers + 1;
            transaction.update(userRef, { Followers: newFollowedData });
          });
        } catch (e) {
          console.log("Transaction failed: ", e);
        }
      };
      updateWriterFollower();
    } else {
      navigate("//Login");
    }
  };

  // get post created at time formated ------------------------------

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
    if (createdAt) setDateInThePast(getPastDate(createdAt));
  }, [createdAt]);

  // jsx ---
  return (
    <div className="post-writer">
      <Link
        to={postWriterId !== user?.uid ? `//user/${postWriterId}` : "//profile"}
      >
        <img src={postWriterPic} />
      </Link>
      <div className="post-writer-info-container">
        <div className="post-writer-name">
          <Link
            to={
              postWriterId !== user?.uid
                ? `//user/${postWriterId}`
                : "//profile"
            }
            style={{ textDecoration: "none" }}
          >
            {postWriterName}
          </Link>
          {postWriterId !== user?.uid && (
            <div
              className={`follow-btn ${followed ? "followed-btn" : ""}`}
              onClick={handleFollow}
            >
              {`${!followed ? "Follow" : "Followed"} `}
              {!followed && (
                <svg
                  fill="#000000"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="50px"
                  height="50px"
                >
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z" />
                </svg>
              )}
            </div>
          )}
        </div>
        <p className="post-writer-publish-time">{dateInThePast}</p>
      </div>
    </div>
  );
};

export default PostWriter;
