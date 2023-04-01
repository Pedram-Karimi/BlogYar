import { useEffect, useState } from "react"; // react-hooks
import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
  getDoc,
} from "firebase/firestore"; // firestore tools

//context

import { useUserAuth } from "../../../context/UserAuthContext";

import { Link } from "react-router-dom"; // react-router tools

//this is component props interface

interface Props {
  postWriterName: string;
  postWriterPic: string;
  postWriterId: string;
  tags: string[];
  bio: string;
  postId: string;
}

// component
const PostConfig: React.FC<Props> = ({
  postWriterName,
  postWriterPic,
  postWriterId,
  tags,
  bio,
  postId,
}) => {
  //---

  // use contexts

  const { user, userBookmarks, userLikes } = useUserAuth();

  // variables ---

  const [postLikes, setPostLikes] = useState<number>(0);
  const [bookmarkClass, setBookmarkClass] = useState<string>("");
  const [likesClass, setLikesClass] = useState<string>("");
  const navigate = useNavigate();

  // bookmark check ------------------------------

  useEffect(() => {
    if (userBookmarks)
      userBookmarks.includes(postId)
        ? setBookmarkClass("active-bookmark")
        : setBookmarkClass("");
  }, [userBookmarks]);

  // bookmarking function ------------------------------

  const handleBookmark = () => {
    const bookmarkRef = doc(db, "Bookmarks", user?.uid);
    setDoc(
      bookmarkRef,
      {
        bookmarks: userBookmarks.includes(postId)
          ? arrayRemove(postId)
          : arrayUnion(postId),
      },
      { merge: true }
    );
  };

  // like check ---

  useEffect(() => {
    if (userLikes)
      userLikes.includes(postId)
        ? setLikesClass("active-like")
        : setLikesClass("");
  });

  // likeing function ------------------------------

  const handleLike = async () => {
    if (user?.uid) {
      userLikes.includes(postId)
        ? setPostLikes((pervLikes) => pervLikes - 1)
        : setPostLikes((pervLikes) => pervLikes + 1);

      // db refs
      const likesRef = doc(db, "Likes", user?.uid);
      const postRef = doc(db, "Posts", postId);
      const writerRef = doc(db, "users", postWriterId);

      // set likes
      try {
        setDoc(likesRef, {
          likes: userLikes.includes(postId)
            ? arrayRemove(postId)
            : arrayUnion(postId),
        });

        // update like count in post document

        await runTransaction(db, async (transaction) => {
          const postDoc = await transaction.get(postRef);
          if (!postDoc.exists()) {
            throw "Document does not exist!";
          }
          const newLikedData = userLikes.includes(postId)
            ? postDoc.data().Likes + -1
            : postDoc.data().Likes + 1;
          transaction.update(postRef, { Likes: newLikedData });
        });

        // update like count in post writer document

        await runTransaction(db, async (transaction) => {
          const writerDoc = await transaction.get(writerRef);
          if (!writerDoc.exists()) {
            throw "Document does not exist!";
          }
          const newLikedData = userLikes.includes(postId)
            ? writerDoc.data().TotalLikes + -1
            : writerDoc.data().TotalLikes + 1;
          transaction.update(writerRef, { TotalLikes: newLikedData });
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate("/login");
    }
  };

  // get post Likes ------------------------------

  useEffect(() => {
    const getLikes = async () => {
      const postRef = doc(db, "Posts", postId);
      const getPostLikes = await getDoc(postRef);
      setPostLikes(getPostLikes.data()?.Likes);
    };
    getLikes();
  }, []);

  //jsx ---
  return (
    <div className="post-config">
      <div className="post-tags">
        {tags &&
          tags.map((tag, index) => {
            if (tag !== "")
              return (
                <p className="post-tag" key={index}>
                  {tag}
                </p>
              );
          })}
      </div>
      <div className="post-base-data">
        <div>
          <svg
            viewBox="0 -0.5 16 16"
            className={"heart-svg" + ` ${likesClass}`}
            onClick={handleLike}
          >
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
          </svg>
          <p>{postLikes}</p>
        </div>
        <svg className="comment-svg" viewBox="0 0 121.86 122.88">
          <title>comment</title>
          <path d="M30.28,110.09,49.37,91.78A3.84,3.84,0,0,1,52,90.72h60a2.15,2.15,0,0,0,2.16-2.16V9.82a2.16,2.16,0,0,0-.64-1.52A2.19,2.19,0,0,0,112,7.66H9.82A2.24,2.24,0,0,0,7.65,9.82V88.55a2.19,2.19,0,0,0,2.17,2.16H26.46a3.83,3.83,0,0,1,3.82,3.83v15.55ZM28.45,63.56a3.83,3.83,0,1,1,0-7.66h53a3.83,3.83,0,0,1,0,7.66Zm0-24.86a3.83,3.83,0,1,1,0-7.65h65a3.83,3.83,0,0,1,0,7.65ZM53.54,98.36,29.27,121.64a3.82,3.82,0,0,1-6.64-2.59V98.36H9.82A9.87,9.87,0,0,1,0,88.55V9.82A9.9,9.9,0,0,1,9.82,0H112a9.87,9.87,0,0,1,9.82,9.82V88.55A9.85,9.85,0,0,1,112,98.36Z" />
        </svg>
        <svg
          className={"bookmark-svg " + `${bookmarkClass}`}
          viewBox="0 -0.2 18 18"
          onClick={handleBookmark}
        >
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
      </div>
      <div className="post-writer-data">
        <Link
          to={
            postWriterId !== user?.uid ? `//user/${postWriterId}` : "//profile"
          }
          className="post-writer-data"
        >
          <img src={postWriterPic} />
          <div>
            <p className="post-writer-data-name">{postWriterName}</p>
            <p className="post-writer-data-bio">{bio}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostConfig;
