import { Link } from "react-router-dom"; // react-router link

// contexts

import { useUserAuth } from "../../../../../context/UserAuthContext";

const WriteReq: React.FC = () => {
  //--
  // use contexts ---

  const { user } = useUserAuth();

  // jsx ---
  return (
    <div className="write-req">
      <div>
        <h2>Do you have anything to say?</h2>
        <Link
          to={user?.uid ? "/post/create" : "/login"}
          style={{ textDecoration: "none" }}
        >
          <button>Write it</button>
        </Link>
      </div>
      <img src="./images/writerDude.jpg" />
    </div>
  );
};

export default WriteReq;
