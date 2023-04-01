import { useEffect, useState } from "react"; // react-hooks

import { Link } from "react-router-dom"; // react-router Link

// contexts

import { useUserAuth } from "../../../../../context/UserAuthContext";

import { doc, getDoc } from "firebase/firestore"; // firestore tools

import { db } from "../../../../../Firebase/FirebaseConfig"; // firebase db ref

// this is componet's props interface

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

const HeaderPost: React.FC<Props> = ({
  Writer,
  createdAt,
  id,
  Description,
  PostImage,
  Title,
}) => {
  //--
  // variables ---

  const [currentWriter, setCurrentWriter] = useState<User>();
  const [dateInThePast, setDateInThePast] = useState<string>();

  // use contexts ---

  const { user } = useUserAuth();

  // get post's writer data ------------------------------

  useEffect(() => {
    if (Writer) {
      const fetchCurrentWriter = async () => {
        const userRef = doc(db, "users", Writer);
        const userDocument = await getDoc(userRef);
        setCurrentWriter(userDocument.data());
      };
      fetchCurrentWriter();
    }
  }, [Writer]);

  //format time ------------------------------

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
    if (createdAt) {
      setDateInThePast(getPastDate(createdAt.seconds));
    }
  }, [createdAt]);

  // jsx ---
  return (
    <div className="header-post">
      <Link
        to={`/blogyar/post/${id}`}
        style={{ textDecoration: "none", width: "55%" }}
      >
        {Writer && <img src={PostImage} />}
      </Link>
      <div className="top-posts-post-info">
        <Link to={`/blogyar/post/${id}`} style={{ textDecoration: "none" }}>
          <div className="top-post-post-title">
            <h2>{Title}</h2>
            <p>{Description}</p>
          </div>
        </Link>
        <div className="top-posts-post-writer">
          <Link
            to={
              Writer !== user?.uid
                ? `/blogyar/user/${Writer}`
                : "/blogyar/profile"
            }
            style={{ textDecoration: "none" }}
          >
            <p className="top-posts-post-writer-name">
              {currentWriter?.UserName}
            </p>
          </Link>
          <p className="top-posts-post-publish-date">
            {Writer && dateInThePast}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderPost;
