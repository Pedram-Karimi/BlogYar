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
      // geting 30 days ago unix time

      let now = new Date();
      const backdate = new Date(now.setDate(now.getDate() - 30));

      const postsCollectionRef = collection(db, "users");
      const q = query(
        postsCollectionRef,
        where("lastPostDate", ">=", backdate),
        orderBy("lastPostDate", "desc"),
        orderBy("Followers", "desc"),
        orderBy("TotalLikes", "desc"),
        limit(5)
      );
      const getTopPosts = await getDocs(q);
      getTopPosts.docs.forEach((doc) => {
        setWriters((pervData) => [...pervData, { ...doc.data(), id: doc.id }]);
      });
    };
    getData();
  }, []);
  // console.log(writers);
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
