import React, { useEffect, useState } from "react"; // react-hooks

import "./newestPosts.css"; // styels

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

// firestore tools

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// components

import Menu from "../../components/Menu/Menu";
import NavBar from "../../components/NavBar/NavBar";
import Post from "../../components/Post/Post";

// posts interface

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
    seconds: number;
    nanoseconds: number;
  };
  id: string;
}

const NewestPosts: React.FC = () => {
  //--
  // variables ---

  const [lastVisible, setLastVisible] = useState<any>();
  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);

  // get newest posts ------------------------------

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
      });
      const lastVisibleShot =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleShot);
    };
    getData();
  }, []);

  // jsx ---
  return (
    <div className="newest-posts">
      <NavBar />
      <Menu />
      <div className="posts-container">
        <h2
          style={{
            marginBottom: "40px",
            color: "var(--white-text)",
            borderBottom: "1px dotted var(--light-border)",
            padding: "10px 0px",
          }}
        >
          Newest posts in BlogYar
        </h2>
        {posts.length !== 0 &&
          posts.map((post, index) => {
            return <Post key={index} {...post} />;
          })}
      </div>
    </div>
  );
};

export default NewestPosts;
