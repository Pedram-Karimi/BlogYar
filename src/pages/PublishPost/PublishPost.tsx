import { useEffect, useState } from "react"; // react-hooks

import "./publishPost.css"; // styles

// contexts

import { usePublish } from "../../context/PublishPostContext";
import { useUserAuth } from "../../context/UserAuthContext";

// firebase storage

import { storage } from "../../Firebase/FirebaseConfig"; // firebase storage ref
import { listAll, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useNavigate } from "react-router-dom"; // react-router navigate

const { v4 } = require("uuid"); // random id generator library

const PublishPost: React.FC = () => {
  //---
  //variables ----

  const localPosts = JSON.parse(localStorage.getItem("post") || "{}");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState(localPosts.title);
  const [imageUpload, setImageUpload] = useState<any>();
  const [tempPostImg, setTemPostImage] = useState<
    string | ArrayBuffer | null
  >();
  const [postImgUrl, setPostImgUrl] = useState<string>();
  const [updateCheck, setUpdateCheck] = useState<Boolean>(false);
  const [postImageState, setPostImageState] = useState<any>();
  const [submitBtnClass, setSubmitBtnClass] = useState<string>("submit-post");

  const navigate = useNavigate(); // react-router navigate

  // use context ---

  const { user } = useUserAuth();
  const { changePostData, changePostContent } = usePublish();

  // makeing temperory post ------------------------------

  useEffect(() => {
    if (imageUpload) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setTemPostImage(reader.result);
        }
      };
      reader.readAsDataURL(imageUpload);
    }
  }, [imageUpload]);

  // pasting a random id to post's image name

  useEffect(() => {
    if (imageUpload) {
      setPostImgUrl(imageUpload?.name + v4());
    }
  }, [imageUpload]);

  // publish post to firestore db

  const publishPost = () => {
    setSubmitBtnClass("submit-post disable");
    if (imageUpload && description && tags.length === 5 && title) {
      const imageRef = ref(storage, `${postImgUrl}/img`);
      uploadBytes(imageRef, imageUpload).then(() => {
        const imgListRef = ref(storage, postImgUrl);
        listAll(imgListRef).then((response) => {
          getDownloadURL(response.items[0]).then((url) => {
            setPostImageState(url);
            setUpdateCheck(true);
          });
        });
      });
      //navigate("/");
    } else {
      alert("fill the inputs");
    }
  };
  useEffect(() => {
    if (updateCheck) {
      changePostContent({
        PostImage: postImageState,
        Title: title,
        Tags: tags,
        Writer: user.uid,
        Content: localPosts.content,
      });
      changePostData({
        Title: title,
        Description: description,
        Tags: tags,
        PostImage: postImageState,
        Writer: user.uid,
        Likes: 0,
        Viewers: [],
        Views: 0,
      });
      localStorage.clear();
    }
  }, [updateCheck]);
  // jsx ---
  return (
    <div className="publish-post-container">
      <div className="publish-post">
        <div className="publish-div-right-side">
          <p className="publish-post-title">Thumbnail of post</p>
          <p className="publish-post-text">
            In here you can choose the way your post look on the website.
          </p>
          <div
            className="publish-post-img"
            style={{ background: `url(${tempPostImg})` }}
          >
            <label htmlFor="inputTag" className="inputTag">
              <input
                type="file"
                id="inputTag"
                className="choose-file"
                onChange={(e: any) => {
                  setImageUpload(e.target.files[0]);
                }}
              />
            </label>
            <svg viewBox="0 0 58 58">
              <path
                d="M31,56h24V32H31V56z M33,34h20v20h-9V41.414l4.293,4.293l1.414-1.414L43,37.586l-6.707,6.707l1.414,1.414L42,41.414V54h-9
		V34z"
              />
              <path
                d="M21.569,13.569C21.569,10.498,19.071,8,16,8s-5.569,2.498-5.569,5.569c0,3.07,2.498,5.568,5.569,5.568
		S21.569,16.64,21.569,13.569z M12.431,13.569C12.431,11.602,14.032,10,16,10s3.569,1.602,3.569,3.569S17.968,17.138,16,17.138
		S12.431,15.537,12.431,13.569z"
              />
              <path
                d="M6.25,36.661C6.447,36.886,6.723,37,7,37c0.234,0,0.47-0.082,0.66-0.249l16.313-14.362l7.319,7.318
		c0.391,0.391,1.023,0.391,1.414,0s0.391-1.023,0-1.414l-1.825-1.824l9.181-10.054l11.261,10.323
		c0.408,0.373,1.04,0.345,1.413-0.062c0.373-0.407,0.346-1.04-0.062-1.413l-12-11c-0.196-0.179-0.452-0.279-0.72-0.262
		c-0.265,0.012-0.515,0.129-0.694,0.325l-9.794,10.727l-4.743-4.743c-0.374-0.372-0.972-0.391-1.368-0.044L6.339,35.249
		C5.925,35.614,5.884,36.246,6.25,36.661z"
              />
              <path
                d="M57,2H1C0.448,2,0,2.447,0,3v44c0,0.553,0.448,1,1,1h24c0.552,0,1-0.447,1-1s-0.448-1-1-1H2V4h54v23c0,0.553,0.448,1,1,1
		s1-0.447,1-1V3C58,2.447,57.552,2,57,2z"
              />
            </svg>
          </div>
          <input
            placeholder="title"
            style={{ fontWeight: "bold", fontSize: "25px" }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            placeholder="Write description"
            cols={44}
            rows={2}
            maxLength={120}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <p
            style={{
              padding: "0px 10px",
              borderBottom: "1px solid var(--light-border)",
              marginTop: "0px",
              direction: "rtl",
              fontSize: "10px",
              paddingBottom: "8px",
              color: "var(--light-color)",
            }}
          >
            {`${description.length}/120`}
          </p>
        </div>
        <div className="publish-div-left-side">
          <p className="publish-post-title">Make your post easier to find</p>
          <p className="publish-post-text">
            Add Maximum 5 tags to let your audience know what is your post
            about.
          </p>
          <div className="publish-post-tag-div">
            {tags.map((tag, index) => {
              return (
                <p
                  className={tag === "" ? "ignore" : `publish-post-tag`}
                  key={index}
                >
                  {tag}
                  <svg
                    x="0px"
                    y="0px"
                    viewBox="0 0 92.132 92.132"
                    onClick={() => {
                      setTags((pervTags) =>
                        pervTags.filter((tagItem) => {
                          return tag !== tagItem;
                        })
                      );
                    }}
                  >
                    <path
                      d="M2.141,89.13c1.425,1.429,3.299,2.142,5.167,2.142c1.869,0,3.742-0.713,5.167-2.142l33.591-33.592L79.657,89.13
			c1.426,1.429,3.299,2.142,5.167,2.142c1.867,0,3.74-0.713,5.167-2.142c2.854-2.854,2.854-7.48,0-10.334L56.398,45.205
			l31.869-31.869c2.855-2.853,2.855-7.481,0-10.334c-2.853-2.855-7.479-2.855-10.334,0L46.065,34.87L14.198,3.001
			c-2.854-2.855-7.481-2.855-10.333,0c-2.855,2.853-2.855,7.481,0,10.334l31.868,31.869L2.143,78.795
			C-0.714,81.648-0.714,86.274,2.141,89.13z"
                    />
                  </svg>
                </p>
              );
            })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tagInput && !tags.includes(tagInput)) {
                  setTags((pervTags) => [...pervTags, tagInput]);
                }
                setTagInput("");
              }}
            >
              {tags.length !== 5 && (
                <input
                  onChange={(e) => {
                    setTagInput(e.target.value);
                  }}
                  value={tagInput}
                  placeholder="Add tag..."
                  className="publish-post-tag-input"
                />
              )}
            </form>
          </div>
          <div className={submitBtnClass} onClick={publishPost}>
            Publish post
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
