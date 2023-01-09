import { useEffect, useState } from "react"; // react-hooks

import {
  collection,
  query,
  where,
  limit,
  getDocs,
  documentId,
} from "firebase/firestore"; // firestore tools

import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref

// contexts

import { useUserAuth } from "../../../context/UserAuthContext";

// components

import Post from "../../../components/Post/Post";

// user's bookmarked posts

interface Posts {
  Description: string;
  Likes: number;
  PostImage: string;
  Tags: string[];
  Title: string;
  Viewers: string[];
  Views: number;
  Writer: string;
  createdAt: {
    seconds: string;
    nanoseconds: string;
  };
  id: string;
}

const UserBookmarks: React.FC = () => {
  //---
  // variables---

  const [lastVisible, setLastVisible] = useState<any>();
  const [bookMarkPosts, setBookMarkPosts] = useState<
    Posts[] | { id: string }[]
  >([]);

  // use contexts---

  const { userDataState, user, userBookmarks } = useUserAuth();

  // get user's bookmarked posts ------------------------------

  useEffect(() => {
    if (!userBookmarks) {
      return;
    }
    const getData = async () => {
      if (userBookmarks.length >= 1) {
        const first = query(
          collection(db, "Posts"),
          where(documentId(), "in", userBookmarks),
          limit(10)
        );
        const documentSnapshots = await getDocs(first);
        documentSnapshots.forEach((shot) => {
          setBookMarkPosts((pervPosts) => [
            ...pervPosts,
            { ...shot.data(), id: shot.id },
          ]);
        });
        const lastVisibleShot =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastVisible(lastVisibleShot);
      } else {
        setBookMarkPosts([]);
      }
    };
    getData();
  }, []);

  // jsx---
  return (
    <div className="user-posts">
      <div className="user-bookmarks">
        {bookMarkPosts &&
          bookMarkPosts.map((post, index) => {
            if (userBookmarks.includes(post.id))
              return <Post {...post} key={index} />;
          })}
      </div>
    </div>
  );
};

export default UserBookmarks;
