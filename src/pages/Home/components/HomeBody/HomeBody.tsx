import { useEffect, useState } from "react"; // react-hooks

import { db } from "../../../../Firebase/FirebaseConfig"; // firebase db ref

// firestore tools

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// contexts

import { useFullPost } from "../../../../context/FullPostContext";

// components

import Post from "../../../../components/Post/Post";
import BestWriters from "./components/BestWriters";

import "./homeBody.css"; // styles

// post's interface

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

const HomeBody: React.FC = () => {
  //--
  // variables---

  const [lastVisible, setLastVisible] = useState<any>();
  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);

  // use contexts

  const { changeLeftOverData } = useFullPost();

  // get posts from db ------------------------------

  useEffect(() => {
    const getData = async () => {
      const first = query(
        collection(db, "Posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const documentSnapshots = await getDocs(first);
      documentSnapshots.docs.forEach((shot) => {
        console.log();
        setPosts((pervPosts) => [
          ...pervPosts,
          { ...shot.data(), id: shot.id },
        ]);
        changeLeftOverData((pervPosts) => [
          ...pervPosts,
          { ...shot.data(), id: shot.id },
        ]);
      });
      const lastVisibleShot =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleShot);
    };
    getData();
  }, []);

  // jsx---
  return (
    <div className="home-body">
      <div className="body-content-container">
        <div className="post-wrapper">
          {posts.length !== 0 &&
            posts.map((post, index) => {
              return <Post key={index} {...post} />;
            })}
        </div>
        <BestWriters />
      </div>
    </div>
  );
};

export default HomeBody;
