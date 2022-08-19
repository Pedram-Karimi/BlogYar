import Typesense from "typesense";
import { useUserAuth } from "../../../context/UserAuthContext";
import { useState, useEffect } from "react";
import Post from "../../Post/Post";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig";
import { useSearchBoxContext } from "../../../context/SearchBoxContext";
function SearchPopup() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedPosts, setSearchedPosts] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);
  const { changeActiveSearchBox } = useSearchBoxContext();
  useEffect(() => {
    // checks
    setSearchedPosts([]);
    setPosts([]);
    if (!searchInput) {
      return;
    }
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
    let search = {
      q: searchInput,
      query_by: "postTitle",
    };
    client
      .collections("posts")
      .documents()
      .search(search)
      .then((searchResults) => {
        const searchResultRes: any = searchResults.hits;
        searchResultRes.forEach((postDoc) => {
          setSearchedPosts((pervItems) => [...pervItems, postDoc.document]);
        });
      });
  }, [searchInput]);
  useEffect(() => {
    if (searchedPosts.length) {
      searchedPosts.forEach(async (postId) => {
        const postRef = doc(db, "Posts", postId.id);
        const getPost = await getDoc(postRef);
        setPosts((pervPosts) => [
          ...pervPosts,
          { ...getPost.data(), id: postId.id },
        ]);
      });
    }
  }, [searchedPosts]);
  return (
    <div className="search-popup">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        width="48"
        className="search-close-icon"
        onClick={() => {
          changeActiveSearchBox(false);
        }}
      >
        <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
      </svg>
      <div className="search-box">
        <input
          className="search-box-item"
          placeholder="Search for posts..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <p className="resultFor-text">Results for {searchInput}</p>
      <div className="search-result">
        <div className="search-posts-wrapper">
          {posts.length !== 0 &&
            posts.map((post, index) => {
              return <Post key={index} {...post} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default SearchPopup;
