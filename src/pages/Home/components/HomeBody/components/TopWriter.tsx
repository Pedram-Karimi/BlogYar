import { Link } from "react-router-dom"; // react-router Link

//contexts

import { useUserAuth } from "../../../../../context/UserAuthContext";

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

const TopWriter: React.FC<User> = ({
  id,
  UserProfile,
  lastPostTitle,
  lastPost,
  UserName,
}) => {
  //--

  // use contexts ---

  const { user } = useUserAuth();

  // jsx--
  return (
    <div className="top-writer">
      <Link
        to={id !== user?.uid ? `/user/${id}` : "//profile"}
        style={{ textDecoration: "none" }}
      >
        <img src={UserProfile} />
      </Link>
      <div className="top-writer-info">
        <Link to={`/post/${lastPost}`} style={{ textDecoration: "none" }}>
          <p className="top-writer-top-post">{lastPostTitle}</p>
        </Link>
        <Link
          to={id !== user?.uid ? `/user/${id}` : "//profile"}
          style={{ textDecoration: "none" }}
        >
          <p className="top-writer-name">{UserName}</p>
        </Link>
      </div>
    </div>
  );
};

export default TopWriter;
