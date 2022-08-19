import { useEffect, useState } from "react"; // react-hooks

import "./postWriterProfile.css"; // styles

import { useParams } from "react-router-dom"; // react-router tools

import {
  collection,
  query,
  getDocs,
  where,
  limit,
  doc,
  getDoc,
} from "firebase/firestore"; // firestore tools

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

// contexts

import { useFullPost } from "../../context/FullPostContext";

// components

import NavBar from "../../components/NavBar/NavBar";
import Post from "../../components/Post/Post";

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

const PostWriterProfile: React.FC = () => {
  //--
  const { id } = useParams(); // page param

  // variables ---

  const [lastVisible, setLastVisible] = useState<any>();
  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);
  const [writerProfile, setWriterProfile] = useState<User>();

  // use contexts ---

  const { changeLeftOverData } = useFullPost();

  // get writer's data ------------------------------

  useEffect(() => {
    const getData = async () => {
      const writerId = id ? id : "";
      const writerRef = doc(db, "users", writerId);
      const getWriter = await getDoc(writerRef);
      setWriterProfile(getWriter.data());
    };
    getData();
  }, []);

  // get writer's posts ------------------------------

  useEffect(() => {
    if (!writerProfile) {
      return;
    }
    const getPostData = async () => {
      const first = query(
        collection(db, "Posts"),
        where("Writer", "==", id),
        limit(10)
      );
      const documentSnapshots = await getDocs(first);
      documentSnapshots.docs.forEach((shot) => {
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
    getPostData();
  }, [writerProfile]);

  // jsx ---
  return (
    <>
      <NavBar />
      <div className="post-writer-profile">
        <div className="post-writer-genral-info">
          <div className="post-writer-profile-pic">
            <img src={writerProfile?.UserProfile} />
          </div>
          <div className="post-writer-profile-name">
            <p className="post-writer-user-name">{writerProfile?.UserName}</p>
            <p className="post-writer-user-bio">{writerProfile?.Bio}</p>
          </div>
        </div>
        <div className="post-writer-short-info">
          <p>Followers: {writerProfile?.Followers}</p>
        </div>
        <div className="post-writer-all-posts">
          <div className="post-writer-all-posts-menu">
            <h2>Posts</h2>
          </div>
          <div className="user-posts">
            <div className="user-posts-post-container">
              {posts.length >= 1 &&
                posts.map((post, index) => {
                  return <Post {...post} key={index} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostWriterProfile;
