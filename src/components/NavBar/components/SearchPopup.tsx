import { useState, useEffect } from "react"; // react-hooks

import Typesense from "typesense"; // typesence library

// components

import Post from "../../Post/Post";

import { doc, getDoc } from "firebase/firestore"; // firebase tools

import { db } from "../../../Firebase/FirebaseConfig"; // firebase db ref

// contexts

import { useSearchBoxContext } from "../../../context/SearchBoxContext";

// posts's interface

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

const SearchPopup: React.FC = () => {
  //--
  // variables ---

  const [searchInput, setSearchInput] = useState<string>();
  const [searchedPosts, setSearchedPosts] = useState<Posts[]>([]);
  const [posts, setPosts] = useState<Posts[] | { id: string }[]>([]);

  // use context ---

  const { changeActiveSearchBox } = useSearchBoxContext();

  // handle search with typesence ------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchedPosts([]);
    setPosts([]);
    if (!searchInput) {
      return;
    }
    let client = new Typesense.Client({
      nodes: [
        {
          host: "ufb1o5rgsay69lqpp-1.a1.typesense.net",
          port: 443,
          protocol: "https",
        },
      ],
      apiKey: "5UVV8GscWNk4SdcbQn8ElFggNYYS91Zm",
      connectionTimeoutSeconds: 2,
    });
    let search = {
      q: searchInput,
      query_by: "postTitle",
    };
    await client
      .collections("posts")
      .documents()
      .search(search)
      .then((searchResults) => {
        const searchResultRes: any = searchResults.hits;
        searchResultRes.forEach((postDoc) => {
          setSearchedPosts((pervItems) => [...pervItems, postDoc.document]);
        });
      });
  };

  // get post's that are searched ------------------------------

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

  // jsx ---
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
        <form
          onSubmit={(e) => {
            handleSearch(e);
          }}
        >
          <input
            className="search-box-item"
            placeholder="Search for posts..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
            </svg>
          </button>
        </form>
      </div>
      {/* <p className="resultFor-text">Results for {searchInput}</p> */}
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
};

export default SearchPopup;
