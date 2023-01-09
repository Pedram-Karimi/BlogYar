import { useEffect, useState } from "react"; // react-hooks

// firestore tools

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import { db } from "../../../../Firebase/FirebaseConfig"; // firebase db ref

import "./homeHeader.css"; // styles

// components

import HeaderPost from "./components/HeaderPost";
import WriteReq from "./components/WriteReq";

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

const HomeHeader: React.FC = () => {
  //--
  // variables ---

  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);

  // get top posts ------------------------------

  useEffect(() => {
    const getData = async () => {
      const postsCollectionRef = collection(db, "Posts");
      const q = query(
        postsCollectionRef,
        orderBy("Views", "desc"),
        orderBy("Likes", "desc"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      const getTopPosts = await getDocs(q);
      getTopPosts.docs.forEach((doc) => {
        setPosts((pervData) => [...pervData, { ...doc.data(), id: doc.id }]);
      });
    };
    getData();
  }, []);

  // jsx ---
  return (
    <div className="home-header">
      <h2>Top posts</h2>
      <div className="home-header-body">
        <div className="header-post-container">
          {posts.map((post, index) => {
            return <HeaderPost {...post} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
