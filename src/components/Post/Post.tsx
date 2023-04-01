import { useEffect, useRef, useState } from "react"; // react-hooks

import "./post.css"; // styles

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore"; // firebase tools

import { Link } from "react-router-dom"; // react-router Link

// contexts

import { useUserAuth } from "../../context/UserAuthContext";

// this component's props interface

interface Props {
  Description: string;
  Likes: number;
  PostImage: string;
  Tags: string[];
  Title: string;
  Viewers: string[];
  Views: number;
  Writer: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
}

// user's interface

interface User {
  Bio?: string;
  Followers?: number;
  TotalLikes?: number;
  UserName?: string;
  UserProfile?: string;
  id?: string;
  lastPost?: string;
  lastPostDate?: {
    seconds?: number;
    nanoseconds?: number;
  };
  lastPostTitle?: string;
}

//--
const Post: React.FC<Props> = ({
  Description,
  PostImage,
  Title,
  Writer,
  createdAt,
  id,
}) => {
  //--
  // variables ---

  const [currentWriter, setCurrentWriter] = useState<User>();
  const [dateInThePast, setDateInThePast] = useState<string>();
  const bookmarkBtnRef = useRef<SVGSVGElement>(null);

  // use contexts ---

  const { user, userBookmarks } = useUserAuth();

  // set post's bookmark status ------------------------------

  useEffect(() => {
    if (userBookmarks[0])
      userBookmarks.includes(id)
        ? bookmarkBtnRef.current?.classList.add("active-bookmark")
        : bookmarkBtnRef.current?.classList.remove("active-bookmark");
  }, [userBookmarks]);

  // record bookmark to user's db document ------------------------------

  const handleBookmark = async () => {
    const bookmarkRef = doc(db, "Bookmarks", user?.uid);
    await setDoc(
      bookmarkRef,
      {
        bookmarks: userBookmarks.includes(id)
          ? arrayRemove(id)
          : arrayUnion(id),
      },
      { merge: true }
    );
  };

  // get the post's writer data ------------------------------

  useEffect(() => {
    const fetchCurrentWriter = async () => {
      const userRef = doc(db, "users", Writer);
      const userDocument = await getDoc(userRef);
      setCurrentWriter(userDocument.data());
    };
    fetchCurrentWriter();
  }, []);

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
    <div className="post">
      <div className="blog-info">
        <Link to={`/post/${id}`} style={{ textDecoration: "none" }}>
          <h2 className="blog-title">{Title}</h2>
          <p className="short-blog-info">{Description}</p>
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
          <Link to={Writer !== user?.uid ? `//user/${Writer}` : "//profile"}>
            <img src={currentWriter?.UserProfile} className="blog-writer-img" />
          </Link>
          <div className="writer-text-info">
            <Link
              to={Writer !== user?.uid ? `/user/${Writer}` : "//profile"}
              style={{ textDecoration: "none" }}
            >
              <p className="writer-name">{currentWriter?.UserName}</p>
            </Link>
            <p className="blog-publish-time">{dateInThePast}</p>
          </div>
        </div>
      </div>
      <Link to={`/post/${id}`} style={{ textDecoration: "none" }}>
        <img src={PostImage} className="blog-image" />
      </Link>
    </div>
  );
};

export default Post;
