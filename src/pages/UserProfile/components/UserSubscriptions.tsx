import { useState, useEffect } from "react"; // react-hooks

import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore"; // firestore tools

// contexts

import { useFullPost } from "../../../context/FullPostContext";
import { useUserAuth } from "../../../context/UserAuthContext";

import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref

import { Link } from "react-router-dom"; // react-router tools

// user interface

interface User {
  Bio: string;
  Followers: number;
  TotalLikes: number;
  UserName: string;
  UserProfile: string;
  id: string;
  lastPost: string;
  lastPostDate: {
    seconds: number;
    nanoseconds: number;
  };
  lastPostTitle: string;
}

const UserSubscriptions: React.FC = () => {
  //---
  // variable---

  const [lastVisible, setLastVisible] = useState<any>();
  const [subedUsers, setSubedUsers] = useState<User[] | { id: string }[]>([]);

  // use contexts---

  const { user, userSubs } = useUserAuth();
  const { changeLeftOverData } = useFullPost();

  // get subed writers ------------------------------

  useEffect(() => {
    const getData = async () => {
      if (!userSubs) {
        return;
      }
      const first = query(
        collection(db, "users"),
        where("id", "in", userSubs),
        limit(10)
      );
      const documentSnapshots = await getDocs(first);
      documentSnapshots.docs.forEach((shot) => {
        setSubedUsers((pervPosts) => [
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

  // handle follow function ------------------------------

  const handleFollow = async (personId) => {
    if (user) {
      const subsRef = doc(db, "subscriptions", user?.uid);
      await setDoc(
        subsRef,
        {
          subscriptions: userSubs.includes(personId)
            ? arrayRemove(personId)
            : arrayUnion(personId),
        },
        { merge: true }
      );
      const updateWriterFollowerCount = async () => {
        const userRef = doc(db, "users", personId);
        try {
          await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
              throw "Document does not exist!";
            }
            const newFollowedData = userSubs.includes(personId)
              ? userDoc.data().Followers + -1
              : userDoc.data().Followers + 1;
            transaction.update(userRef, { Followers: newFollowedData });
          });
        } catch (e) {
          console.log("Transaction failed: ", e);
        }
      };
      updateWriterFollowerCount();
    }
  };

  //jsx---
  return (
    <div className="user-posts">
      <div className="subed-users-container">
        {subedUsers &&
          subedUsers.map((subedPerson, index) => {
            console.log(subedPerson);
            if (userSubs.includes(subedPerson.id))
              return (
                <div className="subed-user" key={index}>
                  <Link
                    to={`/user/${subedPerson?.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="subed-user-info">
                      <img src={subedPerson?.UserProfile} />
                      <p>{subedPerson?.UserName}</p>
                    </div>
                  </Link>
                  <button
                    className={`follow-btn ${
                      userSubs.includes(subedPerson.id) ? "followed-btn" : ""
                    }`}
                    onClick={() => handleFollow(subedPerson.id)}
                  >
                    {`${
                      !userSubs.includes(subedPerson.id) ? "Follow" : "Followed"
                    } `}
                    {!userSubs.includes(subedPerson.id) && (
                      <svg
                        fill="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        width="50px"
                        height="50px"
                      >
                        <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z" />
                      </svg>
                    )}
                  </button>
                </div>
              );
          })}
      </div>
    </div>
  );
};

export default UserSubscriptions;
