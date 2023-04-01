import { useState } from "react"; // react-hooks

import { Link, useNavigate } from "react-router-dom"; // react-router tools

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

import { doc, setDoc } from "firebase/firestore"; // firestore tools

// firebase auth tools

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../Firebase/FirebaseConfig"; // firebase auth

import "./loginAndSignup.css"; // styles
const SignUp: React.FC = () => {
  //--

  // variables ---

  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [registerFirstName, setRegisterFirstName] = useState<string>("");
  const [error, setError] = useState<string>();

  let navigate = useNavigate(); // react-router navigate

  // create new user in db and handle auth ------------------------------

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const userRef = doc(db, "users", user.user.uid);
      setDoc(
        userRef,
        {
          UserName: registerFirstName,
          Bio: "",
          id: user.user.uid,
          Followers: 0,
          TotalLikes: 0,
        },
        { merge: true }
      );
      navigate("/blogyar");
    } catch (err: any) {
      setError(err.message.split("/")[1].split(")")[0]);
    }
  };

  // jsx --
  return (
    <div className="signUp">
      <div className="container">
        <p>Sign up here</p>
        <div className="input_box">
          <form onSubmit={handleSubmit}>
            <input
              value={registerFirstName}
              placeholder="First name"
              required
              onChange={(e) => {
                setRegisterFirstName(e.target.value);
              }}
            />
            <input
              value={registerEmail}
              placeholder="Email"
              required
              onChange={(e) => {
                setRegisterEmail(e.target.value);
              }}
            />
            <input
              placeholder="Password"
              value={registerPassword}
              required
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
            />
            {error && <p className="login-error-txt">{error}</p>}
            <button className="signup_btn">Sign up</button>
          </form>
        </div>
        <div className="signUp-box">
          do you have account?
          <Link to="/blogyar/login" className="signup-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
