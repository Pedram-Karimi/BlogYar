import React, { useEffect, useRef, useState } from "react";
import "./post.css";
import { db } from "../../Firebase/FirebaseConfig";
import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { Link } from "react-router-dom";
function Post(props: any) {
  const { user, userBookmarks } = useUserAuth();
  const bookmarkBtnRef = useRef<any>(null);
  const [currentWriter, setCurrentWriter] = useState<any>();
  useEffect(() => {
    if (userBookmarks)
      userBookmarks.includes(props.id)
        ? bookmarkBtnRef.current.classList.add("active-bookmark")
        : bookmarkBtnRef.current.classList.remove("active-bookmark");
  }, [userBookmarks]);
  const handleBookmark = async () => {
    const bookmarkRef = doc(db, "Bookmarks", user?.uid);
    await setDoc(
      bookmarkRef,
      {
        bookmarks: userBookmarks.includes(props.id)
          ? arrayRemove(props.id)
          : arrayUnion(props.id),
      },
      { merge: true }
    );
  };
  useEffect(() => {
    const fetchCurrentWriter = async () => {
      const userRef = doc(db, "users", props.Writer);
      const userDocument = await getDoc(userRef);
      setCurrentWriter(userDocument.data());
    };
    fetchCurrentWriter();
  }, []);
  //formating time
  const [dateInThePast, setDateInThePast] = useState<string>();
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
    if (props.createdAt) setDateInThePast(getPastDate(props.createdAt.seconds));
  }, [props]);
  return (
    <div className="post">
      <div className="blog-info">
        <Link to={`/post/${props.id}`} style={{ textDecoration: "none" }}>
          <h2 className="blog-title">{props.Title}</h2>
          <p className="short-blog-info">{props.Description}</p>
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="bookmark-btn"
          viewBox="0 0 16 16"
          ref={bookmarkBtnRef}
          onClick={handleBookmark}
        >
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
        <div className="blog-writer">
          <Link
            to={
              props.Writer !== user?.uid ? `/user/${props.Writer}` : "/profile"
            }
          >
            <img src={currentWriter?.UserProfile} className="blog-writer-img" />
          </Link>
          <div className="writer-text-info">
            <Link
              to={
                props.Writer !== user?.uid
                  ? `/user/${props.Writer}`
                  : "/profile"
              }
              style={{ textDecoration: "none" }}
            >
              <p className="writer-name">{currentWriter?.UserName}</p>
            </Link>
            <p className="blog-publish-time">{dateInThePast}</p>
          </div>
        </div>
      </div>
      <Link to={`/post/${props.id}`} style={{ textDecoration: "none" }}>
        <img src={props.PostImage} className="blog-image" />
      </Link>
    </div>
  );
}

export default Post;
