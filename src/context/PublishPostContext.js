import { createContext, useContext, useEffect, useState } from "react";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { doc, serverTimestamp } from "firebase/firestore";
import Typesense from "typesense";
import { useUserAuth } from "./UserAuthContext";
const PublishContext = createContext();

export function PublishContextProvider({ children }) {
  const [postData, setPostData] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const { user } = useUserAuth();
  function changePostContent(data) {
    setPostContent(data);
  }
  function changePostData(data) {
    setPostData(data);
  }
  useEffect(() => {
    const PostsRef = collection(db, "Posts");
    if (postData && postContent) {
      const addData = async () => {
        try {
          const postRef = await addDoc(PostsRef, {
            ...postData,
            createdAt: serverTimestamp(),
          });
          const postContentRef = await addDoc(collection(db, "PostFullData"), {
            ...postContent,
            createdAt: serverTimestamp(),
            id: postRef.id,
          });
          const addToTypesese = () => {
            let client = new Typesense.Client({
              nodes: [
                {
                  host: "496vwfrlxjpon1sqp-1.a1.typesense.net", // where xxx is the ClusterID of your Typesense Cloud cluster
                  port: 443,
                  protocol: "https",
                },
              ],
              apiKey: "oLh9YpwMMlZrmb4FXcqE3N71mohJGP06",
              connectionTimeoutSeconds: 2,
            });
            // const myCollection = {
            //   name: "posts",
            //   fields: [
            //     { name: "id", type: "string" },
            //     { name: "postTitle", type: "string" },
            //   ],
            // };
            // client.collections().create(myCollection);
            const document = {
              id: postRef.id,
              postTitle: postData?.Title,
            };
            return client.collections("posts").documents().create(document);
          };
          addToTypesese();
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const setLastPostDate = async () => {
              const setLastDate = await setDoc(
                userRef,
                {
                  lastPostDate: serverTimestamp(),
                  lastPostTitle: postData?.Title,
                  lastPost: postRef.id,
                },
                { merge: true }
              );
            };
            setLastPostDate();
          }
        } catch (err) {
          console.log(err);
        }
      };
      addData();
    }
  }, [postData]);
  return (
    <PublishContext.Provider
      value={{ postData, changePostData, changePostContent }}
    >
      {children}
    </PublishContext.Provider>
  );
}

export function usePublish() {
  return useContext(PublishContext);
}
