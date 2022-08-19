import { useEffect, useState } from "react"; // react-hooks

// firebase storage tools

import { storage } from "../../Firebase/FirebaseConfig"; // firebase storage ref
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

import { db } from "../../Firebase/FirebaseConfig"; // firebase db ref

import { doc, setDoc } from "firebase/firestore"; // firestore tools

import "./userDetail.css"; // styles

// contexts

import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

// componets

import UserPosts from "./components/UserPosts";
import UserBookmarks from "./components/UserBookmarks";
import UserSubscriptions from "./components/UserSubscriptions";

const UserDetail: React.FC = () => {
  //---
  // use contexts---

  const { logOut, user, userDataState, userSubs } = useUserAuth();

  // variables---

  const [imageUpload, setImageUpload] = useState<Blob>();
  const [profileImage, setProfileImage] = useState<string>();
  const [updateCheck, setUpdateCheck] = useState<Boolean>(false);
  const [postsMenu, setPostsMenu] = useState<string>("posts");
  const [currUserName, setCurrUserName] = useState<string>("");
  const [currUserBio, setCurrUserBio] = useState<string>("");

  const navigate = useNavigate(); // react-router navigate

  // uploud user profile pic to firebase storage ------------------------------

  useEffect(() => {
    try {
      if (imageUpload && user) {
        const imageRef = ref(storage, `${user?.uid + "_profilePic"}/img`);
        uploadBytes(imageRef, imageUpload).then(() => {
          setUpdateCheck(true);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [imageUpload, user]);

  // download uploaded img's url ------------------------------

  useEffect(() => {
    try {
      if (user && !userDataState?.UserProfile) {
        const imgListRef = ref(storage, `${user.uid + "_profilePic"}/`);
        listAll(imgListRef).then((response) => {
          getDownloadURL(response.items[0]).then((url) => {
            setProfileImage(url);
            setUpdateCheck(false);
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [updateCheck, user]);

  // set downloaded url to user's firestore document ------------------------------

  useEffect(() => {
    try {
      if (user && profileImage) {
        const userRef = doc(db, "users", user.uid);
        setDoc(
          userRef,
          {
            UserProfile: profileImage,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [profileImage, user, updateCheck]);

  // get the user's current username and bio ------------------------------

  useEffect(() => {
    if (userDataState.UserName) {
      setCurrUserName(userDataState.UserName);
      setCurrUserBio(userDataState?.Bio);
    }
  }, [userDataState]);

  // submit changes to firstore db ------------------------------

  const submitChange = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const setUpdatedData = await setDoc(
          userRef,
          {
            Bio: currUserBio,
            UserName: currUserName,
          },
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // jsx---
  return (
    <>
      <NavBar />
      <div className="user-detail">
        <div className="genrall-info-config">
          <button
            className="sign-out-btn"
            onClick={() => {
              logOut();
              navigate("/");
            }}
          >
            Sign out
          </button>
          <div
            className="change-profile-pic-div"
            style={{
              background: `url(${userDataState?.UserProfile})`,
            }}
          >
            <label htmlFor="inputTag-avatar" className="inputTag-avatar">
              <input
                type="file"
                id="inputTag-avatar"
                className="choose-file"
                onChange={(e: any) => {
                  setImageUpload(e.target.files[0]);
                }}
              />
            </label>
            <div>
              <img src="../svg/photo-camera-svgrepo-com.svg" />
            </div>
          </div>
          <div className="genral-info-edit">
            <input
              className="current-user-name"
              value={currUserName}
              onChange={(e) => {
                setCurrUserName(e.target.value);
              }}
            />
            <input
              className="current-user-bio"
              value={currUserBio}
              placeholder="Bio"
              onChange={(e) => {
                setCurrUserBio(e.target.value);
              }}
            />
            <button
              className={`submit-profile-chnage ${
                currUserBio === userDataState?.Bio &&
                currUserName === userDataState?.UserName &&
                "submit-profile-chnage-disable"
              }`}
              onClick={submitChange}
            >
              submit
            </button>
          </div>
        </div>
        <div className="current-user-short-info">
          <p>Followers: {userDataState?.Followers}</p>
          <p>Subscriptions: {userSubs?.length}</p>
        </div>
        <div className="user-posts-menu">
          <h2
            className={postsMenu == "posts" ? "posts-menu-active" : ""}
            onClick={() => {
              setPostsMenu("posts");
            }}
          >
            Your posts
          </h2>
          <h2
            className={postsMenu == "bookmarks" ? "posts-menu-active" : ""}
            onClick={() => {
              setPostsMenu("bookmarks");
            }}
          >
            Book marks
          </h2>
          <h2
            className={postsMenu == "Subscriptions" ? "posts-menu-active" : ""}
            onClick={() => {
              setPostsMenu("Subscriptions");
            }}
          >
            Subscriptions
          </h2>
        </div>
        {postsMenu == "posts" && <UserPosts />}
        {postsMenu == "bookmarks" && <UserBookmarks />}
        {postsMenu == "Subscriptions" && <UserSubscriptions />}
      </div>
    </>
  );
};

export default UserDetail;
