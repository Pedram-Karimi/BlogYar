import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";

import Typesense from "typesense";
import { useUserAuth } from "./UserAuthContext";
import { useNavigate } from "react-router-dom";

const PublishContext = createContext<any>(null);

type ChildComponents = {
  children: JSX.Element;
};

export function PublishContextProvider({ children }: ChildComponents) {
  const [postData, setPostData] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  function changePostContent(data) {
    setPostContent(data);
  }
  function changePostData(data) {
    setPostData(data);
  }
  useEffect(() => {
    const PostsRef = collection(db, "Posts");

    const addData = async () => {
      if (postData && postContent) {
        try {
          const postRef = await addDoc(PostsRef, {
            ...(postData as Record<string, unknown>),
            createdAt: serverTimestamp(),
          });
          const postContentRef = await addDoc(collection(db, "PostFullData"), {
            ...(postContent as Record<string, unknown>),
            createdAt: serverTimestamp(),
            id: postRef.id,
          });
          const addToTypesese = () => {
            let client = new Typesense.Client({
              nodes: [
                {
                  host: "j5i61nycs892ab3vp-1.a1.typesense.net",
                  port: 443,
                  protocol: "https",
                },
              ],
              apiKey: "w9NW4izFebq67SNnaD9mI1pxjKWVHATA",
              connectionTimeoutSeconds: 2,
            });
            // const myCollection: any = {
            //   name: "posts",
            //   fields: [
            //     { name: "id", type: "string" },
            //     { name: "postTitle", type: "string" },
            //   ],
            // };
            // client.collections().create(myCollection);

            const document = {
              id: postRef.id,
              postTitle: postData["Title"],
            };
            return client.collections("posts").documents().create(document);
          };
          addToTypesese();
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const setLastDate = await setDoc(
              userRef,
              {
                lastPostDate: serverTimestamp(),
                lastPostTitle: postData["Title"],
                lastPost: postRef.id,
              },
              { merge: true }
            );
          }
          console.log("sallamss");
          navigate("/");
        } catch (err) {
          console.log(err);
        }
      }
    };
    addData();
  }, [postData]);
  return (
    <PublishContext.Provider value={{ changePostData, changePostContent }}>
      {children}
    </PublishContext.Provider>
  );
}

export function usePublish() {
  return useContext(PublishContext);
}
