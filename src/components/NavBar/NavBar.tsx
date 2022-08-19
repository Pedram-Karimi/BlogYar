import "./navBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import SearchPopup from "./components/SearchPopup";
import { useSearchBoxContext } from "../../context/SearchBoxContext";
type pageProp = {
  createPost?: boolean;
  postContent?: string;
  postTitle?: string;
};
function NavBar(props: pageProp) {
  const { user, userDataState } = useUserAuth();
  const { activeSearchBox, changeActiveSearchBox } = useSearchBoxContext();
  let navigate = useNavigate();
  function saveLocalPost() {
    let title = props.postTitle;
    let content = props.postContent;
    localStorage.setItem("post", JSON.stringify({ title, content }));
  }
  const showSearchBox = () => {
    changeActiveSearchBox(true);
  };
  return (
    <>
      <div className="navBar">
        <div className="left-section">
          <Link to="/" style={{ textDecoration: "none" }}>
            <p className="logo">BlogYar</p>
          </Link>
          <Link to="/post/create" style={{ textDecoration: "none" }}>
            <p className="create-new-post">
              {user ? "write a new post" : "what is BlogYar?"}
            </p>
          </Link>
        </div>
        <div className="right-section">
          {/**search icon */}
          {!props.createPost ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              className="search-btn"
              onClick={showSearchBox}
            >
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
            </svg>
          ) : (
            <p
              className="publish-post-btn"
              onClick={() => {
                if (props.postTitle && props.postContent) {
                  saveLocalPost();
                  navigate("/post/publish");
                }
              }}
            >
              Publish your post
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="post-publish-arrow"
              >
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
              </svg>
            </p>
          )}
          {!user && (
            <div className="login-and-signup">
              <Link to="/Login" className="login-link link">
                <div className="login-btn">login</div>
              </Link>
              <Link to="/sign-up" className="sign-up-link link">
                <div className="signup-btn">sign-up</div>
              </Link>
            </div>
          )}
          {user && (
            <Link to="/profile">
              {userDataState?.UserProfile ? (
                <img
                  className="user-avatar"
                  src={userDataState?.UserProfile}
                  alt="profile img"
                />
              ) : (
                <img
                  className="user-avatar"
                  src={"../images/avatar.jpg"}
                  alt="profile img"
                />
              )}
            </Link>
          )}
        </div>
      </div>
      {activeSearchBox && <SearchPopup />}
    </>
  );
}

export default NavBar;
