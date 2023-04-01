import { Link } from "react-router-dom"; // react-router link

import "./menu.css"; // styles

const Menu: React.FC<{}> = () => {
  //--

  // jsx ---
  return (
    <div className="menu">
      <Link to="/blogyar" style={{ textDecoration: "none" }}>
        <p>First page</p>
      </Link>
      <Link to="/blogyar/Newest-posts" style={{ textDecoration: "none" }}>
        <p>Newest posts</p>
      </Link>
    </div>
  );
};

export default Menu;
