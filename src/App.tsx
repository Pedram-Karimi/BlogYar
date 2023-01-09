import { Route, Routes } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext";
import { PublishContextProvider } from "./context/PublishPostContext";
import { ShBoxContextProvider } from "./context/SearchBoxContext";

//  responsive styles

import "./responsive/responsive.css";

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
import NavBar from "./components/NavBar/NavBar";

//--
const App: React.FC<{}> = () => {
  console.log("render");
  return (
    <div className="app">
      <UserAuthProvider>
        <>
          <ShBoxContextProvider>
            <NavBar />
          </ShBoxContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Newest-posts" element={<NewestPosts />} />
            <Route path="/post/:id" element={<FullPost />} />
            <Route path="/post/create" element={<CreatePost />} />
            <Route
              path="/post/publish"
              element={
                <PublishContextProvider>
                  <PublishPost />
                </PublishContextProvider>
              }
            />
            <Route path="/profile" element={<UserDetail />} />
            <Route path="/user/:id" element={<PostWriterProfile />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </>
      </UserAuthProvider>
    </div>
  );
};

export default App;
