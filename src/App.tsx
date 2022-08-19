import { Route, Routes } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext";
import { PublishContextProvider } from "./context/PublishPostContext";
import { FullPostContextProvider } from "./context/FullPostContext";
import { ShBoxContextProvider } from "./context/SearchBoxContext";
import { CommentContextProvider } from "./context/CommentContext";
//components
import Home from "./pages/Home/Home";
import Login from "./pages/LoignAndSignup/Login";
import SignUp from "./pages/LoignAndSignup/SignUp";
import NewestPosts from "./pages/NewestPost/NewestPosts";
import FullPost from "./pages/FullPost/FullPost";
import CreatePost from "./pages/CreatePost/CreatePost";
import PublishPost from "./pages/PublishPost/PublishPost";
import UserDetail from "./pages/UserProfile/UserDetail";
import PostWriterProfile from "./pages/PostWriterProfile/PostWriterProfile";
const App: React.FC<{}> = () => {
  return (
    <div className="app">
      <UserAuthProvider>
        <PublishContextProvider>
          <FullPostContextProvider>
            <CommentContextProvider>
              <ShBoxContextProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Newest-posts" element={<NewestPosts />} />
                  <Route path="/post/:id" element={<FullPost />} />
                  <Route path="/post/create" element={<CreatePost />} />
                  <Route path="/post/publish" element={<PublishPost />} />
                  <Route path="/profile" element={<UserDetail />} />
                  <Route path="/user/:id" element={<PostWriterProfile />} />
                  <Route path="/Login" element={<Login />} />
                  <Route path="/sign-up" element={<SignUp />} />
                </Routes>
              </ShBoxContextProvider>
            </CommentContextProvider>
          </FullPostContextProvider>
        </PublishContextProvider>
      </UserAuthProvider>
    </div>
  );
};

export default App;
