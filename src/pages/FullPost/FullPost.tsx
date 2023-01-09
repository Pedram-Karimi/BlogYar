// react-hooks ---
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// ---
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  limit,
  setDoc,
  arrayUnion,
} from "firebase/firestore"; // firestore

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

// contexts ---

import { useUserAuth } from "../../context/UserAuthContext";

import { CommentContextProvider } from "../../context/CommentContext";

import "./fullPost.css"; // styles ---

// components ---

import parse from "html-react-parser";
import PostWriter from "./components/PostWriter";
import PostConfig from "./components/PostConfig";
import RelatedPost from "./components/RelatedPost";
import CommentSection from "./components/CommentSection";

const FullPost: React.FC<{}> = () => {
  //---

  // variables ---

  const { id } = useParams();
  const [postContent, setPostContent] = useState<any>();
  const [writerDetail, setWriterDetail] = useState<any>();
  const [relatedPostsTags, setRelatedPostsTags] = useState<any>();
  const { user } = useUserAuth();

  // use contexts

  //get post's writer info ------------------------------

  useEffect(() => {
    if (!postContent) {
      return;
    }
    const userRef = doc(db, "users", postContent.Writer);
    try {
      const getData = async () => {
        const getWriter = await getDoc(userRef);
        setWriterDetail(getWriter.data());
      };
      getData();
    } catch (err) {}
  }, [postContent]);

  //get post content ------------------------------

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(db, "PostFullData"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setPostContent(doc.data());
      });
    };
    getData();
  }, []);

  // update post views ------------------------------

  useEffect(() => {
    if (user) {
      const postId = id ? id : "";
      const updateView = async () => {
        const postRef = doc(db, "Posts", postId);
        const getPost = await getDoc(postRef);
        const updatePostView = await setDoc(
          postRef,
          {
            Viewers: arrayUnion(user.uid),
            Views: getPost.data()?.Viewers.length,
          },
          { merge: true }
        );
      };
      updateView();
    }
  }, [user]);

  // shuffle post tags ------------------------------

  useEffect(() => {
    if (postContent) {
      let shuffled =
        postContent &&
        postContent.Tags.map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      setRelatedPostsTags(shuffled);
    }
  }, [postContent]);

  // jsx ---
  return (
    <div className="full-post">
      <div className="full-post-body">
        <PostWriter
          postWriterId={postContent?.Writer}
          postWriterName={writerDetail?.UserName}
          postWriterPic={writerDetail?.UserProfile}
          createdAt={postContent?.createdAt?.seconds}
        />
        <div className="post-content">
          <h1 className="full-post-title">{postContent?.Title} </h1>
          <img className="post-main-image" src={postContent?.PostImage} />
          <div className="post-body">
            {!postContent && <p>Loading...</p>}
            {postContent && parse(postContent.Content)}
          </div>
          <PostConfig
            postWriterName={writerDetail?.UserName}
            postWriterPic={writerDetail?.UserProfile}
            postWriterId={postContent?.Writer}
            tags={postContent?.Tags}
            bio={writerDetail?.Bio}
            postId={id ? id : ""}
          />
        </div>
      </div>
      <div className="post-end">
        <div className="related-tags">
          <h2>Related posts</h2>
          <div className="related-posts">
            {/* <RelatedPost tags={relatedPostsTags && relatedPostsTags[0]} />
            <RelatedPost tags={relatedPostsTags && relatedPostsTags[1]} />
            <RelatedPost tags={relatedPostsTags && relatedPostsTags[2]} /> */}
          </div>
        </div>
        <div className="related-posts-container"></div>
        <CommentContextProvider>
          <CommentSection id={id} user={user} />
        </CommentContextProvider>
      </div>
    </div>
  );
};

export default FullPost;
