import { useEffect, useState } from "react"; // react-hooks
import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref
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
        <div className="post-page-url">
          <svg viewBox="0 0 141.732 141.732" className="link-svg">
            <path d="M57.217,63.271L20.853,99.637c-4.612,4.608-7.15,10.738-7.15,17.259c0,6.524,2.541,12.653,7.151,17.261   c4.609,4.608,10.74,7.148,17.259,7.15h0.002c6.52,0,12.648-2.54,17.257-7.15L91.738,97.79c7.484-7.484,9.261-18.854,4.573-28.188   l-7.984,7.985c0.992,4.667-0.443,9.568-3.831,12.957l-37.28,37.277l-0.026-0.023c-2.652,2.316-6.001,3.579-9.527,3.579   c-3.768,0-7.295-1.453-9.937-4.092c-2.681-2.68-4.13-6.259-4.093-10.078c0.036-3.476,1.301-6.773,3.584-9.39l-0.021-0.02   l0.511-0.515c0.067-0.071,0.137-0.144,0.206-0.211c0.021-0.021,0.043-0.044,0.064-0.062l0.123-0.125l36.364-36.366   c2.676-2.673,6.23-4.144,10.008-4.144c0.977,0,1.947,0.101,2.899,0.298l7.993-7.995c-3.36-1.676-7.097-2.554-10.889-2.554   C67.957,56.124,61.827,58.663,57.217,63.271 M127.809,24.337c0-6.52-2.541-12.65-7.15-17.258c-4.61-4.613-10.74-7.151-17.261-7.151   c-6.519,0-12.648,2.539-17.257,7.151L49.774,43.442c-7.479,7.478-9.26,18.84-4.585,28.17l7.646-7.646   c-0.877-4.368,0.358-8.964,3.315-12.356l-0.021-0.022l0.502-0.507c0.064-0.067,0.134-0.138,0.201-0.206   c0.021-0.02,0.04-0.04,0.062-0.06l0.126-0.127l36.363-36.364c2.675-2.675,6.231-4.147,10.014-4.147   c3.784,0,7.339,1.472,10.014,4.147c5.522,5.521,5.522,14.51,0,20.027L76.138,71.629l-0.026-0.026   c-2.656,2.317-5.999,3.581-9.526,3.581c-0.951,0-1.891-0.094-2.814-0.278l-7.645,7.645c3.369,1.681,7.107,2.563,10.907,2.563   c6.523,0,12.652-2.539,17.261-7.148l36.365-36.365C125.27,36.988,127.809,30.859,127.809,24.337" />
          </svg>
          <p>page URL</p>
        </div>
      </div>
      <div className="post-writer-data">
        <Link
          to={postWriterId !== user?.uid ? `/user/${postWriterId}` : "/profile"}
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
