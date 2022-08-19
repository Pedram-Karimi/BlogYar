import React from "react";
import { Link } from "react-router-dom";
import "./menu.css";
import { useUserAuth } from "../../context/UserAuthContext";
function Menu() {
  const { user } = useUserAuth();
  return (
    <div className="menu">
      <Link to="/" style={{ textDecoration: "none" }}>
        <p>First page</p>
      </Link>
      <Link to="/Newest-posts" style={{ textDecoration: "none" }}>
        <p>Newest posts</p>
      </Link>
    </div>
  );
}

export default Menu;
