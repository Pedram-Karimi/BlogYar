import { useEffect, useState } from "react"; // react-hooks

// firestore tools

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../../../Firebase/FirebaseConfig"; // firebase db ref

// components

import TopWriter from "./TopWriter";

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

const BestWriters: React.FC = () => {
  //--
  // variables ---

  const [writers, setWriters] = useState<User[]>([]);

  // get best writers ------------------------------

  useEffect(() => {
    const getData = async () => {
      const postsCollectionRef = collection(db, "users");
      const q = query(
        postsCollectionRef,
        orderBy("lastPostDate", "desc"),
        orderBy("Followers", "desc"),
        orderBy("TotalLikes", "desc"),
        limit(4)
      );
      const getTopPosts = await getDocs(q);
      getTopPosts.docs.forEach((doc) => {
        setWriters((pervData) => [...pervData, { ...doc.data(), id: doc.id }]);
      });
    };
    getData();
  }, []);

  // jsx ---
  return (
    <div className="best-writers">
      <h2>Best writers</h2>
      <div className="top-writers-container">
        {writers.map((writer, index) => {
          return <TopWriter {...writer} key={index} />;
        })}
      </div>
    </div>
  );
};

export default BestWriters;
