import { useEffect, useState } from "react"; // react-hooks

// firestore tools

import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig"; // firebaes db ref

// contexts

import { useUserAuth } from "../../../context/UserAuthContext";

// components

import Post from "../../../components/Post/Post";

// user's posts interface

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

const UserPosts: React.FC = () => {
  //---

  // variables---

  const [lastVisible, setLastVisible] = useState<any>();
  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);

  // use contexts---

  const { user } = useUserAuth();

  // get user's posts ------------------------------

  useEffect(() => {
    const getData = async () => {
      if (!user) {
        return;
      }
      const first = query(
        collection(db, "Posts"),
        where("Writer", "==", user.uid),
        limit(10)
      );
      const documentSnapshots = await getDocs(first);
      documentSnapshots.docs.forEach((shot) => {
        setPosts((pervPosts) => [
          ...pervPosts,
          { ...shot.data(), id: shot.id },
        ]);
      });
      const lastVisibleShot =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleShot);
    };
    getData();
  }, [user]);

  // jsx---
  return (
    <div className="user-posts">
      <div className="user-posts-post-container">
        {posts.length >= 1 &&
          posts.map((post, index) => {
            return <Post {...post} key={index} />;
          })}
      </div>
    </div>
  );
};

export default UserPosts;
