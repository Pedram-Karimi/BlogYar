import { useState } from "react"; // react-hooks

import { Link, useNavigate } from "react-router-dom"; // react-router tools

// contexts

import { useUserAuth } from "../../context/UserAuthContext";

import "./loginAndSignup.css"; // styles

const Login: React.FC = () => {
  // --

  // variables ---

  const [LoginEmail, setLoginEmail] = useState<string>("");
  const [LoginPassword, setLoginPassword] = useState<string>("");

  // use context ---

  const { signIn } = useUserAuth();

  let navigate = useNavigate(); // react-router navigate

  // handle user login ------------------------------

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signIn(LoginEmail, LoginPassword);
      return navigate("/");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // jsx ---
  return (
    <div className="signUp">
      <div className="container">
        <p>Login here</p>
        <div className="input_box">
          <form onSubmit={handleSubmit}>
            <input
              value={LoginEmail}
              placeholder="Email"
              required
              onChange={(e) => {
                setLoginEmail(e.target.value);
              }}
            />
            <input
              placeholder="Password"
              value={LoginPassword}
              required
              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}
            />
            <button className="signup_btn">Login</button>
          </form>
        </div>
        <div className="signUp-box">
          do not have account?
          <Link to="/sign-up" className="signup-link">
            sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
